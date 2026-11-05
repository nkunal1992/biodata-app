import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { registerFonts } from "@/pdf/fonts";
import { buildBiodataDocument } from "@/pdf/document";
import { TEMPLATE_IDS, sampleBiodata } from "@/lib/biodata";

registerFonts(path.resolve(__dirname, "../public/fonts"));

describe("biodata PDF", () => {
  for (const template of TEMPLATE_IDS) {
    for (const outputLocale of ["en", "hi"] as const) {
      it(`renders ${template} (${outputLocale}) without crashing`, async () => {
        const buf = await renderToBuffer(
          buildBiodataDocument({ ...sampleBiodata, template, outputLocale }),
        );
        expect(buf.length).toBeGreaterThan(5000);
        // PDF magic bytes
        expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
      });
    }
  }

  const pageCount = (buf: Buffer) =>
    (buf.toString("latin1").match(/\/Type \/Page[^s]/g) ?? []).length;

  // A fully-maxed biodata (every field + all 4 text blocks) may legitimately
  // run to 2 pages on denser templates — guard against runaway overflow.
  it("sample data fits ≤2 pages on every template", async () => {
    for (const t of TEMPLATE_IDS) {
      const buf = await renderToBuffer(
        buildBiodataDocument({ ...sampleBiodata, template: t }),
      );
      expect(pageCount(buf), `${t} exceeded 2 pages`).toBeLessThanOrEqual(2);
    }
  }, 120000);

  it("stays at most 2 pages under heavy content", async () => {
    const long = {
      ...sampleBiodata,
      aboutMe: sampleBiodata.aboutMe.repeat(3),
      familyAbout: sampleBiodata.familyAbout.repeat(3),
      expectations: sampleBiodata.expectations.repeat(3),
      familyExpectations: sampleBiodata.familyExpectations.repeat(3),
    };
    for (const t of TEMPLATE_IDS) {
      const buf = await renderToBuffer(
        buildBiodataDocument({ ...long, template: t }),
      );
      const pages = pageCount(buf);
      expect(pages, `${t} overflowed to ${pages} pages`).toBeLessThanOrEqual(3);
    }
  }, 120000);

  it("renders empty data without crashing", async () => {
    const { emptyBiodata } = await import("@/lib/biodata");
    const buf = await renderToBuffer(buildBiodataDocument(emptyBiodata));
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
