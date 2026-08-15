import { EVERYDAY_DICT_SOURCE, gCell, type GrammarLesson } from "../types";

/**
 * Pronoun examples sourced from the Hindi–Gondi everyday dictionary v1.0
 * (repo aimanage750/masaram-gondi, dictionary/gondi_hindi_dictionary.json).
 * That dictionary carries the disclaimer: Gondi has many dialects; these are
 * commonly cited forms, not a single official standard.
 */
export const SARVANAM: GrammarLesson = {
  slug: "sarvanam",
  name_hi: "सर्वनाम",
  name_en: "Pronoun",
  glyph: "𑴟",
  summary:
    "संज्ञा के स्थान पर आने वाले शब्द। रोज़मर्रा शब्दकोश (v1.0) से स्रोत-सहित उदाहरण।",
  sections: [
    {
      id: "paribhasha",
      heading: "परिभाषा",
      heading_en: "Definition",
      paragraphs: [
        "सर्वनाम (Pronoun) वह शब्द जो संज्ञा के स्थान पर आता है — जैसे मैं, तू, वह, यह, कौन।",
      ],
      terms: [
        { label: "English", value: "Pronoun", script: "en" },
        { label: "हिन्दी", value: "सर्वनाम" },
        { label: "मसराम गोंडी पद", value: "स्रोत में उपलब्ध नहीं", pending: true },
      ],
    },
    {
      id: "udaharan",
      heading: "उदाहरण — पुरुष-वाचक सर्वनाम",
      heading_en: "Examples",
      note: "गोंडी की अनेक बोलियाँ हैं (आदिलबाद, बस्तर, मंडला, चंद्रपुर…)। ये प्रचलित रूप हैं, एक आधिकारिक मानक नहीं।",
      table: {
        caption: "हिन्दी ↔ गोंडी सर्वनाम (स्रोत: " + EVERYDAY_DICT_SOURCE + ")",
        columns: ["हिन्दी", "English", "गोंडी (देवनागरी)", "मसराम गोंडी", "बोली / स्रोत"],
        rows: [
          [
            { text: "मैं" },
            { text: "I", script: "en" },
            { text: "नन्ना" },
            gCell("नन्न"),
            { text: "आदिलबाद / मध्य भारत" },
          ],
          [
            { text: "तू" },
            { text: "you (sg.)", script: "en" },
            { text: "निम्मा" },
            gCell("निम्म"),
            { text: "आदिलबाद" },
          ],
          [
            { text: "तुम्हारा" },
            { text: "your", script: "en" },
            { text: "निवा" },
            gCell("निव"),
            { text: "मध्य भारत" },
          ],
          [
            { text: "वह" },
            { text: "he / she / that", script: "en" },
            { text: "ऊर" },
            gCell("ऊर"),
            { text: "आदिलबाद" },
          ],
          [
            { text: "यह" },
            { text: "this", script: "en" },
            { text: "इद" },
            gCell("इद"),
            { text: "आदिलबाद" },
          ],
          [
            { text: "हम" },
            { text: "we", script: "en" },
            { text: "मामोट" },
            gCell("मामोट"),
            { text: "आदिलबाद" },
          ],
          [
            { text: "कौन" },
            { text: "who", script: "en" },
            { text: "बोर" },
            gCell("बोर"),
            { text: "मध्य भारत" },
          ],
          [
            { text: "क्या" },
            { text: "what", script: "en" },
            { text: "बारी" },
            gCell("बारी"),
            { text: "मध्य भारत" },
          ],
          [
            { text: "कहाँ" },
            { text: "where", script: "en" },
            { text: "बागा" },
            gCell("बाग"),
            { text: "मध्य भारत" },
          ],
          [
            { text: "कैसे" },
            { text: "how", script: "en" },
            { text: "बप्पोर" },
            gCell("बप्पोर"),
            { text: "मध्य भारत" },
          ],
        ],
      },
    },
    {
      id: "niyam",
      heading: "नियम",
      heading_en: "Rules",
      pending: true,
      paragraphs: [
        "सर्वनामों के रूप-परिवर्तन (कारक, वचन, सम्मान-स्तर) के नियम स्रोत पुष्टि के बाद जोड़े जाएंगे।",
      ],
    },
  ],
};
