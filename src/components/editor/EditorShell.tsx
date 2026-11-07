"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ChevronDown, Eye, EyeOff, Heart, Home, ArrowUp, ArrowDown } from "lucide-react";
import { useBiodataStore } from "@/store/biodata-store";
import { decodeShareHash } from "@/lib/share";
import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/Navbar";
import { SectionBody, type SectionKey } from "./sections";
import {
  OutputLocaleToggle,
  CoverToggle,
  PageBgPicker,
  PageBorderPicker,
  TemplatePicker,
  Toolbar,
} from "./controls";

const PdfPreview = dynamic(() => import("@/components/PdfPreview"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-stone-200 text-sm text-stone-500">
      …
    </div>
  ),
});

const CORE_ORDER = ["personal", "astro", "career", "family", "contact"] as const;

function StepperSection({
  index,
  sectionKey,
  open,
  onToggle,
  onNext,
  isLast,
  isCore,
}: {
  index: number;
  sectionKey: SectionKey;
  open: boolean;
  onToggle: () => void;
  onNext: () => void;
  isLast: boolean;
  isCore: boolean;
}) {
  const t = useTranslations("editor");
  const hidden = useBiodataStore((s) =>
    (s.data.hiddenSections ?? []).includes(sectionKey),
  );
  const toggleSectionHidden = useBiodataStore((s) => s.toggleSectionHidden);
  const moveSection = useBiodataStore((s) => s.moveSection);
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white transition",
        open ? "border-orange-300 shadow-sm" : "border-stone-200",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            open ? "bg-orange-600 text-white" : "bg-stone-200 text-stone-600",
          )}
        >
          {index + 1}
        </span>
        <span className={cn("flex-1", hidden && "opacity-40")}>
          <span className="block text-sm font-semibold text-stone-800">
            {t(`sections.${sectionKey}`)}
          </span>
          {open && (
            <span className="block text-xs text-stone-500">
              {t(`sectionHints.${sectionKey}`)}
            </span>
          )}
        </span>
        {isCore && (
          <span className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              title="move up"
              onClick={() => moveSection(sectionKey, -1)}
              className="rounded p-1 text-stone-300 hover:text-stone-600"
            >
              <ArrowUp size={12} />
            </button>
            <button
              type="button"
              title="move down"
              onClick={() => moveSection(sectionKey, 1)}
              className="rounded p-1 text-stone-300 hover:text-stone-600"
            >
              <ArrowDown size={12} />
            </button>
            <button
              type="button"
              title={hidden ? t("showSection") : t("hideSection")}
              onClick={() => toggleSectionHidden(sectionKey)}
              className={cn(
                "rounded p-1 hover:text-stone-600",
                hidden ? "text-orange-500" : "text-stone-300",
              )}
            >
              {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </span>
        )}
        <ChevronDown
          size={16}
          className={cn(
            "text-stone-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </div>
      {open && (
        <div className="border-t border-stone-100 px-4 py-4">
          <SectionBody section={sectionKey} />
          {!isLast && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onNext}
                className="rounded-lg bg-stone-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
              >
                {t("next")} →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EditorShell() {
  const t = useTranslations("editor");
  const nav = useTranslations("nav");
  const hydrateFromShare = useBiodataStore((s) => s.hydrateFromShare);
  const sectionOrder = useBiodataStore((s) => s.data.sectionOrder);
  const [open, setOpen] = useState<SectionKey | null>("photo");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [shared, setShared] = useState(false);

  // Hydrate from a #d= share hash once, then strip it.
  useEffect(() => {
    const sharedData = decodeShareHash(window.location.hash);
    if (sharedData) {
      hydrateFromShare(sharedData);
      // One-time hydration banner — setState here is intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShared(true);
      history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const core = (sectionOrder?.length ? sectionOrder : [...CORE_ORDER]) as SectionKey[];
  const ORDERED = ["photo", ...core, "extras"] as SectionKey[];
  const openIdx = open === null ? -1 : ORDERED.indexOf(open);
  const next = () => {
    const nxt = ORDERED[openIdx + 1];
    if (nxt) setOpen(nxt);
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Heart size={18} className="text-orange-600" fill="currentColor" />
            <span className="text-base font-bold text-stone-900">
              {nav("brand")}
            </span>
          </Link>
          <Link
            href="/"
            className="ml-1 inline-flex items-center gap-1 rounded-lg border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
          >
            <Home size={12} /> {nav("home")}
          </Link>
          <span className="hidden text-sm text-stone-400 sm:inline">
            · {t("title")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher compact />
          <button
            type="button"
            onClick={() => setShowMobilePreview((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700 lg:hidden"
          >
            <Eye size={15} /> {t("preview")}
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="order-2 w-full space-y-4 p-4 lg:order-1 lg:w-[46%] lg:max-w-2xl lg:p-6">
          {shared && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
              ✓ {t("sharedLoaded")}
            </p>
          )}
          <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-4">
            <TemplatePicker />
            <div className="border-t border-stone-100 pt-4">
              <OutputLocaleToggle />
            </div>
            <div className="border-t border-stone-100 pt-4">
              <PageBgPicker />
            </div>
            <div className="border-t border-stone-100 pt-4">
              <PageBorderPicker />
            </div>
            <div className="border-t border-stone-100 pt-4">
              <CoverToggle />
            </div>
            <div className="border-t border-stone-100 pt-4">
              <Toolbar />
            </div>
          </div>

          <div className="space-y-2.5">
            {(() => {
              const core =
                (sectionOrder?.length ?? 0) > 0
                  ? (sectionOrder as string[])
                  : [...CORE_ORDER];
              const order = ["photo", ...core, "extras"] as SectionKey[];
              return order.map((key, i) => (
              <StepperSection
                key={key}
                index={i}
                sectionKey={key}
                open={open === key}
                onToggle={() => setOpen(open === key ? null : key)}
                onNext={next}
                isLast={i === order.length - 1}
                isCore={(CORE_ORDER as readonly string[]).includes(key)}
              />
              ));
            })()}
          </div>
        </div>

        {showMobilePreview && (
          <div className="order-1 h-[70vh] border-b border-stone-200 lg:hidden">
            <PdfPreview />
          </div>
        )}

        <aside className="sticky top-0 hidden h-screen flex-1 lg:order-2 lg:block">
          <PdfPreview />
        </aside>
      </div>
    </div>
  );
}
