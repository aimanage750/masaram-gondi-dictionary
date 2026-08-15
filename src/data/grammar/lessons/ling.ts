import { BOOK_SOURCE, gCell, type GrammarLesson } from "../types";

export const LING: GrammarLesson = {
  slug: "ling",
  name_hi: "लिंग",
  name_en: "Gender",
  glyph: "𑴣",
  summary:
    "पुल्लिंग और स्त्रीलिंग रूपों की जानकारी। पुस्तक से मिले कुछ युग्म-शब्द स्रोत-सहित।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "लिंग (Gender) से शब्द के पुल्लिंग या स्त्रीलिंग होने का बोध होता है। गोंडी में कई शब्दों के पुंल्लिंग और स्त्रीलिंग रूप अलग-अलग मिलते हैं।",
      ],
      terms: [
        { label: "English", value: "Gender", script: "en" },
        { label: "हिन्दी", value: "लिंग" },
        { label: "पुल्लिंग", value: "Masculine", script: "en" },
        { label: "स्त्रीलिंग", value: "Feminine", script: "en" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण — युग्म शब्द",
      heading_en: "Examples",
      paragraphs: [
        "पुस्तक (मनुष्य की अवस्थाएँ, पृष्ठ 3) से कुछ पुल्लिंग / स्त्रीलिंग युग्म — जैसा पुस्तक में छपे हैं।",
      ],
      table: {
        caption: "पुल्लिंग ↔ स्त्रीलिंग (" + BOOK_SOURCE + ")",
        columns: ["हिन्दी (पुं.)", "गोंडी (पुं.)", "मसराम", "हिन्दी (स्त्री.)", "गोंडी (स्त्री.)", "मसराम"],
        rows: [
          [{ text: "तरुण" }, { text: "रयोर" }, gCell("रयोर"), { text: "तरुणी" }, { text: "रयाल" }, gCell("रयाल")],
          [{ text: "वृद्ध" }, { text: "सेड़ाल" }, gCell("सेड़ाल"), { text: "वृद्धा" }, { text: "सेड़ो" }, gCell("सेड़ो")],
          [{ text: "कुँवारा" }, { text: "मुंडारा" }, gCell("मुंडारा"), { text: "कुँवारी" }, { text: "मुंडारी" }, gCell("मुंडारी")],
          [{ text: "गोरा" }, { text: "भूराल" }, gCell("भूराल"), { text: "गोरी" }, { text: "भूरी" }, gCell("भूरी")],
        ],
      },
      note: "ये युग्म पुस्तक में मिले शब्द हैं। सामान्य लिंग-नियम स्रोत पुष्टि के बाद लिखे जाएंगे।",
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: [
        "लिंग के आधार पर शब्द-रूप कैसे बदलते हैं, इसका सामान्य नियम स्रोत पुष्टि के बाद जोड़ा जाएगा।",
      ],
    },
  ],
};
