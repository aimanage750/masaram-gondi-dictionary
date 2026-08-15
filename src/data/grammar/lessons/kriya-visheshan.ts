import { BOOK_SOURCE, ex, type GrammarLesson } from "../types";

export const KRIYA_VISHESHAN: GrammarLesson = {
  slug: "kriya-visheshan",
  name_hi: "क्रिया विशेषण",
  name_en: "Adverb",
  glyph: "𑴂",
  summary:
    "क्रिया की विशेषता बताने वाले शब्द (अभी, बाद में, जब, तब)। पुस्तक के समय-अध्याय से स्रोत-सहित।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "क्रिया-विशेषण (Adverb) वह शब्द जो क्रिया, विशेषण या दूसरे क्रिया-विशेषण की विशेषता बताता है — जैसे कब, कहाँ, कैसे। पुस्तक में समय-वाचक शब्द इसी श्रेणी में आते हैं।",
      ],
      terms: [
        { label: "English", value: "Adverb", script: "en" },
        { label: "हिन्दी", value: "क्रिया विशेषण" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण — समय-वाचक",
      heading_en: "Examples",
      paragraphs: [
        "ये समय-वाचक क्रिया-विशेषण अपलोड की गई पुस्तक (समय अध्याय, पृष्ठ 31) से लिए गए हैं।",
      ],
      examples: [
        ex("इंदेके", "अभी", "Now", BOOK_SOURCE, "पृष्ठ 31"),
        ex("फिरान", "बाद में", "Afterwards", BOOK_SOURCE, "पृष्ठ 31"),
        ex("नेंड नाड़ी", "आज कल", "Nowadays", BOOK_SOURCE, "पृष्ठ 31"),
        ex("वसके", "जब", "When", BOOK_SOURCE, "पृष्ठ 31"),
        ex("असके", "तब", "Then", BOOK_SOURCE, "पृष्ठ 31"),
      ],
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: [
        "क्रिया-विशेषणों के प्रकार (स्थान, समय, रीति) और उनके नियम स्रोत पुष्टि के बाद जोड़े जाएंगे।",
      ],
    },
  ],
};
