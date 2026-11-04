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

describe("content hygiene", () => {
  const PROFESSION_TAGS = ["engineer", "doctor", "teacher", "business", "govt", "banker"];

  it("no {occupation}/{name} tokens anywhere — they contradict tags", () => {
    for (const s of SUGGESTIONS) {
      expect(s.en + s.hi).not.toMatch(/\{(occupation|name)[|}]/);
    }
  });

  it("every token has a pipe fallback (never bare {x})", () => {
    for (const s of SUGGESTIONS) {
      for (const m of (s.en + " " + s.hi).matchAll(/\{(\w+)(\|[^}]*)?\}/g)) {
        expect(m[2], `${s.id} {${m[1]}}`).toBeTruthy();
      }
    }
  });

  it("profession-tagged entries hardcode their profession (no {occupation})", () => {
    for (const s of SUGGESTIONS) {
      if (s.tags.some((t) => PROFESSION_TAGS.includes(t))) {
        expect(s.en + s.hi).not.toMatch(/\{occupation/);
      }
    }
  });

  it("filled text stays grammatical for the reported bug case", () => {
    const govt = SUGGESTIONS.find((s) => s.id === "am-govt")!;
    const out = fillPlaceholders(govt.en, sampleBiodata); // occupation=engineer
    expect(out).toContain("government job");
    expect(out).not.toContain("Software Engineer");
  });
});

describe("suggestionsFor", () => {
  it("empty tags returns all for the field", () => {
    expect(suggestionsFor("aboutMe", []).length).toBe(
      SUGGESTIONS.filter((s) => s.for === "aboutMe").length,
    );
  });
  it("ranks best matches first: all-tag matches beat partial", () => {
    const r = suggestionsFor("aboutMe", ["family", "calm"]);
    const hits = (s: (typeof SUGGESTIONS)[number]) =>
      ["family", "calm"].filter((t) => s.tags.includes(t)).length;
    expect(hits(r[0])).toBeGreaterThanOrEqual(hits(r[r.length - 1]));
    expect(hits(r[0])).toBe(2);
  });
  it("exhaustive: every tag pair and triple returns non-empty ranked results", () => {
    const kinds = ["aboutMe", "expectations"] as const;
    const combos: string[][] = [];
    for (let i = 0; i < allTags.length; i++)
      for (let j = i + 1; j < allTags.length; j++) {
        combos.push([allTags[i], allTags[j]]);
        for (let k = j + 1; k < allTags.length; k++)
          combos.push([allTags[i], allTags[j], allTags[k]]);
      }
    combos.push([...allTags]); // the full 22-tag selection
    for (const kind of kinds) {
      for (const c of combos) {
        const r = suggestionsFor(kind, c);
        expect(r.length, `${kind} ${c.join("+")}`).toBeGreaterThan(0);
        // every returned entry must match at least one active tag
        for (const s of r)
          expect(c.some((t) => s.tags.includes(t))).toBe(true);
      }
    }
  });
});
