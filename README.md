# ॥ शुभ बायोडाटा ॥ — Shubh Biodata

**Free, bilingual (English · हिन्दी) Hindu marriage biodata maker.**
Fill a guided form, pick a design, download a print-ready A4 PDF.
No sign-up · no uploads · your data never leaves your browser.

**Live:** https://nkunal1992.github.io/biodata-app/

## Features

- **Truly bilingual** — both the app UI (`/en`, `/hi`) and the generated
  biodata document work in English and Hindi, with correct Devanagari
  shaping (proper conjuncts like कृत्तिका, गणेशाय).
- **6 templates** — Traditional (saffron + ॥ श्री गणेशाय नमः ॥), Royal
  maroon & gold, Modern minimal (accent picker), Floral, Emerald
  two-column, Mandala watermark.
- **Hindu fields built in** — gotra, manglik status, rashi, nakshatra,
  birth time & place, caste/sub-caste, mother tongue, kuldevta,
  editable invocation line.
- **Live PDF preview** — the actual print document renders next to the
  form as you type (`@react-pdf/renderer` + `PDFViewer`).
- **Vector A4 PDF** — selectable text, embedded fonts, one-click download.
- **Photo** — resized in-browser (never uploaded), embedded in the biodata.
- **Auto-save + share links** — everything persists in `localStorage`;
  "Copy share link" encodes the form (sans photo) into the URL via lz-string.
- **Private by design** — fully static site; no backend, no accounts,
  no analytics, nothing sent anywhere.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'export'`) + TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl 4 (`/en`, `/hi` routes, static `generateStaticParams`) |
| PDF | @react-pdf/renderer + bundled TTFs (Noto Sans Devanagari, Rozha One, Noto Serif, Playfair Display) |
| State | zustand (persist → localStorage) |
| Share links | lz-string in URL hash |
| Hosting | GitHub Pages via Actions |

## Development

Prerequisites: Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /en
npm run build    # static export → out/
npx vitest run   # unit + PDF smoke tests
```

## How it works

- `src/pdf/templates/*.tsx` — the react-pdf `<Document>` per template is the
  **single source of truth** for both the live preview and the download.
- `src/pdf/labels.ts` — document labels per output language (independent
  of UI locale) + fonts per language. User-typed values always render in a
  font covering both scripts (`Noto Sans Devanagari` covers Latin too).
- `src/store/biodata-store.ts` — zustand store, auto-persisted.
- `messages/{en,hi}.json` — app UI strings.

## Contributing

Issues and PRs welcome — new templates, more languages, kundali/chart
embedding ideas, better photo handling.

## License

MIT — free for everyone, forever. No watermarks, no paywalls.
