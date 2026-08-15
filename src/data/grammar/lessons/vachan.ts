import { type GrammarLesson } from "../types";

export const VACHAN: GrammarLesson = {
  slug: "vachan",
  name_hi: "वचन",
  name_en: "Number",
  glyph: "𑵐",
  summary: "एकवचन और बहुवचन की जानकारी। स्रोत पुष्टि बाकी।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "वचन (Number) से पता चलता है कि शब्द एक वस्तु के लिए है (एकवचन) या अनेक के लिए (बहुवचन)।",
      ],
      terms: [
        { label: "English", value: "Number", script: "en" },
        { label: "हिन्दी", value: "वचन" },
        { label: "एकवचन", value: "Singular", script: "en" },
        { label: "बहुवचन", value: "Plural", script: "en" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण",
      heading_en: "Examples",
      pending: true,
      paragraphs: [
        "एकवचन / बहुवचन के स्रोत-प्रमाणित उदाहरण उपलब्ध होते ही जोड़े जाएंगे।",
      ],
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: ["बहुवचन बनाने के नियम स्रोत पुष्टि के बाद जोड़े जाएंगे।"],
    },
  ],
};
