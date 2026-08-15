import { type GrammarLesson } from "../types";

export const ANYA: GrammarLesson = {
  slug: "anya",
  name_hi: "अन्य विषय",
  name_en: "Other Topics",
  glyph: "𑴀",
  summary: "समास, अव्यय, विराम-चिह्न आदि अन्य व्याकरण विषय। स्रोत पुष्टि बाकी।",
  sections: [
    {
      id: "parichay",
      heading: "परिचय",
      heading_en: "Overview",
      paragraphs: [
        "यहाँ अन्य व्याकरण विषय रखे जाएंगे — जैसे अव्यय, समास ( Compound ), संबोधन, और मसराम गोंडी लिपि के विराम-चिह्न।",
      ],
    },
    {
      id: "vishay-soochi",
      heading: "विषय-सूची",
      heading_en: "Planned topics",
      pending: true,
      paragraphs: [
        "अव्यय (Indeclinable) — स्रोत पुष्टि बाकी",
        "समास (Compound) — स्रोत पुष्टि बाकी",
        "संबोधन (Vocative) — स्रोत पुष्टि बाकी",
        "विराम-चिह्न (Punctuation) — स्रोत पुष्टि बाकी",
      ],
    },
  ],
};
