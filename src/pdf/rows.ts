import type { BiodataData } from "@/lib/biodata";
import {
  type DocLabels,
  formatBirthTime,
  formatDob,
  localizeDigits,
} from "./labels";

export interface Row {
  label: string;
  value: string;
}
export interface SectionData {
  key: keyof DocLabels["sections"];
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
  const loc = data.outputLocale;
  const v = (x?: string) => (x ?? "").trim();

  const personal: Row[] = [
    { label: f.name, value: v(data.personal.name) },
    {
      label: f.dob,
      value: data.personal.dob
        ? `${formatDob(data.personal.dob, loc)}${(() => {
            const a = ageYears(data.personal.dob);
            return a !== null ? ` (${localizeDigits(`${a} ${loc === "hi" ? "वर्ष" : "yrs"}`, loc)})` : "";
          })()}`
        : "",
    },
    { label: f.birthTime, value: data.personal.birthTime ? formatBirthTime(data.personal.birthTime, loc) : "" },
    { label: f.birthPlace, value: v(data.personal.birthPlace) },
    { label: f.height, value: localizeDigits(v(data.personal.height), loc) },
    { label: f.weight, value: localizeDigits(v(data.personal.weight), loc) },
    {
      label: f.complexion,
      value: data.personal.complexion ? o.complexion[data.personal.complexion] : "",
    },
    { label: f.bloodGroup, value: v(data.personal.bloodGroup) },
    {
      label: f.maritalStatus,
      value: data.personal.maritalStatus
        ? o.maritalStatus[data.personal.maritalStatus]
        : "",
    },
    { label: f.diet, value: data.personal.diet ? o.diet[data.personal.diet] : "" },
    { label: f.residenceCity, value: v(data.personal.residenceCity) },
    { label: f.languages, value: v(data.personal.languages) },
    { label: f.hobbies, value: v(data.personal.hobbies) },
  ];

  const astro: Row[] = [
    { label: f.religion, value: v(data.astro.religion) },
    { label: f.caste, value: v(data.astro.caste) },
    { label: f.subCaste, value: v(data.astro.subCaste) },
    { label: f.gotra, value: v(data.astro.gotra) },
    { label: f.rashi, value: v(data.astro.rashi) },
    { label: f.nakshatra, value: v(data.astro.nakshatra) },
    { label: f.charan, value: v(data.astro.charan) },
    { label: f.gana, value: v(data.astro.gana) },
    { label: f.nadi, value: v(data.astro.nadi) },
    {
      label: f.manglik,
      value: data.astro.manglik ? o.manglik[data.astro.manglik] : "",
    },
    { label: f.motherTongue, value: v(data.astro.motherTongue) },
    { label: f.kuldevta, value: v(data.astro.kuldevta) },
  ];

  const career: Row[] = [
    { label: f.qualification, value: v(data.career.qualification) },
    { label: f.college, value: v(data.career.college) },
    { label: f.occupation, value: v(data.career.occupation) },
    { label: f.company, value: v(data.career.company) },
    { label: f.income, value: v(data.career.income) },
  ];

  const phone = v(data.contact.phone);
  const owner = data.contact.phoneOwner
    ? o.phoneOwner[data.contact.phoneOwner]
    : "";
  const contact: Row[] = [
    { label: f.phone, value: phone && owner ? `${phone} (${owner})` : phone },
    { label: f.fatherPhone, value: v(data.contact.fatherPhone) },
    { label: f.motherPhone, value: v(data.contact.motherPhone) },
    { label: f.email, value: v(data.contact.email) },
    { label: f.address, value: v(data.contact.address) },
  ];

  const family: Row[] = [
    {
      label: f.father,
      value: combine(v(data.family.fatherName), v(data.family.fatherOccupation)),
    },
    {
      label: f.mother,
      value: combine(v(data.family.motherName), v(data.family.motherOccupation)),
    },
    { label: f.siblings, value: v(data.family.siblings) },
    { label: f.mama, value: v(data.family.mama) },
    { label: f.grandfather, value: v(data.family.grandfather) },
    {
      label: f.familyType,
      value: data.family.familyType ? o.familyType[data.family.familyType] : "",
    },
    { label: f.nativePlace, value: v(data.family.nativePlace) },
  ];

  const p = data.prefs;
  const ageBand =
    p && (p.ageMin.trim() || p.ageMax.trim())
      ? `${localizeDigits(v(p.ageMin), loc)}–${localizeDigits(v(p.ageMax), loc)} ${loc === "hi" ? "वर्ष" : "yrs"}`
      : "";
  const prefs: Row[] = p
    ? [
        { label: f.prefAge, value: ageBand },
        { label: f.prefEducation, value: v(p.education) },
        { label: f.prefVeg, value: p.vegOnly ? o.vegOnly[p.vegOnly] : "" },
        { label: f.prefKundli, value: p.kundli ? o.kundli[p.kundli] : "" },
      ]
    : [];

  const out: SectionData[] = [
    { key: "personal", title: s.personal, rows: personal },
    { key: "astro", title: s.astro, rows: astro },
    { key: "career", title: s.career, rows: career },
    { key: "family", title: s.family, rows: family },
    { key: "contact", title: s.contact, rows: contact },
    { key: "prefs", title: s.prefs, rows: prefs },
  ];
  return out
    .map((sec) => ({
      ...sec,
      rows: sec.rows.filter((r) => r.value.length > 0),
    }))
    .filter((sec) => sec.key !== "prefs" || sec.rows.length > 0);
}
