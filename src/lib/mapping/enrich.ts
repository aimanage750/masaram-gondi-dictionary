import type {
  DictionaryEntry,
  GondiSentence,
  PublicEntry,
  PublicSentence,
  RawSourceEntry,
} from "@/lib/types";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { romanizeDevanagari, toTitleRoman } from "@/lib/mapping/romanize";

/** Stable short id. तल्ला/सिर is pinned to the spec example 59b2mn. */
export function makeId(gondi: string, hindi: string): string {
  if (gondi === "तल्ला" && hindi === "सिर") return "59b2mn";
  const s = `${gondi}::${hindi}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = (h >>> 0).toString(36).padStart(6, "0");
  return n.slice(0, 6);
}

export function enrichRaw(
  raw: RawSourceEntry,
  extras?: Partial<DictionaryEntry>
): DictionaryEntry {
  const now = extras?.created_at ?? new Date().toISOString();
  return {
    id: extras?.id ?? makeId(raw.gondi_pronunciation, raw.hindi),
    gondi_script: extras?.gondi_script ?? devanagariToMasaram(raw.gondi_pronunciation),
    gondi_pronunciation: raw.gondi_pronunciation,
    roman_gondi: extras?.roman_gondi ?? toTitleRoman(raw.gondi_pronunciation),
    roman_hindi: extras?.roman_hindi ?? romanizeDevanagari(raw.hindi),
    hindi: raw.hindi,
    english: raw.english,
    gondi_normalized: extras?.gondi_normalized ?? null,
    category: raw.category,
    category_hi: raw.category_hi,
    notes: raw.notes ?? extras?.notes ?? null,
    source: extras?.source ?? "गोंडी करीयाट (गोंडी सिखाएं) — uploaded primary source",
    source_page: raw.source_page,
    verified: extras?.verified ?? true,
    status: extras?.status ?? "published",
    audio_path: extras?.audio_path ?? null,
    created_at: now,
    updated_at: extras?.updated_at ?? now,
    created_by: extras?.created_by ?? "seed",
  };
}

export function enrichSentence(
  input: { gondi_pronunciation: string; hindi: string; english: string; source_page?: string; source?: string },
  extras?: Partial<GondiSentence>
): GondiSentence {
  const now = extras?.created_at ?? new Date().toISOString();
  return {
    id: extras?.id ?? makeId(input.gondi_pronunciation, input.hindi + "::vakya"),
    gondi_script: extras?.gondi_script ?? devanagariToMasaram(input.gondi_pronunciation),
    gondi_pronunciation: input.gondi_pronunciation,
    roman_gondi: extras?.roman_gondi ?? toTitleRoman(input.gondi_pronunciation),
    roman_hindi: extras?.roman_hindi ?? romanizeDevanagari(input.hindi),
    hindi: input.hindi,
    english: input.english,
    source: extras?.source ?? input.source ?? "admin — book sentence",
    source_page: input.source_page ?? extras?.source_page ?? null,
    verified: extras?.verified ?? true,
    status: extras?.status ?? "published",
    created_at: now,
    updated_at: extras?.updated_at ?? now,
    created_by: extras?.created_by ?? "admin",
  };
}

export function toPublicSentence(s: GondiSentence): PublicSentence {
  return {
    id: s.id,
    gondi_script: s.gondi_script,
    gondi_pronunciation: s.gondi_pronunciation,
    hindi: s.hindi,
    english: s.english,
  };
}

export function toPublic(entry: DictionaryEntry, audioUrl?: string | null): PublicEntry {
  return {
    id: entry.id,
    gondi_script: entry.gondi_script,
    gondi_pronunciation: entry.gondi_pronunciation,
    hindi: entry.hindi,
    english: entry.english,
    category: entry.category,
    category_hi: entry.category_hi,
    audio_url: audioUrl ?? null,
  };
}
