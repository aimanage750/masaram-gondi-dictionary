import type { CultureSource, GondiStateRow, ScriptInfo } from "./types";
import { CENSUS, UNICODE, V } from "./overview";

export const WIKI_GONDI: CultureSource = {
  source: "Gondi language research literature (cross-checked secondary)",
  source_url: "https://en.wikipedia.org/wiki/Gondi_language",
  last_verified: V,
  note: "secondary — cross-checked",
};

export const GONDI_FACTS = [
  {
    label_en: "Gondi speakers (mother tongue)",
    label_hi: "गोंडी वक्ता",
    value: "2.98 million",
    source: CENSUS,
  },
  {
    label_en: "People identifying as Gond",
    label_hi: "गोंड समुदाय",
    value: "≈ 13 million",
    source: WIKI_GONDI,
  },
  {
    label_en: "Language family",
    label_hi: "भाषा परिवार",
    value: "Dravidian (South-Central)",
    source: WIKI_GONDI,
  },
  {
    label_en: "Native name",
    label_hi: "स्थानीय नाम",
    value: "Koitur (Kōī / Kōītōr)",
    source: WIKI_GONDI,
  },
] as const;

export const GONDI_NOTES = [
  "Gondi is highly endangered: only about one-fifth of Gond people recorded Gondi as their mother tongue in 2011 — a result of long-term language shift towards Hindi, Marathi, Chhattisgarhi, Odia and Telugu.",
  "Major dialects recorded: Dorla, Koya, Madiya, Muria and Raj Gond. North-western and south-eastern varieties differ (e.g. treatment of initial *s* → preserved in the north-west, shifted to *h* in the south-east).",
  "Different Gondi communities write their language in different scripts — Devanagari, Telugu and Odia are commonly used alongside the native Masaram and Gunjala scripts. No single script is universal.",
];

export const GONDI_STATES: GondiStateRow[] = [
  {
    state: "Madhya Pradesh",
    regions: "South-east MP",
    districts: "Balaghat, Mandla, Dindori, Seoni, Chhindwara, Betul",
    communities: "Raj Gond, Dhurve, Pardhan (Pardhan Gond)",
    scripts: "Devanagari common · Masaram Gondi documented",
    note: "Balaghat district is associated with Munshi Mangal Singh Masaram (Kochewada).",
    source: WIKI_GONDI,
  },
  {
    state: "Maharashtra",
    regions: "Eastern Maharashtra (Vidarbha)",
    districts: "Gadchiroli, Chandrapur, Yavatmal, Amravati, Gondia, Nagpur (rural)",
    communities: "Raj Gond, Pardhan, Korku-speaking neighbours",
    scripts: "Devanagari common · Masaram Gondi documented",
    note: "Masaram Gondi has been promoted in parts of Vidarbha; reported official adoption in Maharashtra (2011) per script literature.",
    source: WIKI_GONDI,
  },
  {
    state: "Chhattisgarh",
    regions: "Bastar division",
    districts: "Bastar, Dantewada, Narayanpur, Bijapur, Sukma",
    communities: "Dorla, Maria (Abujmaria), Muria, Dhruva",
    scripts: "Devanagari common",
    note: "Dorla and Madiya varieties recorded in Bastar.",
    source: WIKI_GONDI,
  },
  {
    state: "Telangana",
    regions: "Northern Telangana",
    districts: "Adilabad, Komaram Bheem Asifabad, Bhadradri Kothagudem",
    communities: "Raj Gond, Naikpod, Koya, Madiya",
    scripts: "Telugu common · Gunjala Gondi Lipi revival",
    note: "Gunjala Gondi manuscripts recovered near Adilabad; school-teaching programmes reported.",
    source: WIKI_GONDI,
  },
  {
    state: "Andhra Pradesh",
    regions: "Northern / agency areas",
    districts: "Agency tracts bordering Telangana & Odisha",
    communities: "Koya, Konda Reddi, Konda Dora",
    scripts: "Telugu common",
    source: WIKI_GONDI,
  },
  {
    state: "Odisha",
    regions: "Southern Odisha",
    districts: "Nabarangpur, Koraput (border tracts)",
    communities: "Dorla, Gadba neighbours, Bonda region",
    scripts: "Odia / Devanagari influence; Telugu in southern tracts",
    source: WIKI_GONDI,
  },
];

export const SCRIPTS: ScriptInfo[] = [
  {
    name: "Masaram Gondi",
    unicode: "U+11D00–U+11D5F (Unicode 10.0, June 2017) · ISO 15924: Gonm (313)",
    period: "1918–present",
    usage: "Designed by Munshi Mangal Singh Masaram (Balaghat, M.P.) on a Brahmi-derived abugida pattern; used by sections of the Gond community; this website's dictionary, converter and keyboard are built on it.",
    note: "Commonly documented — not universal across all Gondi communities.",
    source: UNICODE,
  },
  {
    name: "Gunjala Gondi Lipi",
    unicode: "Unicode 11.0 (June 2018)",
    period: "manuscripts dated up to ~1750",
    usage: "Discovered in Gond villages near Adilabad (University of Hyderabad research); manuscripts record Gond raja histories, festivals and calendars; revival and school-teaching efforts ongoing in Telangana/Andhra tracts.",
    note: "A distinct native script — separate from Masaram Gondi.",
    source: UNICODE,
  },
  {
    name: "Devanagari",
    usage: "Widely used for Gondi in Madhya Pradesh, Maharashtra and Chhattisgarh (education, print, digital text).",
    note: "Adapted script — shared with Hindi/Marathi.",
    source: WIKI_GONDI,
  },
  {
    name: "Telugu",
    usage: "Commonly used for Gondi in Telangana and Andhra Pradesh tracts.",
    note: "Adapted script — shared with Telugu.",
    source: WIKI_GONDI,
  },
  {
    name: "Odia & other regional systems",
    usage: "Documented in Odisha border tracts and in older records.",
    note: "Usage varies by region and community.",
    source: WIKI_GONDI,
  },
];
