import type { HeritageItem } from "./types";
import { UNICODE, V } from "./overview";

const GEN: HeritageItem["source"] = {
  source: "Standard historical / institutional references (cross-checked)",
  last_verified: V,
  note: "secondary",
};

export const HERITAGE: HeritageItem[] = [
  {
    title: "Munshi Mangal Singh Masaram (script, 1918)",
    kind: "person",
    description:
      "Gond scholar of Kochewada (Balaghat, M.P.) who designed the Masaram Gondi abugida in 1918 — the script this website preserves digitally. Encoded in Unicode 10.0 (2017) as U+11D00–U+11D5F.",
    source: UNICODE,
  },
  {
    title: "Rani Durgavati of Garha-Mandla",
    kind: "person",
    description:
      "Gond queen of the Garha-Mandla kingdom (present-day Jabalpur/Mandla region) who resisted the Mughal advance in 1564 — a central figure of Gond historical memory.",
    source: GEN,
  },
  {
    title: "Birsa Munda (Ulgulan)",
    kind: "person",
    description:
      "Munda leader of the Chota Nagpur plateau whose 1899–1900 movement defended tribal land and forest rights; remembered across tribal India.",
    source: GEN,
  },
  {
    title: "Gond kingdoms: Garha-Mandla, Deogar, Chanda",
    kind: "movement",
    description:
      "Medieval Gond states (Garha-Mandla, Deogar/Kherla, Chanda) that shaped central Indian history, architecture and water systems.",
    source: GEN,
  },
  {
    title: "Masaram Gondi enters Unicode 10.0",
    kind: "milestone",
    description:
      "June 2017: the Masaram Gondi block U+11D00–U+11D5F joins the Unicode Standard, enabling digital dictionaries, fonts and keyboards — the foundation of this project.",
    source: UNICODE,
  },
  {
    title: "Gunjala Gondi manuscripts discovered",
    kind: "milestone",
    description:
      "University of Hyderabad researchers recovered ~a dozen manuscripts near Gunjala (Adilabad) in a native script dated up to ~1750; encoded as Gunjala Gondi in Unicode 11.0 (2018).",
    source: UNICODE,
  },
  {
    title: "Ministry of Tribal Affairs (1999)",
    kind: "institution",
    description:
      "Government of India ministry created in 1999 for the integrated development of Scheduled Tribes; maintains ST lists, PVTG data and statistics.",
    source: { source: "Ministry of Tribal Affairs", source_url: "https://tribal.nic.in", source_year: "1999", last_verified: V },
  },
  {
    title: "IGRMS & state tribal museums",
    kind: "institution",
    description:
      "Indira Gandhi Rashtriya Manav Sangrahalaya (Bhopal), MP Tribal Museum and state tribal research institutes (e.g. TRTI Maharashtra) document and display Adivasi heritage.",
    source: GEN,
  },
  {
    title: "PVTG recognition & FRA 2006",
    kind: "milestone",
    description:
      "Particularly Vulnerable Tribal Groups identification and the Forest Rights Act, 2006 — key legal frameworks for tribal habitat rights.",
    source: { source: "Government of India (Forest Rights Act)", source_url: "https://tribal.nic.in", source_year: "2006", last_verified: V },
  },
];
