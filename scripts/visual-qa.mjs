/**
 * Visual QA — renders every template in a real browser and screenshots
 * the PDF preview pane. Usage:
 *   npm run build && node scripts/visual-qa.mjs [--locales en,hi]
 *
 * Requires playwright-core and a full Chromium binary (NOT
 * chrome-headless-shell, which cannot paint PDFs in iframes).
 * Looks for the cached Playwright "Google Chrome for Testing" binary.
 */
import { chromium } from "playwright-core";
import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { resolve, join, extname } from "path";
import { homedir } from "os";

const TEMPLATES = [
  "traditional","royal","modern","floral","emerald","mandala",
  "peacock","jharokha","toran","banarasi","kalash","navy",
];
const LOCALES = (process.argv.includes("--locales")
  ? process.argv[process.argv.indexOf("--locales") + 1]
  : "en").split(",");

// ---- find a full Chromium binary ----------------------------------------
function findChromium() {
  const roots = [
    `${homedir()}/Library/Caches/ms-playwright`,
    `${homedir()}/.cache/ms-playwright`,
  ];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    for (const dir of readdirSync(root).filter((d) => d.startsWith("chromium-")).sort().reverse()) {
      const mac = join(root, dir, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
      const mac2 = join(root, dir, "chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
      const lin = join(root, dir, "chrome-linux/chrome");
      for (const c of [mac, mac2, lin]) if (existsSync(c)) return c;
    }
  }
  throw new Error(
    "No full Chromium found — run `npx playwright install chromium` (not chromium_headless_shell)",
  );
}

// ---- tiny static server honoring the /biodata-app basePath ---------------
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };
function serve(dir, port) {
  return createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.startsWith("/biodata-app")) p = p.slice("/biodata-app".length) || "/";
    const rel = p.endsWith("/")
      ? [p + "index.html", p.slice(0, -1) + ".html"]
      : [p, p + ".html", p + "/index.html"];
    const target = rel
      .map((c) => resolve(dir, "." + c))
      .find((c) => { try { return statSync(c).isFile(); } catch { return false; } });
    if (!target) { res.writeHead(404); res.end("not found: " + p); return; }
    try {
      const data = readFileSync(target);
      res.writeHead(200, { "Content-Type": MIME[extname(target)] || "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404); res.end("not found");
    }
  }).listen(port);
}

// ---- sample biodata for seeding ------------------------------------------
const seed = (template) => ({
  template, outputLocale: "en", photo: null,
  invocation: "॥ श्री गणेशाय नमः ॥",
  personal: { name: "Aarav Sharma", dob: "1995-03-15", birthTime: "04:32", birthPlace: "Jaipur, Rajasthan", height: "5'10\"", weight: "72 kg", complexion: "fair", bloodGroup: "B+", maritalStatus: "never_married", diet: "vegetarian", residenceCity: "Jaipur", languages: "Hindi, English", hobbies: "Reading, Cricket" },
  astro: { religion: "Hindu", caste: "Brahmin", gotra: "Kaushik", rashi: "Vrishabha", nakshatra: "Krittika", manglik: "no" },
  career: { qualification: "B.Tech", occupation: "Senior Software Engineer", company: "Infosys", income: "22 LPA" },
  family: { fatherName: "Rajesh Sharma", fatherOccupation: "Retired Govt Officer", motherName: "Sunita Sharma", motherOccupation: "Homemaker", familyType: "nuclear", nativePlace: "Jaipur" },
  contact: { phone: "98XXXXXXXX", phoneOwner: "father", email: "family@example.com", address: "Malviya Nagar, Jaipur 302017" },
  aboutMe: "Simple, family-oriented person who values traditions and modern thinking equally.",
  expectations: "Looking for a well-educated, understanding partner from a respectable family.",
});

// ---- main -----------------------------------------------------------------
const OUT = "visual-qa/out";
mkdirSync(OUT, { recursive: true });
const server = serve("out", 0);
await new Promise((res) => server.once("listening", res));
const port = server.address().port;
console.log("serving out/ on :" + port);
const browser = await chromium.launch({ executablePath: findChromium() });
let n = 0;
for (const loc of LOCALES) {
  for (const tpl of TEMPLATES) {
    const p = await browser.newPage({ viewport: { width: 1400, height: 950 } });
    p.on("pageerror", (e) => console.log("  PAGEERR:", String(e).slice(0, 160)));
    const url = `http://localhost:${port}/biodata-app/${loc}/create/`;
    const data = { ...seed(tpl), outputLocale: loc };
    await p.goto(url, { waitUntil: "domcontentloaded" });
    await p.evaluate((d) => {
      localStorage.setItem("shubh-biodata", JSON.stringify({
        state: { data: d, drafts: { d: { data: d, updatedAt: 1 } }, activeId: "d" },
        version: 2,
      }));
    }, data);
    await p.reload({ waitUntil: "networkidle" });
    // wait for the PDF blob iframe to populate (bounded per check)
    for (let i = 0; i < 25; i++) {
      if ((await p.locator("iframe").count()) === 0) { await p.waitForTimeout(400); continue; }
      const src = await p.locator("iframe").first().getAttribute("src", { timeout: 800 }).catch(() => null);
      if (src?.startsWith("blob:")) { console.log(`  blob ready @${i}`); break; }
      await p.waitForTimeout(600);
    }
    await p.waitForTimeout(4500); // pdf paint
    const file = `${OUT}/${tpl}-${loc}.png`;
    // screenshot the whole page (form + preview) at desktop width
    await p.screenshot({ path: file, fullPage: false });
    n++;
    await p.close();
    console.log(`${tpl}-${loc}.png`);
  }
}
await browser.close();
server.close();
console.log(`✓ ${n} screenshots → ${OUT}/`);
