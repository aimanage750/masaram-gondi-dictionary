import type { ArtItem } from "./types";
import { INCREDIBLE, V } from "./overview";

const SRC = { ...INCREDIBLE, last_verified: V };

export const ART_ITEMS: ArtItem[] = [
  {
    name: "Gond / Pardhan painting (Jangarh tradition & Digna)",
    category: "painting",
    community: "Pardhan Gond",
    state: "Madhya Pradesh",
    description:
      "Contemporary Gond art grew out of Pardhan bardic traditions and wall/floor 'digna' patterns; artists like Jangarh Singh Shyam (from Patangarh, Dindori) shaped the modern school of dotted, rhythmic nature imagery.",
    source: SRC,
  },
  {
    name: "Warli painting",
    category: "painting",
    community: "Warli",
    state: "Maharashtra (Palghar / Thane)",
    description:
      "White rice-paste pictograms on ochre walls — tarpa dance circles, trees, harvest scenes; among India's most recognised tribal art forms.",
    source: SRC,
  },
  {
    name: "Bhil Pithora painting",
    category: "painting",
    community: "Bhil (Rathwa, Bhilala)",
    state: "Madhya Pradesh · Gujarat",
    description:
      "Ritual wall paintings centred on the horse (Pithora Baba), made during vows and thanksgiving; vivid dotted fields.",
    source: SRC,
  },
  {
    name: "Karma dance",
    category: "dance",
    community: "Gond, Oraon, Baiga",
    state: "Chhattisgarh · Jharkhand · M.P.",
    description:
      "Linked-arm circles revolving around the karam branch, driven by mandar drums — inseparable from the Karma festival.",
    source: SRC,
  },
  {
    name: "Gaur dance",
    category: "dance",
    community: "Maria & Muria Gond",
    state: "Chhattisgarh (Bastar)",
    description:
      "Vigorous male-female dance evoking the bison (gaur), with headgear, bamboo sticks and drumming.",
    source: SRC,
  },
  {
    name: "Dhimsa & Tarpa",
    category: "dance",
    community: "Dhimsa: Porja/Koya tracts; Tarpa: Warli",
    state: "Andhra/Odisha tracts · Maharashtra",
    description:
      "Dhimsa: chain dance of women in ceremonial dress at fairs; Tarpa: spiral dance around the tarpa player.",
    source: SRC,
  },
  {
    name: "Cheraw (bamboo dance)",
    category: "dance",
    community: "Mizo",
    state: "Mizoram",
    description:
      "Dancers step between rhythmically clapped bamboo staves; performed at Chapchar Kut and community feasts.",
    source: SRC,
  },
  {
    name: "Chhau (Seraikela & Purulia styles)",
    category: "dance",
    community: "Chota Nagpur plateau communities (also regional)",
    state: "Jharkhand · West Bengal",
    description:
      "Martial-mask dance theatre; Seraikela and Purulia Chhau are inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity (2010).",
    source: { ...SRC, source: "UNESCO Intangible Cultural Heritage lists / Incredible India", source_url: "https://ich.unesco.org", source_year: "2010", last_verified: V },
  },
  {
    name: "Mandar · Dhol · Sulur (instruments)",
    category: "music",
    community: "Santhal, Oraon, Gond & neighbours",
    state: "Jharkhand · Chhattisgarh · M.P.",
    description:
      "The mandar barrel-drum, nagara/dhol and the sulur bamboo flute define plateau and Gond festival music.",
    source: SRC,
  },
  {
    name: "Dhokra (lost-wax) metal craft",
    category: "metal",
    community: "Dhokra Damar (metal-smith) communities; Gond patronage",
    state: "Chhattisgarh · West Bengal · Odisha",
    description:
      "Ancient lost-wax casting of animals, deities and lamps; Bastar Dhokra is geographically indicated craft.",
    source: SRC,
  },
  {
    name: "Bamboo & palm-leaf craft, terracotta",
    category: "craft",
    community: "Widely practised across tribal India",
    state: "North-East · Bastar · Jharkhand",
    description:
      "Baskets, mats, fish-traps, terracotta horses (Bankura tradition) and festival figurines — everyday craft knowledge.",
    source: SRC,
  },
  {
    name: "Traditional architecture: morung, machang, stilt houses",
    category: "architecture",
    community: "Naga (morung), Mising (stilt chang-ghar), Apatani",
    state: "Nagaland · Assam · Arunachal",
    description:
      "Community bachelor-houses (morung), flood-adapted stilt dwellings and valley-village planning show climate-smart indigenous design.",
    source: SRC,
  },
];
