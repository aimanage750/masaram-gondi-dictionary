import { BOOK_SOURCE, ex, type GrammarLesson } from "../types";

export const KRIYA: GrammarLesson = {
  slug: "kriya",
  name_hi: "क्रिया",
  name_en: "Verb",
  glyph: "𑴨",
  summary:
    "काम या भाव बताने वाले शब्द। पुस्तक के पृष्ठ 2 से स्रोत-सहित क्रिया उदाहरण।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "क्रिया (Verb) वह शब्द जो कोई काम, घटना या भाव बताता है — जैसे बोलना, सुनना, देखना।",
      ],
      terms: [
        { label: "English", value: "Verb", script: "en" },
        { label: "हिन्दी", value: "क्रिया" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण",
      heading_en: "Examples",
      paragraphs: [
        "ये क्रिया-शब्द अपलोड की गई पुस्तक (पृष्ठ 2) से लिए गए हैं। ये धातु/मूल रूप हैं जैसा पुस्तक में छपे हैं।",
      ],
      examples: [
        ex("वन्कीना", "बोलना", "Speak", BOOK_SOURCE, "पृष्ठ 2"),
        ex("केंजाना", "सुनना", "Hear", BOOK_SOURCE, "पृष्ठ 2"),
        ex("तकवाना", "देखना", "See", BOOK_SOURCE, "पृष्ठ 2"),
        ex("इट्टाना", "स्पर्श करना", "Touch", BOOK_SOURCE, "पृष्ठ 2"),
        ex("नेस्कीना", "सांस लेना", "Breathe", BOOK_SOURCE, "पृष्ठ 2"),
      ],
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: [
        "क्रिया-रूप (काल, कर्ता के अनुसार बदलाव, निषेधात्मक रूप) के नियम स्रोत सामग्री से पुष्टि के बाद जोड़े जाएंगे।",
      ],
    },
  ],
};
