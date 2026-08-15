import { type GrammarLesson } from "../types";

export const KAAL: GrammarLesson = {
  slug: "kaal",
  name_hi: "काल",
  name_en: "Tense",
  glyph: "𑴉",
  summary: "भूत, वर्तमान और भविष्यत् काल। स्रोत पुष्टि बाकी।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "काल (Tense) क्रिया के समय को बताता है — भूतकाल (बीता), वर्तमान काल (अभी) और भविष्यत् काल (आगे)।",
      ],
      terms: [
        { label: "English", value: "Tense", script: "en" },
        { label: "हिन्दी", value: "काल" },
        { label: "भूतकाल", value: "Past", script: "en" },
        { label: "वर्तमान काल", value: "Present", script: "en" },
        { label: "भविष्यत् काल", value: "Future", script: "en" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण",
      heading_en: "Examples",
      pending: true,
      paragraphs: ["काल के स्रोत-प्रमाणित वाक्य-उदाहरण उपलब्ध होते ही जोड़े जाएंगे।"],
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: ["काल-परिवर्तन के नियम स्रोत पुष्टि के बाद जोड़े जाएंगे।"],
    },
  ],
};
