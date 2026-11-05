import type { OutputLocale } from "@/lib/biodata";

/** Labels rendered inside the generated biodata document (not the app UI). */
export interface DocLabels {
  title: string;
  sections: Record<
    | "personal"
    | "astro"
    | "career"
    | "family"
    | "contact"
    | "about"
    | "aboutFamily"
    | "expectations"
    | "familyExpectations"
    | "prefs",
    string
  >;
  fields: Record<
    | "name"
    | "dob"
    | "birthTime"
    | "birthPlace"
    | "height"
    | "weight"
    | "complexion"
    | "bloodGroup"
    | "maritalStatus"
    | "diet"
    | "religion"
    | "caste"
    | "subCaste"
    | "gotra"
    | "rashi"
    | "nakshatra"
    | "charan"
    | "gana"
    | "nadi"
    | "manglik"
    | "motherTongue"
    | "kuldevta"
    | "qualification"
    | "college"
    | "occupation"
    | "company"
    | "income"
    | "father"
    | "mother"
    | "siblings"
    | "mama"
    | "grandfather"
    | "familyType"
    | "nativePlace"
    | "phone"
    | "fatherPhone"
    | "motherPhone"
    | "email"
    | "address"
    | "residenceCity"
    | "languages"
    | "hobbies"
    | "prefAge"
    | "prefEducation"
    | "prefVeg"
    | "prefKundli",
    string
  >;
  options: {
    manglik: Record<"yes" | "no" | "anshik", string>;
    maritalStatus: Record<"never" | "divorced" | "widowed" | "awaiting", string>;
    familyType: Record<"nuclear" | "joint", string>;
    diet: Record<"veg" | "nonveg" | "eggetarian" | "jain" | "vegan", string>;
    vegOnly: Record<"yes" | "no", string>;
    kundli: Record<"yes" | "optional" | "no", string>;
    complexion: Record<"veryFair" | "fair" | "wheatish" | "dusky", string>;
    phoneOwner: Record<"self" | "father" | "mother" | "other", string>;
  };
  /** react-pdf font families to use per output language. */
  fonts: { heading: string; text: string; value: string };
  candidateFor: Record<"groom" | "bride", string>;
}

const en: DocLabels = {
  title: "Marriage Biodata",
  sections: {
    personal: "Personal Details",
    astro: "Horoscope Details",
    career: "Education & Career",
    family: "Family Details",
    contact: "Contact Details",
    about: "About Me",
    aboutFamily: "About Family",
    expectations: "Partner Expectations",
    familyExpectations: "Family Expectations",
    prefs: "Partner Preferences",
  },
  fields: {
    name: "Name",
    dob: "Date of Birth",
    birthTime: "Time of Birth",
    birthPlace: "Place of Birth",
    height: "Height",
    weight: "Weight",
    complexion: "Complexion",
    bloodGroup: "Blood Group",
    maritalStatus: "Marital Status",
    diet: "Diet",
    religion: "Religion",
    caste: "Caste",
    subCaste: "Sub-caste",
    gotra: "Gotra",
    rashi: "Rashi",
    nakshatra: "Nakshatra",
    charan: "Charan / Pada",
    gana: "Gana",
    nadi: "Nadi",
    manglik: "Manglik",
    motherTongue: "Mother Tongue",
    kuldevta: "Kuldevta",
    qualification: "Education",
    college: "College",
    occupation: "Occupation",
    company: "Company",
    income: "Annual Income",
    father: "Father",
    mother: "Mother",
    siblings: "Siblings",
    mama: "Mama (Maternal Uncle)",
    grandfather: "Grandfather",
    familyType: "Family Type",
    nativePlace: "Native Place",
    phone: "Phone",
    fatherPhone: "Father's Phone",
    motherPhone: "Mother's Phone",
    email: "Email",
    address: "Address",
    residenceCity: "Residence",
    languages: "Languages",
    hobbies: "Hobbies",
    prefAge: "Preferred Age",
    prefEducation: "Preferred Education",
    prefVeg: "Vegetarian Preferred",
    prefKundli: "Kundli Matching",
  },
  options: {
    manglik: { yes: "Manglik", no: "Non-Manglik", anshik: "Anshik Manglik" },
    vegOnly: { yes: "Yes", no: "No" },
    kundli: { yes: "Required", optional: "Optional", no: "Not Required" },
    maritalStatus: {
      never: "Never Married",
      divorced: "Divorced",
      widowed: "Widowed",
      awaiting: "Awaiting Divorce",
    },
    familyType: { nuclear: "Nuclear", joint: "Joint" },
    diet: {
      veg: "Vegetarian",
      nonveg: "Non-Vegetarian",
      eggetarian: "Eggetarian",
      jain: "Jain Vegetarian",
      vegan: "Vegan",
    },
    complexion: {
      veryFair: "Very Fair",
      fair: "Fair",
      wheatish: "Wheatish",
      dusky: "Dusky",
    },
    phoneOwner: {
      self: "Self",
      father: "Father",
      mother: "Mother",
      other: "Family",
    },
  },
  fonts: { heading: "Display", text: "Serif", value: "Devanagari" },
  candidateFor: { groom: "Groom", bride: "Bride" },
};

