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

  it("renders empty data without crashing", async () => {
    const { emptyBiodata } = await import("@/lib/biodata");
    const buf = await renderToBuffer(buildBiodataDocument(emptyBiodata));
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
