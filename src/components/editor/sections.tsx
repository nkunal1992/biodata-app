"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Trash2 } from "lucide-react";
import { useBiodataStore } from "@/store/biodata-store";
import type { FrameStyle, InvocationIcon } from "@/lib/biodata";
import { SectionFields, TopLevelField, type FieldDef } from "./fields";
import { SuggestionPicker } from "./SuggestionPicker";
import { cn } from "@/lib/cn";

const ICONS: InvocationIcon[] = [
  "none",
  "om",
  "swastik",
  "kalash",
  "diya",
  "lotus",
  "ganesha",
];

const MANTRAS = [
  "॥ श्री गणेशाय नमः ॥",
  "ॐ गं गणपतये नमः",
  "ॐ नमः शिवाय",
  "॥ शुभ विवाह ॥",
  "जय श्री कृष्ण",
  "जय माता दी",
];

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
  { name: "residenceCity" },
  { name: "languages" },
  { name: "hobbies", span: true },
  { name: "siblings", span: true },
  { name: "mama" },
  { name: "grandfather" },
  { name: "familyType", type: "select", optionsKey: "familyType" },
  { name: "nativePlace" },
];

const CONTACT: FieldDef[] = [
  { name: "phone" },
  { name: "fatherPhone" },
  { name: "motherPhone" },
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

function InvocationControls() {
  const t = useTranslations("editor");
  const icon = useBiodataStore((s) => s.data.invocationIcon ?? "none");
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-medium text-stone-600">
          {t("icon")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setTopLevel({ invocationIcon: ic })}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                icon === ic
                  ? "border-orange-500 bg-orange-600 text-white"
                  : "border-stone-300 bg-white text-stone-600 hover:border-orange-300",
              )}
            >
              {t(`icons.${ic}`)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-stone-600">
          {t("mantra")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MANTRAS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setTopLevel({ invocation: m })}
              className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs text-stone-600 hover:border-orange-300 hover:text-orange-700"
            >
              {m}
            </button>
          ))}
        </div>
      </div>
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
      return (
        <div className="space-y-3">
          <CandidateForToggle />
          <SectionFields section="personal" defs={PERSONAL} />
        </div>
      );
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
          <TopLevelField name="familyAbout" textarea />
          <SuggestionPicker field="familyAbout" />
          <TopLevelField name="expectations" textarea />
          <SuggestionPicker field="expectations" />
          <TopLevelField name="familyExpectations" textarea />
          <SuggestionPicker field="familyExpectations" />
          <PrefsFields />
          <TopLevelField name="invocation" />
          <TopLevelField name="biodataNo" />
          <InvocationControls />
        </div>
      );
  }
}

const PREF_SELS: Record<string, string[]> = {
  vegOnly: ["yes", "no"],
  kundli: ["yes", "optional", "no"],
};

function PrefsFields() {
  const t = useTranslations("editor");
  const prefs = useBiodataStore((s) => s.data.prefs);
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  const set = (k: string, val: string) =>
    setTopLevel({
      prefs: {
        ageMin: "", ageMax: "", education: "", vegOnly: "", kundli: "",
        ...prefs, [k]: val,
      },
    });
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {t("prefsTitle")}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-0.5 block text-xs text-stone-500">{t("prefAge")}</span>
          <div className="flex items-center gap-1.5">
            <input value={prefs?.ageMin ?? ""} onChange={(e) => set("ageMin", e.target.value)} placeholder="25" className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm" />
            <span className="text-xs text-stone-400">–</span>
            <input value={prefs?.ageMax ?? ""} onChange={(e) => set("ageMax", e.target.value)} placeholder="30" className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm" />
          </div>
        </label>
        <label className="block">
          <span className="mb-0.5 block text-xs text-stone-500">{t("prefEducation")}</span>
          <input value={prefs?.education ?? ""} onChange={(e) => set("education", e.target.value)} className="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm" />
        </label>
        {Object.entries(PREF_SELS).map(([k, opts]) => (
          <div key={k}>
            <span className="mb-0.5 block text-xs text-stone-500">{t(k === "vegOnly" ? "prefVeg" : "prefKundli")}</span>
            <div className="flex gap-1">
              {opts.map((o) => (
                <button key={o} type="button" onClick={() => set(k, prefs?.[k as keyof typeof prefs] === o ? "" : o)}
                  className={cn("rounded-md border px-2 py-1 text-xs", (prefs as Record<string,string> | undefined)?.[k] === o ? "border-orange-500 bg-orange-600 text-white" : "border-stone-300 bg-white text-stone-600")}>
                  {t(`prefOpts.${o}`)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CandidateForToggle() {
  const t = useTranslations("editor");
  const cf = useBiodataStore((s) => s.data.candidateFor);
  const setTopLevel = useBiodataStore((s) => s.setTopLevel);
  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-xs font-medium text-stone-600">
        {t("candidateFor")}
      </span>
      {(["groom", "bride"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() =>
            setTopLevel({ candidateFor: cf === v ? undefined : v })
          }
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition",
            cf === v
              ? "border-orange-500 bg-orange-600 text-white"
              : "border-stone-300 bg-white text-stone-600 hover:border-orange-300",
          )}
        >
          {t(`for.${v}`)}
        </button>
      ))}
    </div>
  );
}
