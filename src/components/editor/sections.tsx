"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Trash2 } from "lucide-react";
import { useBiodataStore } from "@/store/biodata-store";
import type { FrameStyle } from "@/lib/biodata";
import { SectionFields, TopLevelField, type FieldDef } from "./fields";
import { SuggestionPicker } from "./SuggestionPicker";
import { cn } from "@/lib/cn";

const FRAME_STYLES: FrameStyle[] = [
  "classic",
  "rounded",
  "oval",
  "circle",
  "arch",
  "ornate",
];

const FRAME_PREVIEW_CLS: Record<FrameStyle, string> = {
  classic: "rounded-none",
  rounded: "rounded-md",
  oval: "rounded-[50%]",
  circle: "rounded-full aspect-square",
  arch: "rounded-t-full rounded-b-md",
  ornate: "rounded-sm ring-2 ring-amber-400 ring-offset-1",
};

export const SECTION_ORDER = [
  "photo",
  "personal",
  "astro",
  "career",
  "family",
  "contact",
  "extras",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

const PERSONAL: FieldDef[] = [
  { name: "name" },
  { name: "dob", type: "date" },
  { name: "birthTime", type: "time" },
  { name: "birthPlace" },
  { name: "height" },
  { name: "weight" },
  { name: "complexion", type: "select", optionsKey: "complexion" },
  { name: "bloodGroup" },
  { name: "maritalStatus", type: "select", optionsKey: "maritalStatus" },
  { name: "diet", type: "select", optionsKey: "diet" },
];

const ASTRO: FieldDef[] = [
  { name: "religion" },
  { name: "caste" },
  { name: "subCaste" },
  { name: "gotra" },
  { name: "rashi" },
  { name: "nakshatra" },
  { name: "charan" },
  { name: "gana" },
  { name: "nadi" },
  { name: "manglik", type: "select", optionsKey: "manglik" },
  { name: "motherTongue" },
  { name: "kuldevta" },
];

const CAREER: FieldDef[] = [
  { name: "qualification" },
  { name: "college" },
  { name: "occupation" },
  { name: "company" },
  { name: "income" },
];

const FAMILY: FieldDef[] = [
  { name: "fatherName" },
  { name: "fatherOccupation" },
  { name: "motherName" },
  { name: "motherOccupation" },
  { name: "siblings", span: true },
  { name: "mama" },
  { name: "grandfather" },
  { name: "familyType", type: "select", optionsKey: "familyType" },
  { name: "nativePlace" },
];

const CONTACT: FieldDef[] = [
  { name: "phone" },
  { name: "phoneOwner", type: "select", optionsKey: "phoneOwner" },
  { name: "email" },
  { name: "address", type: "textarea", span: true },
];

export function PhotoSection() {
  const t = useTranslations("editor");
  const photo = useBiodataStore((s) => s.data.photo);
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await downscaleImage(file, 800, 0.85);
    setTopLevel({ photo: dataUrl });
    e.target.value = "";
  }

  return (
    <div className="flex items-start gap-4">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          className="h-28 w-24 rounded-lg border border-stone-300 object-cover"
        />
      ) : (
        <div className="flex h-28 w-24 items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-100 text-stone-400">
          <ImagePlus size={22} />
        </div>
      )}
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={onFile}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          {photo ? t("changePhoto") : t("uploadPhoto")}
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => setTopLevel({ photo: undefined })}
            className="ml-2 inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100"
          >
            <Trash2 size={14} /> {t("removePhoto")}
          </button>
        )}
        <p className="text-xs text-stone-500">{t("photoFormats")}</p>
      </div>
      {photo && <FramePicker />}
    </div>
  );
}

function FramePicker() {
  const t = useTranslations("editor");
  const frame = useBiodataStore((s) => s.data.photoFrame ?? "classic");
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  return (
    <div className="flex-1">
      <p className="mb-1.5 text-xs font-medium text-stone-600">
        {t("frameStyle")}
      </p>
      <div className="flex flex-wrap gap-2">
        {FRAME_STYLES.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setTopLevel({ photoFrame: f })}
            title={t(`frames.${f}`)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border-2 p-1.5 transition",
              frame === f
                ? "border-orange-500 ring-2 ring-orange-500/20"
                : "border-stone-200 hover:border-stone-300",
            )}
          >
            <span
              className={cn(
                "block h-8 w-7 border-2 border-stone-400 bg-stone-100",
                FRAME_PREVIEW_CLS[f],
              )}
            />
            <span className="text-[10px] text-stone-600">
              {t(`frames.${f}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

async function downscaleImage(
  file: File,
  maxDim: number,
  quality: number,
): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function SectionBody({ section }: { section: SectionKey }) {
  switch (section) {
    case "photo":
      return <PhotoSection />;
    case "personal":
      return <SectionFields section="personal" defs={PERSONAL} />;
    case "astro":
      return <SectionFields section="astro" defs={ASTRO} />;
    case "career":
      return <SectionFields section="career" defs={CAREER} />;
    case "family":
      return <SectionFields section="family" defs={FAMILY} />;
    case "contact":
      return <SectionFields section="contact" defs={CONTACT} />;
    case "extras":
      return (
        <div className="space-y-3">
          <TopLevelField name="aboutMe" textarea />
          <SuggestionPicker field="aboutMe" />
          <TopLevelField name="expectations" textarea />
          <SuggestionPicker field="expectations" />
          <TopLevelField name="invocation" />
        </div>
      );
  }
}
