"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Download, Link2, RotateCcw } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { TEMPLATE_IDS, type OutputLocale } from "@/lib/biodata";
import { useBiodataStore } from "@/store/biodata-store";
import { buildBiodataDocument } from "@/pdf/document";
import { encodeShareData } from "@/lib/share";
import { cn } from "@/lib/cn";

const ACCENTS = ["#0d9488", "#7c3aed", "#0369a1", "#be123c", "#65a30d"];

const TEMPLATE_SWATCHES: Record<string, string> = {
  traditional: "bg-[#fffdf5] border-[#b45309]",
  royal: "bg-[#6d0f2b] border-[#fbbf24]",
  modern: "bg-white border-[#0d9488]",
  floral: "bg-[#fff9f4] border-[#f472b6]",
  emerald: "bg-[#065f46] border-[#a7f3d0]",
  mandala: "bg-[#fdf8ee] border-[#d97706]",
};

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
            <div
              className={cn(
                "mb-1 h-14 w-full rounded-md border-2",
                TEMPLATE_SWATCHES[id],
              )}
            />
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
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const blob = await pdf(buildBiodataDocument(data)).toBlob();
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
        onClick={share}
        title={t("shareHint")}
        className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Link2 size={16} />}
        {copied ? t("copied") : t("share")}
      </button>
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
