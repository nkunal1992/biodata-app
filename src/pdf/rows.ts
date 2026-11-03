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
export function buildSections(
  data: BiodataData,
  labels: DocLabels,
): SectionData[] {
  const { fields: f, options: o, sections: s } = labels;
  const loc = data.outputLocale;
  const v = (x?: string) => (x ?? "").trim();

  const personal: Row[] = [
    { label: f.name, value: v(data.personal.name) },
    { label: f.dob, value: data.personal.dob ? formatDob(data.personal.dob, loc) : "" },
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
  ];

  const astro: Row[] = [
    { label: f.religion, value: v(data.astro.religion) },
    { label: f.caste, value: v(data.astro.caste) },
    { label: f.subCaste, value: v(data.astro.subCaste) },
    { label: f.gotra, value: v(data.astro.gotra) },
    { label: f.rashi, value: v(data.astro.rashi) },
    { label: f.nakshatra, value: v(data.astro.nakshatra) },
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
    {
      label: f.familyType,
      value: data.family.familyType ? o.familyType[data.family.familyType] : "",
    },
    { label: f.nativePlace, value: v(data.family.nativePlace) },
  ];

  const out: SectionData[] = [
    { key: "personal", title: s.personal, rows: personal },
    { key: "astro", title: s.astro, rows: astro },
    { key: "career", title: s.career, rows: career },
    { key: "family", title: s.family, rows: family },
    { key: "contact", title: s.contact, rows: contact },
  ];
  return out.map((sec) => ({
    ...sec,
    rows: sec.rows.filter((r) => r.value.length > 0),
  }));
}
