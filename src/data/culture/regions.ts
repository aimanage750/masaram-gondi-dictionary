import type { RegionInfo } from "./types";

/** Broad cultural regions — an informational grouping, not an official classification. */
export const REGIONS: RegionInfo[] = [
  {
    id: "central",
    name_hi: "मध्य भारत का जनजातीय पेटी",
    name_en: "Central Indian tribal belt",
    description:
      "The largest tribal population in absolute numbers — the Gond heartland, Satpura–Vindhya ranges and Bastar plateau. Gondi, Korku and Munda-group languages meet here.",
    states: ["Madhya Pradesh", "Chhattisgarh", "Maharashtra", "Eastern Gujarat belt"],
    communities: ["Gond (Raj Gond, Maria, Muria)", "Bhil", "Baiga", "Korku", "Warli", "Oraon", "Halba"],
  },
  {
    id: "east",
    name_hi: "पूर्वी भारत",
    name_en: "Eastern India",
    description:
      "Chota Nagpur plateau and Odisha highlands — home to Munda-group languages and some of the oldest documented Adivasi movements.",
    states: ["Jharkhand", "Odisha", "West Bengal", "Bihar"],
    communities: ["Santhal", "Munda", "Oraon", "Ho", "Khond", "Saora", "Bonda", "Lodha"],
  },
  {
    id: "west",
    name_hi: "पश्चिमी भारत",
    name_en: "Western India",
    description:
      "Aravalli and Vindhya fringes, Dang hills and Sahyadri foothills; Bhil culture and rich folk-painting traditions.",
    states: ["Rajasthan", "Gujarat", "Goa", "Dadra & Nagar Haveli"],
    communities: ["Bhil", "Meena", "Garasia", "Rathwa", "Dangi", "Kunbi", "Warli"],
  },
  {
    id: "south",
    name_hi: "दक्षिणी भारत",
    name_en: "Southern India",
    description:
      "Deccan and Western/Eastern Ghats — Dravidian tribal languages including Gondi–Kui group, and hill communities of the Nilgiris and Wayanad.",
    states: ["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Kerala"],
    communities: ["Gond / Koya", "Lambadi (Banjara)", "Chenchu", "Soliga", "Toda", "Irula", "Paniya"],
  },
  {
    id: "northeast",
    name_hi: "पूर्वोत्तर भारत",
    name_en: "North-East India",
    description:
      "Highest tribal percentages in the country; Tibeto-Burman language families and distinctive village-council traditions.",
    states: ["Assam", "Meghalaya", "Nagaland", "Mizoram", "Manipur", "Tripura", "Arunachal Pradesh", "Sikkim"],
    communities: ["Bodo", "Mising", "Karbi", "Khasi", "Garo", "Naga", "Mizo", "Tripuri", "Nyishi", "Apatani", "Lepcha"],
  },
  {
    id: "himalaya",
    name_hi: "हिमालयी क्षेत्र",
    name_en: "Himalayan / North tribal regions",
    description:
      "Trans-Humant pastoral and mountain communities of the western and central Himalaya.",
    states: ["Jammu & Kashmir (incl. Ladakh, 2011)", "Himachal Pradesh", "Uttarakhand"],
    communities: ["Gujjar & Bakarwal", "Gaddi", "Kinnaura", "Lahaula", "Jaunsari", "Tharu", "Bhotia", "Balti", "Broqpa"],
  },
  {
    id: "north",
    name_hi: "उत्तरी मैदान",
    name_en: "Northern plains",
    description:
      "Terai forests and Vindhyan fringes with smaller but significant communities.",
    states: ["Uttar Pradesh", "Haryana / Punjab / Delhi (no notified ST)"],
    communities: ["Tharu", "Bhoksa"],
  },
  {
    id: "islands",
    name_hi: "द्वीप समूह",
    name_en: "Island regions",
    description:
      "Distinct island communities, including Particularly Vulnerable Tribal Groups (PVTGs) of the Andaman archipelago.",
    states: ["Andaman & Nicobar Islands", "Lakshadweep"],
    communities: ["Nicobarese", "Jarawa", "Onge", "Great Andamanese", "Sentinelese", "Lakshadweep islanders"],
  },
];
