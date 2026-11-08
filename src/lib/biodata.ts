export type TemplateId =
  | "traditional"
  | "royal"
  | "modern"
  | "floral"
  | "emerald"
  | "mandala"
  | "peacock"
  | "jharokha"
  | "toran"
  | "banarasi"
  | "kalash"
  | "navy";

export const TEMPLATE_IDS: TemplateId[] = [
  "traditional",
  "royal",
  "modern",
  "floral",
  "emerald",
  "mandala",
  "peacock",
  "jharokha",
  "toran",
  "banarasi",
  "kalash",
  "navy",
];

export type OutputLocale = "en" | "hi";

export type CandidateFor = "groom" | "bride";

/** User-defined field appended to a section. */
export interface CustomField {
  id: string;
  section: string;
  label: string;
  value: string;
}

/** A fully user-defined section (own title + fields). */
export interface CustomSection {
  id: string;
  title: string;
  fields: { id: string; label: string; value: string }[];
}

export interface MatchPrefs {
  /** Preferred partner age band, e.g. "25", "30". */
  ageMin: string;
  ageMax: string;
  /** Preferred education level (free text — communities vary). */
  education: string;
  /** 'yes' | 'no' | '' — vegetarian-only preference. */
  vegOnly: "yes" | "no" | "";
  /** 'yes' | 'optional' | 'no' | '' — kundli matching. */
  kundli: "yes" | "optional" | "no" | "";
}

export type FrameStyle =
  | "classic"
  | "rounded"
  | "oval"
  | "circle"
  | "arch"
  | "ornate";

export type InvocationIcon =
  | "none"
  | "om"
  | "swastik"
  | "kalash"
  | "diya"
  | "lotus"
  | "ganesha";

export type PageBg =
  | "template"
  | "white"
  | "ivory"
  | "cream"
  | "blush"
  | "mint"
  | "sandal";

export type PageBorderStyle =
  | "template"
  | "none"
  | "line"
  | "double"
  | "ornate"
  | "floral";

export type Manglik = "" | "yes" | "no" | "anshik";
export type MaritalStatus = "" | "never" | "divorced" | "widowed" | "awaiting";
export type FamilyType = "" | "nuclear" | "joint";
export type Diet = "" | "veg" | "nonveg" | "eggetarian" | "jain" | "vegan";
export type Complexion = "" | "veryFair" | "fair" | "wheatish" | "dusky";
export type PhoneOwner = "" | "self" | "father" | "mother" | "other";

export interface PersonalDetails {
  name: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  weight: string;
  complexion: Complexion;
  bloodGroup: string;
  maritalStatus: MaritalStatus;
  diet: Diet;
  /** Where the candidate currently lives. */
  residenceCity: string;
  /** Known languages, e.g. "Hindi, English". */
  languages: string;
  /** Free-text interests line. */
  hobbies: string;
}

export interface AstroDetails {
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  rashi: string;
  nakshatra: string;
  charan: string;
  gana: string;
  nadi: string;
  manglik: Manglik;
  motherTongue: string;
  kuldevta: string;
}

export interface CareerDetails {
  qualification: string;
  college: string;
  occupation: string;
  company: string;
  income: string;
}

export interface FamilyDetails {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  mama: string;
  grandfather: string;
  familyType: FamilyType;
  nativePlace: string;
}

export interface ContactDetails {
  phone: string;
  phoneOwner: PhoneOwner;
  fatherPhone: string;
  motherPhone: string;
  email: string;
  address: string;
}

export interface BiodataData {
  template: TemplateId;
  outputLocale: OutputLocale;
  /** Accent color for the modern template (hex). */
  accent?: string;
  /** Photo frame style — applied across all templates. */
  photoFrame?: FrameStyle;
  /** Page border override; 'template' keeps each design's signature border. */
  pageBorder?: PageBorderStyle;
  /** Auspicious icon drawn above the invocation line. */
  invocationIcon?: InvocationIcon;
  /** Paper background override; 'template' keeps each design's tone. */
  pageBackground?: PageBg;
  /** Downscaled JPEG data URL — excluded from share links. */
  photo?: string;
  invocation: string;
  personal: PersonalDetails;
  astro: AstroDetails;
  career: CareerDetails;
  family: FamilyDetails;
  contact: ContactDetails;
  aboutMe: string;
  /** "About our family" paragraph — standard in North Indian biodatas. */
  familyAbout: string;
  /** What the partner/candidate wants. */
  expectations: string;
  /** What the family wants — distinct from the candidate's. */
  familyExpectations: string;
  /** Optional structured match preferences shown as a rows block. */
  prefs?: MatchPrefs;
  /** Optional bride/groom designation for the title. */
  candidateFor?: CandidateFor;
  /** Optional biodata number/reference line at the page footer. */
  biodataNo?: string;
  /** Section keys hidden from the PDF (e.g. "astro"). */
  hiddenSections?: string[];
  /** "section.field" composite keys hidden from the PDF. */
  hiddenFields?: string[];
  /** User-defined fields appended to their parent section. */
  customFields?: CustomField[];
  /** Optional display order for the 5 core sections. */
  sectionOrder?: string[];
  /** User-defined extra sections rendered after core sections. */
  customSections?: CustomSection[];
  /** Render a dedicated cover page before the biodata. */
  coverPage?: boolean;
}

export const DEFAULT_INVOCATION = "॥ श्री गणेशाय नमः ॥";

