import { describe, expect, it } from "vitest";
import { decodeShareHash, encodeShareData, SHARE_HASH_PREFIX } from "@/lib/share";
import { sampleBiodata } from "@/lib/biodata";

describe("share link encode/decode", () => {
  it("round-trips all data", () => {
    const encoded = encodeShareData(sampleBiodata);
    const decoded = decodeShareHash(SHARE_HASH_PREFIX + encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.personal!.name).toBe(sampleBiodata.personal.name);
    expect(decoded!.astro!.gotra).toBe(sampleBiodata.astro.gotra);
    expect(decoded!.template).toBe(sampleBiodata.template);
    expect(decoded!.outputLocale).toBe(sampleBiodata.outputLocale);
  });

  it("excludes the photo from the link", () => {
    const withPhoto = { ...sampleBiodata, photo: "data:image/jpeg;base64,AAAA" };
    const decoded = decodeShareHash(
      SHARE_HASH_PREFIX + encodeShareData(withPhoto),
    );
    expect(decoded!.photo).toBeUndefined();
  });

  it("rejects non-share and malformed hashes", () => {
    expect(decodeShareHash("#x=abc")).toBeNull();
    expect(decodeShareHash("#d=!!!notvalid")).toBeNull();
    expect(decodeShareHash("")).toBeNull();
  });
});
