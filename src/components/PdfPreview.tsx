"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PDFViewer, type DocumentProps } from "@react-pdf/renderer";
import { useBiodataStore } from "@/store/biodata-store";
import { buildBiodataDocument } from "@/pdf/document";

// Keep react-pdf out of the server bundle entirely.
const Viewer = dynamic(
  () =>
    Promise.resolve(function Inner({
      doc,
    }: {
      doc: React.ReactElement<DocumentProps>;
    }) {
      return (
        <PDFViewer
          width="100%"
          height="100%"
          style={{ border: "none" }}
          showToolbar={false}
        >
          {doc}
        </PDFViewer>
      );
    }),
  { ssr: false },
);

/** Debounce store changes so the PDF regenerates at most ~every 400ms. */
function useDebounced<T>(value: T, delay = 400): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function PdfPreview() {
  const data = useBiodataStore((s) => s.data);
  const debounced = useDebounced(data);
  const doc = useMemo(() => buildBiodataDocument(debounced), [debounced]);

  return (
    <div className="h-full w-full bg-stone-200">
      <Viewer doc={doc} />
    </div>
  );
}
