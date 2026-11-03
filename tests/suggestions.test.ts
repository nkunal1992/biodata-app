import { describe, expect, it } from "vitest";
import {
  SUGGESTIONS,
  TAG_GROUPS,
  fillPlaceholders,
  suggestionsFor,
} from "@/lib/suggestions";
import { emptyBiodata, sampleBiodata } from "@/lib/biodata";

const allTags = Object.values(TAG_GROUPS).flat();

describe("suggestion library", () => {
  it("every suggestion has en+hi text and valid tags", () => {
    for (const s of SUGGESTIONS) {
      expect(s.en.length).toBeGreaterThan(20);
      expect(s.hi.length).toBeGreaterThan(20);
      expect(s.tags.length).toBeGreaterThanOrEqual(1);
      for (const t of s.tags) expect(allTags).toContain(t);
    }
  });

  it("has ≥24 aboutMe and ≥20 expectations entries", () => {
    expect(SUGGESTIONS.filter((s) => s.for === "aboutMe").length).toBeGreaterThanOrEqual(24);
    expect(SUGGESTIONS.filter((s) => s.for === "expectations").length).toBeGreaterThanOrEqual(20);
  });
});

describe("fillPlaceholders", () => {
  it("fills known tokens from data", () => {
    const out = fillPlaceholders(
      "I work as a {occupation|professional} in {city|India}.",
      sampleBiodata,
    );
    expect(out).toContain("Senior Software Engineer");
    expect(out).toContain("Jaipur");
    expect(out).not.toContain("{");
  });

  it("uses pipe fallback when value empty", () => {
    const out = fillPlaceholders("I work as a {occupation|working professional}.", emptyBiodata);
    expect(out).toBe("I work as a working professional.");
  });

  it("never leaves raw braces or double spaces", () => {
    for (const s of SUGGESTIONS.slice(0, 10)) {
      const out = fillPlaceholders(s.en, emptyBiodata);
      expect(out).not.toMatch(/\{|\}/);
      expect(out).not.toMatch(/ {2}/);
    }
  });
});

describe("suggestionsFor", () => {
  it("empty tags returns all for the field", () => {
    expect(suggestionsFor("aboutMe", []).length).toBe(
      SUGGESTIONS.filter((s) => s.for === "aboutMe").length,
    );
  });
  it("filters to entries carrying all active tags", () => {
    const r = suggestionsFor("aboutMe", ["family"]);
    expect(r.length).toBeGreaterThan(0);
    for (const s of r) expect(s.tags).toContain("family");
  });
});
