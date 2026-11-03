/**
 * Resolve a public/ asset path honoring the GitHub Pages basePath.
 * Only safe in the browser (and build) — react-pdf resolves it against origin.
 */
export function assetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
