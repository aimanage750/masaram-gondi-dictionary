/**
 * Grammar data model.
 *
 * NO-FABRICATION POLICY: only Gondi words that exist in a real source
 * (the गोंडी करीयाट book via src/data/raw-entries.ts, or the Hindi–Gondi
 * everyday dictionary from the converter repo) may appear as examples.
 * Everything else must carry `pending: true` until a source confirms it.
 */
import { devanagariToMasaram } from "@/lib/mapping/masaram";

export type Script = "gondi" | "deva" | "en";

export interface Cell {
  text: string;
  script?: Script; // defaults to "deva"
}

export interface GrammarTable {
  caption?: string;
  columns: string[];
  rows: Cell[][];
}

export interface GrammarExample {
  /** Devanagari pronunciation as printed in the source. */
  gondi_pronunciation: string;
  /** Masaram Gondi Unicode — derived with the dictionary engine. */
  gondi_script: string;
  hindi: string;
  english?: string;
  /** Where this word comes from. Required for every example. */
  source: string;
  note?: string;
}

export interface GrammarTerm {
  label: string; // e.g. "English", "हिन्दी", "मसराम गोंडी"
  value: string;
  script?: Script;
  pending?: boolean;
}

export interface GrammarSection {
  id: string;
  heading: string;
  heading_en?: string;
  paragraphs?: string[];
  /** Linguistic terminology (Hindi / Gondi / English). */
  terms?: GrammarTerm[];
  table?: GrammarTable;
  examples?: GrammarExample[];
  rules?: string[];
  note?: string;
  /** Whole section awaits source material. */
  pending?: boolean;
}

export interface GrammarLesson {
  slug: string;
  name_hi: string;
  name_en: string;
  /** A single Masaram Gondi glyph used as the card icon. */
  glyph: string;
  summary: string;
  sections: GrammarSection[];
}

/** Book source label used in citations. */
export const BOOK_SOURCE = "गोंडी करीयाट (गोंडी सिखाएं)";
/** Converter-repo dictionary label used in citations. */
export const EVERYDAY_DICT_SOURCE = "Hindi–Gondi everyday dictionary v1.0";

/** Build an example from sourced book data (script auto-derived). */
export function ex(
  gondi_pronunciation: string,
  hindi: string,
  english: string,
  source: string,
  note?: string
): GrammarExample {
  return {
    gondi_pronunciation,
    gondi_script: devanagariToMasaram(gondi_pronunciation),
    hindi,
    english,
    source,
    note,
  };
}

/** Table cell whose Masaram Gondi text is derived from Devanagari by the dictionary engine. */
export function gCell(devanagari: string): Cell {
  return { text: devanagariToMasaram(devanagari), script: "gondi" };
}

/** Standard policy note rendered on every lesson. */
export const POLICY_NOTE =
  "गोंडी व्याकरण के नियम अनुमान से नहीं लिखे जाते। जो सामग्री स्रोत (पुस्तक / शब्दकोश) में उपलब्ध नहीं है, वह \u201cस्रोत की पुष्टि बाकी\u201d के रूप में दिखती है।";
