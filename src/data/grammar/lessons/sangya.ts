import {
  BOOK_SOURCE,
  ex,
  type GrammarLesson,
} from "../types";

export const SANGYA: GrammarLesson = {
  slug: "sangya",
  name_hi: "संज्ञा",
  name_en: "Noun",
  glyph: "𑴛",
  summary:
    "व्यक्ति, वस्तु, स्थान या भाव के नाम को संज्ञा कहते हैं। पुस्तक-स्रोत से उदाहरण सहित।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "संज्ञा (Noun) वह शब्द है जो किसी व्यक्ति, वस्तु, स्थान, जीव या भाव का नाम बताता है — जैसे सिर, कान, बच्चा, नाक।",
      ],
      terms: [
        { label: "English", value: "Noun", script: "en" },
        { label: "हिन्दी", value: "संज्ञा" },
        {
          label: "मसराम गोंडी पद",
          value: "स्रोत में उपलब्ध नहीं",
          pending: true,
        },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण",
      heading_en: "Examples",
      paragraphs: [
        "नीचे दिए गए सभी शब्द अपलोड की गई पुस्तक के तक्ता-उंदी (Parts of Body) और मनुष्य की अवस्थाएँ अध्यायों से लिए गए हैं।",
      ],
      examples: [
        ex("तल्ला", "सिर", "Head", BOOK_SOURCE, "पृष्ठ 1"),
        ex("कवी", "कान", "Ear", BOOK_SOURCE, "पृष्ठ 1"),
        ex("मोस्सोर", "नाक", "Nose", BOOK_SOURCE, "पृष्ठ 1"),
        ex("छव्वा", "बच्चा", "Child", BOOK_SOURCE, "पृष्ठ 3"),
      ],
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: [
        "संज्ञा के रूप, बहुवचन चिह्न और कारक-परिवर्तन के नियम स्रोत सामग्री से पुष्टि के बाद जोड़े जाएंगे।",
      ],
    },
  ],
};
