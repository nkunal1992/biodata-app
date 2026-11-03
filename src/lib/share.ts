import LZString from "lz-string";
import type { BiodataData } from "./biodata";

export const SHARE_HASH_PREFIX = "#d=";

/** Serialize biodata (sans photo) into a URL-safe compressed string. */
export function encodeShareData(data: BiodataData): string {
  const rest: Partial<BiodataData> = { ...data };
  delete rest.photo;
  return LZString.compressToEncodedURIComponent(JSON.stringify(rest));
}

/** Parse a `#d=...` hash back into biodata fields. Returns null on failure. */
export function decodeShareHash(hash: string): Partial<BiodataData> | null {
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(
      hash.slice(SHARE_HASH_PREFIX.length),
    );
    if (!json) return null;
    const parsed = JSON.parse(json) as Partial<BiodataData>;
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}