export const emptyBiodata: BiodataData = {
  template: "traditional",
  outputLocale: "en",
  photo: undefined,
  invocation: DEFAULT_INVOCATION,
  personal: {
    name: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
    height: "",
    weight: "",
    complexion: "",
    bloodGroup: "",
    maritalStatus: "",
    diet: "",
    residenceCity: "",
    languages: "",
    hobbies: "",
  },
  astro: {
    religion: "Hindu",
    caste: "",
    subCaste: "",
    gotra: "",
    rashi: "",
    nakshatra: "",
    charan: "",
    gana: "",
    nadi: "",
    manglik: "",
    motherTongue: "",
    kuldevta: "",
  },
  career: {
    qualification: "",
    college: "",
    occupation: "",
    company: "",
    income: "",
  },
  family: {
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    siblings: "",
    mama: "",
    grandfather: "",
    familyType: "",
    nativePlace: "",
  },
  contact: {
    phone: "",
    phoneOwner: "",
    fatherPhone: "",
    motherPhone: "",
    email: "",
    address: "",
  },
  aboutMe: "",
  familyAbout: "",
  expectations: "",
  familyExpectations: "",
  prefs: { ageMin: "", ageMax: "", education: "", vegOnly: "", kundli: "" },
  hiddenSections: [],
  hiddenFields: [],
  customFields: [],
  sectionOrder: [],
  customSections: [],
  coverPage: false,
};

/** Friendly sample so the preview is never blank. */
export const sampleBiodata: BiodataData = {
  ...emptyBiodata,
  personal: {
    name: "Aarav Sharma",
    dob: "1995-03-15",
    birthTime: "04:32",
    birthPlace: "Jaipur, Rajasthan",
    height: "5'10\"",
    weight: "72 kg",
    complexion: "fair",
    bloodGroup: "B+",
    maritalStatus: "never",
    diet: "veg",
    residenceCity: "Bengaluru",
    languages: "Hindi, English, Rajasthani",
    hobbies: "Travel, photography, cricket",
  },
  astro: {
    religion: "Hindu",
    caste: "Brahmin",
    subCaste: "Saryupareen",
    gotra: "Bharadwaj",
    rashi: "Vrishabha (Taurus)",
    nakshatra: "Krittika",
    charan: "2nd Pada",
    gana: "Manushya",
    nadi: "Madhya",
    manglik: "no",
    motherTongue: "Hindi",
    kuldevta: "",
  },
  career: {
    qualification: "B.Tech (Computer Science)",
    college: "MNIT Jaipur",
    occupation: "Senior Software Engineer",
    company: "Bengaluru",
    income: "₹28–32 LPA",
  },
  family: {
    fatherName: "Suresh Sharma",
    fatherOccupation: "Retired Bank Manager",
    motherName: "Sushma Sharma",
    motherOccupation: "Homemaker",
    siblings: "1 elder sister (married)",
    mama: "Ramesh Gupta, Kanpur",
    grandfather: "Late Shri Ramgopal Sharma",
    familyType: "nuclear",
    nativePlace: "Varanasi, UP",
  },
  contact: {
    phone: "+91 98XXXXXXXX",
    phoneOwner: "father",
    fatherPhone: "+91 98XXXXXXXX",
    motherPhone: "+91 94XXXXXXXX",
    email: "family@example.com",
    address: "Malviya Nagar, Jaipur 302017",
  },
  aboutMe:
    "Calm, family-oriented and fond of trekking and old Hindi music. Balances a modern career with traditional values.",
  familyAbout:
    "A close-knit Brahmin family originally from Varanasi, now settled in Jaipur in our own house. Father retired as bank manager, mother is a homemaker. We value simplicity, education and togetherness.",
  expectations:
    "Well-educated, kind-hearted partner from a cultured family. Working professional preferred.",
  familyExpectations:
    "We welcome the partner as part of our family — no demands, only mutual respect and love. Early engagement preferred.",
  prefs: {
    ageMin: "25",
    ageMax: "30",
    education: "Graduate+",
    vegOnly: "yes",
    kundli: "yes",
  },
  candidateFor: "groom",
};

/**
 * Merge persisted/shared data over emptyBiodata so older stored shapes
 * (which predate fields added later) never produce undefined sections.
 * Arrays/objects from `d` win; missing keys get defaults.
 */
export function normalizeData(d: Partial<BiodataData> | undefined | null): BiodataData {
  const base = emptyBiodata;
  const src: Partial<BiodataData> = d ?? {};
  const out = { ...base, ...src } as BiodataData;
  // nested plain objects — merge each so missing sub-fields get defaults
  for (const key of ["personal","astro","career","family","contact","prefs"] as const) {
    out[key] = { ...base[key], ...(src[key] ?? {}) } as never;
  }
  return out;
}

/** Whether a core editor section has any non-empty content. */
export function sectionHasData(data: BiodataData, section: string): boolean {
  const has = (o: object | undefined) =>
    !!o && Object.values(o).some((v) => typeof v === "string" && v.trim().length > 0);
  switch (section) {
    case "photo": return !!data.photo || !!data.invocation.trim();
    case "personal": return has(data.personal);
    case "astro": return has(data.astro);
    case "career": return has(data.career);
    case "family": return has(data.family);
    case "contact": return has(data.contact);
    case "extras":
      return !!(data.aboutMe.trim() || data.expectations.trim() ||
        data.familyAbout?.trim() || data.familyExpectations?.trim() ||
        (data.prefs && Object.values(data.prefs).some((v) => typeof v === "string" && v.trim())));
    default: return false;
  }
}
