"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Download, FileImage, Link2, RotateCcw, Trash2, Undo2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { TEMPLATE_IDS, type OutputLocale } from "@/lib/biodata";
import { draftName, useBiodataStore } from "@/store/biodata-store";
import { buildBiodataDocument } from "@/pdf/document";
import { encodeShareData } from "@/lib/share";
import { cn } from "@/lib/cn";

const ACCENTS = ["#0d9488", "#7c3aed", "#0369a1", "#be123c", "#65a30d"];

export function TemplatePicker() {
  const t = useTranslations();
  const template = useBiodataStore((s) => s.data.template);
  const accent = useBiodataStore((s) => s.data.accent);
  const setTemplate = useBiodataStore((s) => s.setTemplate);
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);

  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {t("editor.template")}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {TEMPLATE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTemplate(id)}
            className={cn(
              "group rounded-xl border-2 p-1.5 text-left transition",
              template === id
                ? "border-orange-500 ring-2 ring-orange-500/20"
                : "border-stone-200 hover:border-stone-300",
            )}
          >
            <div className="mb-1 h-16 w-full overflow-hidden rounded-md">
              <TemplateThumb id={id} />
            </div>
            <span className="block px-0.5 text-xs font-medium text-stone-700">
              {t(`templates.${id}`)}
            </span>
          </button>
        ))}
      </div>
      {template === "modern" && (
        <div className="mt-2 flex items-center gap-1.5">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              onClick={() => setTopLevel({ accent: c })}
              className={cn(
                "h-6 w-6 rounded-full border-2",
                accent === c ? "border-stone-800" : "border-white shadow",
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


const THUMB: Record<string, { border: number; header: string; accent: string }> = {
  traditional: { border: 2, header: "diamond", accent: "#b45309" },
  royal: { border: 0, header: "band", accent: "#6d0f2b" },
  modern: { border: 0, header: "bar", accent: "#2563eb" },
  floral: { border: 1, header: "floral", accent: "#f472b6" },
  emerald: { border: 0, header: "sidebar", accent: "#065f46" },
  mandala: { border: 1, header: "mandala", accent: "#d97706" },
  peacock: { border: 2, header: "feather", accent: "#0f766e" },
  jharokha: { border: 2, header: "arch", accent: "#b45309" },
  toran: { border: 0, header: "toran", accent: "#d97706" },
  banarasi: { border: 2, header: "zari", accent: "#4c1d95" },
  kalash: { border: 1, header: "kalash", accent: "#b91c1c" },
  navy: { border: 1, header: "navy", accent: "#1e3a8a" },
};

function TemplateThumb({ id }: { id: string }) {
  const t = THUMB[id] ?? THUMB.traditional;
  const rows = [0, 1, 2, 3, 4].map((i) => (
    <rect key={i} x={8} y={30 + i * 8} width={44} height={2.5} rx={1} fill="#d6d3d1" />
  ));
  return (
    <svg viewBox="0 0 60 76" className="h-full w-full">
      <rect x={2} y={2} width={56} height={72} rx={2} fill="#fffdf8" stroke={t.accent}
        strokeWidth={t.border || 0.5} strokeOpacity={0.9} />
      {t.border === 2 && (
        <rect x={5} y={5} width={50} height={66} rx={1} fill="none" stroke={t.accent} strokeWidth={0.5} />
      )}
      {t.header === "band" && <rect x={2} y={2} width={56} height={16} rx={2} fill={t.accent} />}
      {t.header === "bar" && <rect x={2} y={2} width={5} height={72} fill={t.accent} />}
      {t.header === "sidebar" && <rect x={2} y={2} width={18} height={72} fill={t.accent} opacity={0.85} />}
      {t.header === "diamond" && <rect x={26} y={7} width={8} height={8} transform="rotate(45 30 11)" fill={t.accent} />}
      {t.header === "floral" && <><circle cx={14} cy={12} r={4} fill={t.accent} opacity={0.6} /><circle cx={46} cy={12} r={4} fill={t.accent} opacity={0.6} /></>}
      {t.header === "mandala" && <circle cx={30} cy={12} r={7} fill="none" stroke={t.accent} strokeWidth={1.5} />}
      {t.header === "feather" && <ellipse cx={30} cy={12} rx={7} ry={5} fill="none" stroke={t.accent} strokeWidth={1.5} />}
      {t.header === "arch" && <rect x={24} y={6} width={12} height={14} rx={6} fill="none" stroke={t.accent} strokeWidth={1.5} />}
      {t.header === "toran" && [0,1,2,3,4,5].map((i) => <circle key={i} cx={8 + i * 9} cy={8} r={3} fill={t.accent} />)}
      {t.header === "zari" && <rect x={8} y={7} width={44} height={4} fill={t.accent} opacity={0.7} />}
      {t.header === "kalash" && <><rect x={24} y={10} width={12} height={9} rx={4} fill={t.accent} /><circle cx={30} cy={7} r={2.5} fill="#92400e" /></>}
      {t.header === "navy" && <rect x={8} y={7} width={20} height={5} fill={t.accent} />}
      <rect x={t.header === "sidebar" ? 24 : 8} y={22} width={30} height={4} rx={1} fill={t.accent} opacity={0.6} />
      <g transform={t.header === "sidebar" ? "translate(16,0)" : ""}>{rows}</g>
    </svg>
  );
}

export function PageBgPicker() {
  const t = useTranslations("editor");
  const bg = useBiodataStore((s) => s.data.pageBackground ?? "template");
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  const opts = [
    "template",
    "white",
    "ivory",
    "cream",
    "blush",
    "mint",
    "sandal",
  ] as const;
  const swatch: Record<string, string> = {
    template: "conic-gradient(#f0abfc, #93c5fd, #86efac, #fde68a, #f0abfc)",
    white: "#ffffff",
    ivory: "#fefcf3",
    cream: "#fdf6e3",
    blush: "#fdf0ee",
    mint: "#f0f7f0",
    sandal: "#f5ead3",
  };
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {t("pageBg")}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setTopLevel({ pageBackground: o })}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
              bg === o
                ? "border-orange-500 bg-orange-50 text-orange-800"
                : "border-stone-300 bg-white text-stone-600 hover:border-orange-300",
            )}
          >
            <span
              className="block h-3.5 w-3.5 rounded-full border border-stone-300"
              style={{ background: swatch[o] }}
            />
            {t(`bgs.${o}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PageBorderPicker() {
  const t = useTranslations("editor");
  const pageBorder = useBiodataStore((s) => s.data.pageBorder ?? "template");
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  const opts = [
    "template",
    "none",
    "line",
    "double",
    "ornate",
    "floral",
  ] as const;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {t("pageBorder")}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setTopLevel({ pageBorder: o })}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
              pageBorder === o
                ? "border-orange-500 bg-orange-600 text-white"
                : "border-stone-300 bg-white text-stone-600 hover:border-orange-300",
            )}
          >
            {t(`borders.${o}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OutputLocaleToggle() {
  const t = useTranslations("editor");
  const outputLocale = useBiodataStore((s) => s.data.outputLocale);
  const setOutputLocale = useBiodataStore((s) => s.setOutputLocale);
  const opts: { v: OutputLocale; l: string }[] = [
    { v: "en", l: "English" },
    { v: "hi", l: "हिन्दी" },
  ];
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {t("outputLanguage")}
      </p>
      <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5">
        {opts.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => setOutputLocale(o.v)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition",
              outputLocale === o.v
                ? "bg-orange-600 text-white"
                : "text-stone-600 hover:bg-stone-100",
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-stone-500">{t("outputLanguageHint")}</p>
    </div>
  );
}

export function Toolbar() {
  const t = useTranslations("editor");
  const uiLocale = useLocale();
  const data = useBiodataStore((s) => s.data);
  const reset = useBiodataStore((s) => s.reset);
  const undo = useBiodataStore((s) => s.undo);
  const hasPast = useBiodataStore((s) => s.past.length > 0);
  const [busy, setBusy] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const shareUrl = `${location.origin}${base}/${uiLocale}/create/#d=${encodeShareData(data)}`;
      const qr = await QRCode.toDataURL(shareUrl, { width: 128, margin: 0 });
      const blob = await pdf(buildBiodataDocument(data, qr)).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const name = data.personal.name.trim() || "biodata";
      a.href = url;
      a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-biodata.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      setBusy(false);
    }
  }

  async function downloadPng() {
    setImgBusy(true);
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const shareUrl = `${location.origin}${base}/${uiLocale}/create/#d=${encodeShareData(data)}`;
      const qr = await QRCode.toDataURL(shareUrl, { width: 128, margin: 0 });
      const blob = await pdf(buildBiodataDocument(data, qr)).toBlob();
      const buf = await blob.arrayBuffer();
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      const page = await doc.getPage(1);
      const scale = 2;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({
        canvasContext: canvas.getContext("2d")!,
        viewport,
      }).promise;
      canvas.toBlob((b) => {
        if (!b) return;
        const url = URL.createObjectURL(b);
        const a = document.createElement("a");
        const name = data.personal.name.trim() || "biodata";
        a.href = url;
        a.download = `${name.replace(/\s+/g, "-").toLowerCase()}-biodata.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }, "image/png");
    } finally {
      setImgBusy(false);
    }
  }

  async function share() {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const url = `${location.origin}${base}/${uiLocale}/create/#d=${encodeShareData(data)}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:opacity-60"
      >
        <Download size={16} />
        {busy ? t("downloading") : t("download")}
      </button>
      <button
        type="button"
        onClick={downloadPng}
        disabled={imgBusy}
        title={t("downloadPngHint")}
        className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-60"
      >
        <FileImage size={16} /> {imgBusy ? t("downloading") : t("downloadPng")}
      </button>
      <button
        type="button"
        onClick={share}
        title={t("shareHint")}
        className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Link2 size={16} />}
        {copied ? t("copied") : t("share")}
      </button>
      <button
        type="button"
        onClick={undo}
        disabled={!hasPast}
        title="Ctrl+Z"
        className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 disabled:opacity-40"
      >
        <Undo2 size={15} /> {t("undo")}
      </button>
      <DraftPicker />
      <button
        type="button"
        onClick={() => {
          if (window.confirm(t("resetConfirm"))) reset();
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
      >
        <RotateCcw size={15} /> {t("reset")}
      </button>
    </div>
  );
}

export function DraftPicker() {
  const t = useTranslations("editor");
  const drafts = useBiodataStore((s) => s.drafts);
  const data = useBiodataStore((s) => s.data);
  const activeId = useBiodataStore((s) => s.activeId);
  const switchDraft = useBiodataStore((s) => s.switchDraft);
  const newDraft = useBiodataStore((s) => s.newDraft);
  const deleteDraft = useBiodataStore((s) => s.deleteDraft);
  const ids = Object.keys(drafts);
  const all = ids.includes(activeId)
    ? ids
    : [activeId, ...ids];

  const label = (id: string, i: number) =>
    draftName(drafts[id] ?? { data, updatedAt: 0 }, i);

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={activeId}
        onChange={(e) => switchDraft(e.target.value)}
        className="max-w-[160px] rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-700"
        title={t("drafts")}
      >
        {all.map((id, i) => (
          <option key={id} value={id}>
            {label(id, i)}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={newDraft}
        title={t("newDraft")}
        className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100"
      >
        + {t("newDraft")}
      </button>
      {all.length > 1 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t("deleteDraftConfirm"))) deleteDraft(activeId);
          }}
          title={t("deleteDraft")}
          className="rounded-lg border border-stone-200 bg-white p-1.5 text-stone-400 hover:border-red-300 hover:text-red-600"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
