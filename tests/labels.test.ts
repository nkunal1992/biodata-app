import { describe, expect, it } from "vitest";
import {
  docLabels,
  formatBirthTime,
  formatDob,
  localizeDigits,
} from "@/pdf/labels";

function leafKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    leafKeys(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("doc labels", () => {
  it("en and hi have identical key structures", () => {
    const en = leafKeys(docLabels("en"));
    const hi = leafKeys(docLabels("hi"));
    expect(hi.sort()).toEqual(en.sort());
  });

  it("hi labels are non-empty strings", () => {
    const hi = docLabels("hi");
    for (const v of Object.values(hi.fields)) expect(v.length).toBeGreaterThan(0);
    for (const v of Object.values(hi.sections))
      expect(v.length).toBeGreaterThan(0);
  });
});

describe("formatting", () => {
  it("formats ISO dob in both locales", () => {
    expect(formatDob("1995-03-15", "en")).toBe("15 March 1995");
    expect(formatDob("1995-03-15", "hi")).toBe("१५ मार्च १९९५");
  });

  it("passes through non-ISO dob", () => {
    expect(formatDob("15/03/1995", "en")).toBe("15/03/1995");
  });

  it("formats 24h birth time", () => {
    expect(formatBirthTime("04:32", "en")).toBe("4:32 AM");
    expect(formatBirthTime("16:00", "en")).toBe("4:00 PM");
    expect(formatBirthTime("04:32", "hi")).toBe("सुबह ४:३२ बजे");
    expect(formatBirthTime("19:15", "hi")).toBe("शाम ७:१५ बजे");
  });

  it("localizes digits only for hi", () => {
    expect(localizeDigits("5'10\"", "hi")).toBe("५'१०\"");
    expect(localizeDigits("5'10\"", "en")).toBe("5'10\"");
  });
});
