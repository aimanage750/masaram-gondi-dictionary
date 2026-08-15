import { type GrammarLesson } from "../types";

export const KARAK: GrammarLesson = {
  slug: "karak",
  name_hi: "कारक",
  name_en: "Case",
  glyph: "𑴫",
  summary: "संज्ञा/सर्वनाम और क्रिया के संबंध (कर्ता, कर्म आदि)। स्रोत पुष्टि बाकी।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "कारक (Case) संज्ञा या सर्वनाम का क्रिया के साथ संबंध बताता है — जैसे कर्ता (काम करने वाला), कर्म (काम का फल), करण, सम्प्रदान, अपादान, अधिकरण।",
      ],
      terms: [
        { label: "English", value: "Case", script: "en" },
        { label: "हिन्दी", value: "कारक" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण",
      heading_en: "Examples",
      pending: true,
      paragraphs: ["कारक-चिह्नों के स्रोत-प्रमाणित उदाहरण उपलब्ध होते ही जोड़े जाएंगे।"],
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: ["कारक-चिह्न और विभक्ति के नियम स्रोत पुष्टि के बाद जोड़े जाएंगे।"],
    },
  ],
};
