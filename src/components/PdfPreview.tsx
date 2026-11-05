"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PDFViewer, type DocumentProps } from "@react-pdf/renderer";
import { useBiodataStore } from "@/store/biodata-store";
import QRCode from "qrcode";
import { buildBiodataDocument } from "@/pdf/document";
import { encodeShareData } from "@/lib/share";

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
  const [qr, setQr] = useState<string>();
  useEffect(() => {
    let alive = true;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const url = `${location.origin}${base}/en/create/#d=${encodeShareData(debounced)}`;
    QRCode.toDataURL(url, { width: 128, margin: 0 }).then((u) => {
      if (alive) setQr(u);
    });
    return () => {
      alive = false;
    };
  }, [debounced]);
  const doc = useMemo(
    () => buildBiodataDocument(debounced, qr),
    [debounced, qr],
  );

  return (
    <div className="h-full w-full bg-stone-200">
      <Viewer doc={doc} />
    </div>
  );
}
