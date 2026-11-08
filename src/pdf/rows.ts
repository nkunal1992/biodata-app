import type { BiodataData } from "@/lib/biodata";
import {
  type DocLabels,
  formatBirthTime,
  formatDob,
  localizeDigits,
  docLabels,
} from "./labels";

export interface Row {
  label: string;
  value: string;
}
export interface SectionData {
  key: string;
  title: string;
  rows: Row[];
}

/** Joins a name with an occupation like "Suresh Sharma — Retired Bank Manager". */
function combine(name: string, occ: string): string {
  if (name && occ) return `${name} — ${occ}`;
  return name || occ;
}

/**
 * Convert form data into ordered label/value rows per section.
 * Empty fields are omitted; option keys resolve to localized display text.
 */
function ageYears(dobISO: string): number | null {
  const dob = new Date(dobISO);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

export function buildSections(
  data: BiodataData,
  labels: DocLabels,
): SectionData[] {
  const { fields: f, options: o, sections: s } = labels;
  // bilingualLabels: append the other locale's label, e.g. "Name / नाम"
  const other = data.bilingualLabels
    ? docLabels(data.outputLocale === "hi" ? "en" : "hi")
    : null;
  const of_ = other?.fields as Record<string, string> | undefined;
  const os_ = other?.sections as Record<string, string> | undefined;
  const fl = (k: keyof typeof f): string =>
    of_ && of_[k] ? `${f[k]} / ${of_[k]}` : f[k];
  const sl = (k: keyof typeof s): string =>
    os_ && os_[k] ? `${s[k]} / ${os_[k]}` : s[k];
  const loc = data.outputLocale;
  const v = (x?: string) => (x ?? "").trim();

  const personal: Row[] = [
    { label: fl("name"), value: v(data.personal.name) },
    {
      label: fl("dob"),
      value: data.personal.dob
        ? `${formatDob(data.personal.dob, loc)}${(() => {
            const a = ageYears(data.personal.dob);
            return a !== null ? ` (${localizeDigits(`${a} ${loc === "hi" ? "वर्ष" : "yrs"}`, loc)})` : "";
          })()}`
        : "",
    },
    { label: fl("birthTime"), value: data.personal.birthTime ? formatBirthTime(data.personal.birthTime, loc) : "" },
    { label: fl("birthPlace"), value: v(data.personal.birthPlace) },
    { label: fl("height"), value: localizeDigits(v(data.personal.height), loc) },
    { label: fl("weight"), value: localizeDigits(v(data.personal.weight), loc) },
    {
      label: fl("complexion"),
      value: data.personal.complexion ? (o.complexion[data.personal.complexion] ?? "") : "",
    },
    { label: fl("bloodGroup"), value: v(data.personal.bloodGroup) },
    {
      label: fl("maritalStatus"),
      value: data.personal.maritalStatus
        ? (o.maritalStatus[data.personal.maritalStatus] ?? "")
        : "",
    },
    { label: fl("diet"), value: data.personal.diet ? (o.diet[data.personal.diet] ?? "") : "" },
    { label: fl("residenceCity"), value: v(data.personal.residenceCity) },
    { label: fl("languages"), value: v(data.personal.languages) },
    { label: fl("hobbies"), value: v(data.personal.hobbies) },
  ];

  const astro: Row[] = [
    { label: fl("religion"), value: v(data.astro.religion) },
    { label: fl("caste"), value: v(data.astro.caste) },
    { label: fl("subCaste"), value: v(data.astro.subCaste) },
    { label: fl("gotra"), value: v(data.astro.gotra) },
    { label: fl("rashi"), value: v(data.astro.rashi) },
    { label: fl("nakshatra"), value: v(data.astro.nakshatra) },
    { label: fl("charan"), value: v(data.astro.charan) },
    { label: fl("gana"), value: v(data.astro.gana) },
    { label: fl("nadi"), value: v(data.astro.nadi) },
    {
      label: fl("manglik"),
      value: data.astro.manglik ? (o.manglik[data.astro.manglik] ?? "") : "",
    },
    { label: fl("motherTongue"), value: v(data.astro.motherTongue) },
    { label: fl("kuldevta"), value: v(data.astro.kuldevta) },
  ];

  const career: Row[] = [
    { label: fl("qualification"), value: v(data.career.qualification) },
    { label: fl("college"), value: v(data.career.college) },
    { label: fl("occupation"), value: v(data.career.occupation) },
    { label: fl("company"), value: v(data.career.company) },
    { label: fl("income"), value: v(data.career.income) },
  ];

  const phone = v(data.contact.phone);
  const owner = data.contact.phoneOwner
    ? (o.phoneOwner[data.contact.phoneOwner] ?? "")
    : "";
  const contact: Row[] = [
    { label: fl("phone"), value: phone && owner ? `${phone} (${owner})` : phone },
    { label: fl("fatherPhone"), value: v(data.contact.fatherPhone) },
    { label: fl("motherPhone"), value: v(data.contact.motherPhone) },
    { label: fl("email"), value: v(data.contact.email) },
    { label: fl("address"), value: v(data.contact.address) },
  ];

  const family: Row[] = [
    {
      label: fl("father"),
      value: combine(v(data.family.fatherName), v(data.family.fatherOccupation)),
    },
    {
      label: fl("mother"),
      value: combine(v(data.family.motherName), v(data.family.motherOccupation)),
    },
    { label: fl("siblings"), value: v(data.family.siblings) },
    { label: fl("mama"), value: v(data.family.mama) },
    { label: fl("grandfather"), value: v(data.family.grandfather) },
    {
      label: fl("familyType"),
      value: data.family.familyType ? (o.familyType[data.family.familyType] ?? "") : "",
    },
    { label: fl("nativePlace"), value: v(data.family.nativePlace) },
  ];

  const p = data.prefs;
  const ageBand =
    p && (p.ageMin.trim() || p.ageMax.trim())
      ? `${localizeDigits(v(p.ageMin), loc)}–${localizeDigits(v(p.ageMax), loc)} ${loc === "hi" ? "वर्ष" : "yrs"}`
      : "";
  const prefs: Row[] = p
    ? [
        { label: fl("prefAge"), value: ageBand },
        { label: fl("prefEducation"), value: v(p.education) },
        { label: fl("prefVeg"), value: p.vegOnly ? (o.vegOnly[p.vegOnly] ?? "") : "" },
        { label: fl("prefKundli"), value: p.kundli ? (o.kundli[p.kundli] ?? "") : "" },
      ]
    : [];

  const out: SectionData[] = [
    { key: "personal", title: sl("personal"), rows: personal },
    { key: "astro", title: sl("astro"), rows: astro },
    { key: "career", title: sl("career"), rows: career },
    { key: "family", title: sl("family"), rows: family },
    { key: "contact", title: sl("contact"), rows: contact },
    ...(data.customSections ?? [])
      .filter((cs) => cs.title.trim() && cs.fields.length > 0)
      .map((cs) => ({
        key: `custom-${cs.id}`,
        title: cs.title.trim(),
        rows: cs.fields
          .filter((f) => f.label.trim() && f.value.trim())
          .map((f) => ({ label: f.label.trim(), value: f.value.trim() })),
      })),
    { key: "prefs", title: sl("prefs"), rows: prefs },
  ];
  // ── user overrides: hidden fields/sections, custom fields, order ──
  const hiddenFields = new Set(data.hiddenFields ?? []);
  const hiddenSections = new Set(data.hiddenSections ?? []);
  const customs = data.customFields ?? [];

  // Field→section composite keys match hiddenFields entries.
  const FIELD_KEYS: Record<string, string[]> = {
    personal: ["name","dob","birthTime","birthPlace","height","weight","complexion","bloodGroup","maritalStatus","diet","residenceCity","languages","hobbies"],
    astro: ["religion","caste","subCaste","gotra","rashi","nakshatra","charan","gana","nadi","manglik","motherTongue","kuldevta"],
    career: ["qualification","college","occupation","company","income"],
    family: ["father","mother","siblings","mama","grandfather","familyType","nativePlace"],
    contact: ["phone","fatherPhone","motherPhone","email","address"],
  };
  const rowKey: Record<string, (r: Row) => string> = {};
  for (const [sec, keys] of Object.entries(FIELD_KEYS)) {
    keys.forEach((k, i) => {
      rowKey[`${sec}.${i}`] = () => k;
    });
  }

  let filtered = out
    .map((sec) => {
      const keys = FIELD_KEYS[sec.key] ?? [];
      const rows = sec.rows.filter(
        (r) =>
          (r.value ?? "").length > 0 &&
          !hiddenFields.has(`${sec.key}.${keys[sec.rows.indexOf(r)]}`),
      );
      // custom fields tagged to this section
      const extra = customs
        .filter((cf) => cf.section === sec.key && cf.label.trim() && cf.value.trim())
        .map((cf) => ({ label: cf.label.trim(), value: cf.value.trim() }));
      return { ...sec, rows: [...rows, ...extra] };
    })
    .filter((sec) => !hiddenSections.has(sec.key) && sec.rows.length > 0);

  // section order override (only core keys; prefs stays last)
  const order = data.sectionOrder?.length
    ? [...data.sectionOrder, "prefs"]
    : null;
  if (order) {
    filtered = [...filtered].sort(
      (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
    );
  }

  return filtered;
}
