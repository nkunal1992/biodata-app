import { Font } from "@react-pdf/renderer";
import { assetUrl } from "@/lib/asset";

let registered = false;

/**
 * Register all bundled TTFs. `base` defaults to the public/ URL in the
 * browser; tests pass an absolute filesystem path to public/fonts.
 */
export function registerFonts(base?: string): void {
  if (registered) return;
  registered = true;
  const f = (name: string) => (base ? `${base}/${name}` : assetUrl(`/fonts/${name}`));

  Font.register({
    family: "Devanagari",
    fonts: [
      { src: f("NotoSansDevanagari-Regular.ttf") },
      { src: f("NotoSansDevanagari-Bold.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "DevanagariDisplay",
    fonts: [{ src: f("RozhaOne-Regular.ttf") }],
  });
  Font.register({
    family: "Serif",
    fonts: [
      { src: f("NotoSerif-Regular.ttf") },
      { src: f("NotoSerif-Bold.ttf"), fontWeight: 700 },
      { src: f("NotoSerif-Italic.ttf"), fontStyle: "italic" },
    ],
  });
  Font.register({
    family: "Display",
    fonts: [{ src: f("PlayfairDisplay-SemiBold.ttf"), fontWeight: 600 }],
  });
}
