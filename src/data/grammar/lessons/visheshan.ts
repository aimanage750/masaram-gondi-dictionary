import { BOOK_SOURCE, ex, type GrammarLesson } from "../types";

export const VISHESHAN: GrammarLesson = {
  slug: "visheshan",
  name_hi: "विशेषण",
  name_en: "Adjective",
  glyph: "𑴌",
  summary:
    "संज्ञा की विशेषता बताने वाले शब्द। पुस्तक के पृष्ठ 3 से स्रोत-सहित उदाहरण।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "विशेषण (Adjective) वह शब्द जो संज्ञा या सर्वनाम की विशेषता बताता है — जैसे सुंदर, खूबसूरत, बदसूरत।",
      ],
      terms: [
        { label: "English", value: "Adjective", script: "en" },
        { label: "हिन्दी", value: "विशेषण" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण",
      heading_en: "Examples",
      paragraphs: [
        "ये विशेषण अपलोड की गई पुस्तक (पृष्ठ 3, मनुष्य की अवस्थाएँ) से लिए गए हैं।",
      ],
      examples: [
        ex("कवय", "सुंदर", "Beautiful", BOOK_SOURCE, "पृष्ठ 3"),
        ex("कवयतोर", "खूबसूरत", "Handsome", BOOK_SOURCE, "पृष्ठ 3"),
        ex("बयंगाल", "बदसूरत", "Ugly", BOOK_SOURCE, "पृष्ठ 3"),
        ex("भूराल", "गोरा", "Fair-skinned man", BOOK_SOURCE, "पृष्ठ 3"),
        ex("भूरी", "गोरी", "Fair-skinned woman", BOOK_SOURCE, "पृष्ठ 3"),
      ],
      note: "स्रोत में भूराल / भूरी जैसे युग्म दिखाते हैं कि कुछ विशेषणों के पुंल्लिंग और स्त्रीलिंग रूप अलग हो सकते हैं। इसका सामान्य नियम स्रोत पुष्टि के बाद लिखा जाएगा।",
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: [
        "विशेषणों के रूप-परिवर्तन (लिंग/वचन के साथ बदलाव) के नियम स्रोत पुष्टि के बाद जोड़े जाएंगे।",
      ],
    },
  ],
};
