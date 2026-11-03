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
  expectations: string;
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
    email: "",
    address: "",
  },
  aboutMe: "",
  expectations: "",
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
    email: "family@example.com",
    address: "Malviya Nagar, Jaipur 302017",
  },
  aboutMe:
    "Calm, family-oriented and fond of trekking and old Hindi music. Balances a modern career with traditional values.",
  expectations:
    "Well-educated, kind-hearted partner from a cultured family. Working professional preferred.",
};
