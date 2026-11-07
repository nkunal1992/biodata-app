import { describe, expect, it } from "vitest";
import { buildSections } from "@/pdf/rows";
import { docLabels } from "@/pdf/labels";
import { encodeShareData, decodeShareHash, SHARE_HASH_PREFIX } from "@/lib/share";
import { sampleBiodata } from "@/lib/biodata";

const labels = docLabels("en");

describe("dynamic fields/sections", () => {
  it("hidden field is absent from rows", () => {
    const out = buildSections({ ...sampleBiodata, hiddenFields: ["personal.weight"] }, labels);
    const personal = out.find((s) => s.key === "personal")!;
    expect(personal.rows.map((r) => r.label)).not.toContain("Weight");
    expect(personal.rows.map((r) => r.label)).toContain("Height");
  });

  it("hidden section is absent entirely", () => {
    const out = buildSections({ ...sampleBiodata, hiddenSections: ["astro"] }, labels);
    expect(out.map((s) => s.key)).not.toContain("astro");
    expect(out.map((s) => s.key)).toContain("personal");
  });

  it("custom fields append to their parent section", () => {
    const out = buildSections(
      { ...sampleBiodata, customFields: [{ id: "c1", section: "family", label: "Uncle (Chacha)", value: "Mahesh Sharma" }] },
      labels,
    );
    const family = out.find((s) => s.key === "family")!;
    expect(family.rows).toContainEqual({ label: "Uncle (Chacha)", value: "Mahesh Sharma" });
  });

  it("custom field with empty label/value is skipped", () => {
    const out = buildSections(
      { ...sampleBiodata, customFields: [{ id: "c1", section: "family", label: "  ", value: "x" }] },
      labels,
    );
    const family = out.find((s) => s.key === "family")!;
    expect(family.rows.map((r) => r.label)).not.toContain("x");
  });

  it("sectionOrder reorders output", () => {
    const out = buildSections({ ...sampleBiodata, sectionOrder: ["family", "personal", "career", "astro", "contact"] }, labels);
    expect(out[0].key).toBe("family");
    expect(out[1].key).toBe("personal");
  });

  it("share link roundtrip preserves all overrides", () => {
    const data = {
      ...sampleBiodata,
      hiddenSections: ["astro"],
      hiddenFields: ["personal.weight"],
      customFields: [{ id: "c1", section: "family", label: "X", value: "Y" }],
      sectionOrder: ["family", "personal", "career", "astro", "contact"],
    };
    const decoded = decodeShareHash(`${SHARE_HASH_PREFIX}${encodeShareData(data)}`)!;
    expect(decoded.hiddenSections).toEqual(["astro"]);
    expect(decoded.hiddenFields).toEqual(["personal.weight"]);
    expect(decoded.customFields).toHaveLength(1);
    expect(decoded.sectionOrder).toEqual(["family", "personal", "career", "astro", "contact"]);
  });
});
