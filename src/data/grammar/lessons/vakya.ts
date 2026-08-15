import { type GrammarLesson } from "../types";

export const VAKYA: GrammarLesson = {
  slug: "vakya",
  name_hi: "वाक्य",
  name_en: "Sentence",
  glyph: "𑴧",
  summary: "वाक्य-रचना और शब्द-क्रम। स्रोत पुष्टि बाकी।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "वाक्य (Sentence) शब्दों का ऐसा समूह है जो पूरा अर्थ देता है। द्रविड़ भाषा-परिवार में सामान्यतः कर्ता–कर्म–क्रिया (SOV) क्रम मिलता है।",
      ],
      terms: [
        { label: "English", value: "Sentence", script: "en" },
        { label: "हिन्दी", value: "वाक्य" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण",
      heading_en: "Examples",
      pending: true,
      paragraphs: [
        "वाक्य-रचना के स्रोत-प्रमाणित उदाहरण वाक्यांश अनुभाग से जोड़े जाएंगे। नीचे वाक्यांश पृष्ठ देखें।",
      ],
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: ["शब्द-क्रम और वाक्य-रचना के नियम स्रोत पुष्टि के बाद जोड़े जाएंगे।"],
    },
  ],
};