const hi: DocLabels = {
  title: "विवाह हेतु परिचय पत्र",
  sections: {
    personal: "व्यक्तिगत विवरण",
    astro: "ज्योतिष विवरण",
    career: "शिक्षा एवं व्यवसाय",
    family: "पारिवारिक विवरण",
    contact: "संपर्क सूत्र",
    about: "मेरे बारे में",
    aboutFamily: "परिवार के बारे में",
    expectations: "जीवनसाथी अपेक्षाएं",
    familyExpectations: "पारिवारिक अपेक्षाएं",
    prefs: "जीवनसाथी वरीयताएँ",
  },
  fields: {
    name: "नाम",
    dob: "जन्म तिथि",
    birthTime: "जन्म समय",
    birthPlace: "जन्म स्थान",
    height: "ऊंचाई",
    weight: "वज़न",
    complexion: "रंग",
    bloodGroup: "रक्त समूह",
    maritalStatus: "वैवाहिक स्थिति",
    diet: "आहार",
    religion: "धर्म",
    caste: "जाति",
    subCaste: "उपजाति",
    gotra: "गोत्र",
    rashi: "राशि",
    nakshatra: "नक्षत्र",
    charan: "चरण / पादा",
    gana: "गण",
    nadi: "नाड़ी",
    manglik: "मांगलिक",
    motherTongue: "मातृभाषा",
    kuldevta: "कुलदेवता",
    qualification: "शिक्षा",
    college: "कॉलेज",
    occupation: "व्यवसाय",
    company: "कंपनी",
    income: "वार्षिक आय",
    father: "पिता",
    mother: "माता",
    siblings: "भाई-बहन",
    mama: "मामा",
    grandfather: "दादाजी / नानाजी",
    familyType: "परिवार प्रकार",
    nativePlace: "मूल निवास",
    phone: "फोन",
    fatherPhone: "पिता का फोन",
    motherPhone: "माता का फोन",
    email: "ईमेल",
    address: "पता",
    residenceCity: "निवास स्थान",
    languages: "भाषाएँ",
    hobbies: "शौक",
    prefAge: "अपेक्षित आयु",
    prefEducation: "अपेक्षित शिक्षा",
    prefVeg: "शाकाहारी वरीय",
    prefKundli: "कुंडली मिलान",
  },
  options: {
    manglik: { yes: "मांगलिक", no: "नॉन-मांगलिक", anshik: "आंशिक मांगलिक" },
    vegOnly: { yes: "हाँ", no: "नहीं" },
    kundli: { yes: "आवश्यक", optional: "वैकल्पिक", no: "आवश्यक नहीं" },
    maritalStatus: {
      never: "अविवाहित",
      divorced: "तलाकशुदा",
      widowed: "विधवा / विधुर",
      awaiting: "तलाक प्रक्रिया में",
    },
    familyType: { nuclear: "एकल परिवार", joint: "संयुक्त परिवार" },
    diet: {
      veg: "शाकाहारी",
      nonveg: "मांसाहारी",
      eggetarian: "अंडाहारी",
      jain: "जैन शाकाहारी",
      vegan: "शुद्ध शाकाहारी",
    },
    complexion: {
      veryFair: "अति गोरा",
      fair: "गोरा",
      wheatish: "गेहुंआ",
      dusky: "सांवला",
    },
    phoneOwner: { self: "स्वयं", father: "पिता", mother: "माता", other: "परिजन" },
  },
  fonts: {
    heading: "DevanagariDisplay",
    text: "Devanagari",
    value: "Devanagari",
  },
  candidateFor: { groom: "वर", bride: "वधू" },
};

const map: Record<OutputLocale, DocLabels> = { en, hi };

export function docLabels(locale: OutputLocale): DocLabels {
  return map[locale] ?? en;
}

const DEV_DIGITS = "०१२३४५६७८९";
export function localizeDigits(s: string, locale: OutputLocale): string {
  if (locale !== "hi") return s;
  return s.replace(/[0-9]/g, (d) => DEV_DIGITS[Number(d)]);
}

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_HI = [
  "जनवरी",
  "फ़रवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

/** ISO `YYYY-MM-DD` → "15 March 1995" / "१५ मार्च १९९५". Non-ISO input passes through. */
export function formatDob(iso: string, locale: OutputLocale): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  const month = locale === "hi" ? MONTHS_HI[+mo - 1] : MONTHS_EN[+mo - 1];
  const day = String(+d);
  return locale === "hi"
    ? `${localizeDigits(day, "hi")} ${month} ${localizeDigits(y, "hi")}`
    : `${day} ${month} ${y}`;
}

/** `HH:MM` 24h → "4:32 AM" / "सुबह ४:३२". Non-matching input passes through. */
export function formatBirthTime(hhmm: string, locale: OutputLocale): string {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!m) return hhmm;
  let h = +m[1];
  const min = m[2];
  const am = h < 12;
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const time = `${h}:${min}`;
  if (locale === "hi") {
    const part = am ? "सुबह" : h === 12 ? "दोपहर" : +m[1] < 17 ? "दोपहर" : "शाम";
    return `${part} ${localizeDigits(time, "hi")} बजे`;
  }
  return `${time} ${am ? "AM" : "PM"}`;
}
