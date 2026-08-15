import type { CultureSource } from "./types";

export const V = "2026-08-15"; // last-verified date for this compilation

export const CENSUS: CultureSource = {
  source: "Census of India 2011 (Registrar General & Census Commissioner)",
  source_url: "https://censusindia.gov.in",
  source_year: "2011",
  last_verified: V,
  note: "primary official",
};

export const MOTA: CultureSource = {
  source: "Ministry of Tribal Affairs, Government of India",
  source_url: "https://tribal.nic.in",
  source_year: "2011",
  last_verified: V,
  note: "primary official",
};

export const TRTI: CultureSource = {
  source: "Statewise Total & Tribal Population table (2011 Census), TRTI Maharashtra",
  source_url: "https://trti.maharashtra.gov.in",
  source_year: "2011",
  last_verified: V,
  note: "government compilation of Census 2011",
};

export const INCREDIBLE: CultureSource = {
  source: "Incredible India, Ministry of Tourism, Government of India",
  source_url: "https://www.incredibleindia.gov.in",
  last_verified: V,
  note: "official tourism reference",
};

export const UNICODE: CultureSource = {
  source: "The Unicode Consortium, Unicode 10.0 release notes",
  source_url: "https://www.unicode.org/versions/Unicode10.0.0/",
  source_year: "2017",
  last_verified: V,
  note: "primary",
};

export const OVERVIEW_STATS = [
  {
    label_en: "Scheduled Tribe population",
    label_hi: "अनुसूचित जनजाति जनसंख्या",
    value: "10,42,81,034",
    value_note: "≈ 10.43 crore",
    ...CENSUS,
  },
  {
    label_en: "Share of India's population",
    label_hi: "भारत की जनसंख्या में हिस्सा",
    value: "8.6%",
    value_note: "11.3% of rural population",
    ...CENSUS,
  },
  {
    label_en: "Notified tribal communities",
    label_hi: "अधिसूचित जनजातियाँ",
    value: "705",
    value_note: "across 30 States/UTs",
    ...MOTA,
  },
  {
    label_en: "ST literacy rate",
    label_hi: "जनजाति साक्षरता",
    value: "59%",
    value_note: "vs 74% national (2011)",
    ...CENSUS,
  },
] as const;

export const DISTRIBUTION_NOTES = [
  {
    heading: "Absolute population",
    heading_hi: "संख्यात्मक दृष्टि से",
    text: "Six states — Madhya Pradesh, Maharashtra, Odisha, Gujarat, Rajasthan and Jharkhand — together account for about 71% of India's Scheduled Tribe population. Madhya Pradesh has the largest tribal population (≈1.53 crore in 2011).",
  },
  {
    heading: "Percentage of state population",
    heading_hi: "अनुपात की दृष्टि से",
    text: "A large absolute number is not the same as a high share. Lakshadweep (94.8%), Mizoram (94.4%), Nagaland (86.5%), Meghalaya (86.1%) and Arunachal Pradesh (68.8%) have the highest ST shares, while populous states like Uttar Pradesh (0.6%) have very low shares.",
  },
  {
    heading: "No notified ST population",
    heading_hi: "जहाँ अधिसूचित जनजाति नहीं है",
    text: "As per Census 2011, Punjab, Haryana, Delhi, Chandigarh and Puducherry have no notified Scheduled Tribe population.",
  },
] as const;

export const OVERVIEW_PARA =
  "भारत की जनजातियाँ (Adivasi / Scheduled Tribes) भाषाओं, संस्कृतियों और परंपराओं की दृष्टि से अत्यंत विविध हैं — 705 अधिसूचित समुदाय एक-सा 'आदिवासी' अनुभव साझा नहीं करते। यह पोर्टल Census of India 2011 एवं सरकारी स्रोतों के आधार पर जानकारी प्रस्तुत करता है।";
