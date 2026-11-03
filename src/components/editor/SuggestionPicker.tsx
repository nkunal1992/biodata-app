"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, Plus, X } from "lucide-react";
import { useBiodataStore } from "@/store/biodata-store";
import {
  TAG_GROUPS,
  fillPlaceholders,
  suggestionsFor,
  type SuggestionFor,
} from "@/lib/suggestions";
import { cn } from "@/lib/cn";

export function SuggestionPicker({ field }: { field: SuggestionFor }) {
  const t = useTranslations("editor");
  const data = useBiodataStore((s) => s.data);
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string[]>([]);

  const results = suggestionsFor(field, active);
  const toggle = (tag: string) =>
    setActive((a) => (a.includes(tag) ? a.filter((x) => x !== tag) : [...a, tag]));

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-100"
      >
        <Lightbulb size={13} /> {t("ideas")}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-orange-800">
          {t("ideasFor")}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="close"
          className="text-stone-400 hover:text-stone-600"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mb-2.5 flex flex-wrap gap-1">
        {Object.entries(TAG_GROUPS).map(([group, tags]) => (
          <div key={group} className="contents">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggle(tag)}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-medium transition",
                  active.includes(tag)
                    ? "border-orange-500 bg-orange-600 text-white"
                    : "border-stone-300 bg-white text-stone-600 hover:border-orange-300",
                )}
              >
                {t(`tags.${tag}`)}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
        {results.length === 0 && (
          <p className="py-2 text-center text-xs text-stone-500">
            {t("noSuggestions")}
          </p>
        )}
        {results.slice(0, 6).map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-stone-200 bg-white p-2.5"
          >
            <p className="text-xs leading-relaxed text-stone-700">
              {fillPlaceholders(s[data.outputLocale] ?? s.en, data)}
            </p>
            <button
              type="button"
              onClick={() => {
                setTopLevel({
                  [field]: fillPlaceholders(s[data.outputLocale] ?? s.en, data),
                });
                setOpen(false);
              }}
              className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-orange-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-orange-700"
            >
              <Plus size={12} /> {t("use")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
