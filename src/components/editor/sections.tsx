"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
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
  const [rawSrc, setRawSrc] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRawSrc(URL.createObjectURL(file));
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
        {rawSrc && (
          <div className="mt-2">
            <PhotoCropper src={rawSrc} onDone={(d) => { setTopLevel({ photo: d }); setRawSrc(null); }} />
          </div>
        )}
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


function CustomFieldsBlock({ section }: { section: string }) {
  const t = useTranslations("editor");
  const customs = useBiodataStore((s) => s.data.customFields ?? []);
  const addCustomField = useBiodataStore((s) => s.addCustomField);
  const updateCustomField = useBiodataStore((s) => s.updateCustomField);
  const removeCustomField = useBiodataStore((s) => s.removeCustomField);
  const mine = customs.filter((cf) => cf.section === section);
  return (
    <div className="mt-3 space-y-2 border-t border-dashed border-stone-200 pt-3">
      {mine.map((cf) => (
        <div key={cf.id} className="flex items-start gap-2">
          <input
            value={cf.label}
            placeholder={t("customLabel")}
            onChange={(e) => updateCustomField(cf.id, { label: e.target.value })}
            className="w-2/5 rounded-lg border border-stone-300 px-2 py-1.5 text-xs"
          />
          <input
            value={cf.value}
            placeholder={t("customValue")}
            onChange={(e) => updateCustomField(cf.id, { value: e.target.value })}
            className="flex-1 rounded-lg border border-stone-300 px-2 py-1.5 text-xs"
          />
          <button
            type="button"
            onClick={() => removeCustomField(cf.id)}
            className="mt-1 text-stone-300 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addCustomField(section)}
        className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
      >
        <Plus size={13} /> {t("addField")}
      </button>
    </div>
  );
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
          <CustomFieldsBlock section="personal" />
        </div>
      );
    case "astro":
      return (
        <div>
          <SectionFields section="astro" defs={ASTRO} />
          <CustomFieldsBlock section="astro" />
        </div>
      );
    case "career":
      return (
        <div>
          <SectionFields section="career" defs={CAREER} />
          <CustomFieldsBlock section="career" />
        </div>
      );
    case "family":
      return (
        <div>
          <SectionFields section="family" defs={FAMILY} />
          <CustomFieldsBlock section="family" />
        </div>
      );
    case "contact":
      return (
        <div>
          <SectionFields section="contact" defs={CONTACT} />
          <CustomFieldsBlock section="contact" />
        </div>
      );
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
          <CustomSectionsBlock />
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

function CustomSectionsBlock() {
  const t = useTranslations("editor");
  const sections = useBiodataStore((s) => s.data.customSections ?? []);
  const addCS = useBiodataStore((s) => s.addCustomSection);
  const updCS = useBiodataStore((s) => s.updateCustomSection);
  const delCS = useBiodataStore((s) => s.removeCustomSection);
  return (
    <div className="rounded-xl border border-dashed border-orange-300 bg-orange-50/50 p-3">
      <p className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
        {t("customSections")}
      </p>
      {sections.map((cs) => (
        <div key={cs.id} className="mb-2 rounded-lg border border-stone-200 bg-white p-2.5">
          <div className="flex items-center gap-2">
            <input
              value={cs.title}
              placeholder={t("customSectionTitle")}
              onChange={(e) => updCS(cs.id, { title: e.target.value })}
              className="flex-1 rounded-lg border border-stone-300 px-2 py-1.5 text-xs font-medium"
            />
            <button type="button" onClick={() => delCS(cs.id)} className="text-stone-300 hover:text-red-500">
              <Trash2 size={13} />
            </button>
          </div>
          {cs.fields.map((f) => (
            <div key={f.id} className="mt-1.5 flex items-center gap-2">
              <input
                value={f.label}
                placeholder={t("customLabel")}
                onChange={(e) =>
                  updCS(cs.id, {
                    fields: cs.fields.map((x) => x.id === f.id ? { ...x, label: e.target.value } : x),
                  })
                }
                className="w-2/5 rounded-lg border border-stone-300 px-2 py-1 text-xs"
              />
              <input
                value={f.value}
                placeholder={t("customValue")}
                onChange={(e) =>
                  updCS(cs.id, {
                    fields: cs.fields.map((x) => x.id === f.id ? { ...x, value: e.target.value } : x),
                  })
                }
                className="flex-1 rounded-lg border border-stone-300 px-2 py-1 text-xs"
              />
              <button
                type="button"
                onClick={() => updCS(cs.id, { fields: cs.fields.filter((x) => x.id !== f.id) })}
                className="text-stone-300 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updCS(cs.id, { fields: [...cs.fields, { id: `f${Date.now().toString(36)}`, label: "", value: "" }] })
            }
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-orange-600"
          >
            <Plus size={11} /> {t("addField")}
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCS}
        className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 hover:text-orange-800"
      >
        <Plus size={13} /> {t("addSection")}
      </button>
    </div>
  );
}

function PhotoCropper({ src, onDone }: { src: string; onDone: (dataUrl: string) => void }) {
  const t = useTranslations("editor");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [rect, setRect] = React.useState({ x: 0.15, y: 0.15, w: 0.7, h: 0.7 * (4 / 3) });
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const i = new window.Image();
    i.onload = () => { setImg(i); setSize({ w: Math.min(i.width, 400), h: Math.min(i.width, 400) * (i.height / i.width) }); };
    i.src = src;
  }, [src]);
  const crop = () => {
    if (!img || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const sx = rect.x * img.width, sy = rect.y * img.height;
    const sw = rect.w * img.width, sh = Math.min(rect.h, 1 - rect.y) * img.height;
    canvasRef.current.width = 360;
    canvasRef.current.height = 360 * (sh / sw);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 360, canvasRef.current.height);
    onDone(canvasRef.current.toDataURL("image/jpeg", 0.85));
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 || size.w === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1 - rect.w, (e.clientX - r.left) / r.width - rect.w / 2));
    const ny = Math.max(0, Math.min(1 - rect.h, (e.clientY - r.top) / r.height - rect.h / 2));
    setRect((p) => ({ ...p, x: nx, y: ny }));
  };
  if (!img) return <p className="text-xs text-stone-400">…</p>;
  return (
    <div>
      <div
        className="relative mx-auto cursor-move overflow-hidden rounded-lg border border-stone-300"
        style={{ width: size.w, height: size.h }}
        onMouseMove={onMove}
        onMouseDown={onMove}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block h-full w-full" draggable={false} />
        <div
          className="absolute border-2 border-orange-500 bg-orange-500/10"
          style={{
            left: `${rect.x * 100}%`, top: `${rect.y * 100}%`,
            width: `${rect.w * 100}%`, height: `${rect.h * 100}%`,
          }}
        />
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <button
        type="button"
        onClick={crop}
        className="mt-2 w-full rounded-lg bg-orange-600 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
      >
        {t("applyCrop")}
      </button>
    </div>
  );
}
