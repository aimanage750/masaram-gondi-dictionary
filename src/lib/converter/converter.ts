/**
 * Devanagari ⇄ Masaram Gondi converter engine.
 *
 * Faithful TypeScript port of the converter project's live logic
 * (`web/js/converter.js`, which mirrors `converter/python/
 * devanagari_to_masaram_gondi.py`) from repo aimanage750/masaram-gondi.
 *
 * Behavior preserved exactly:
 *   - NFC nukta letters (क़ ख़ …) → base + nukta
 *   - vocalic R (ऋ ॠ ॄ) and ऑ sequences
 *   - dedicated conjuncts क्ष ज्ञ त्र
 *   - smart-ra: र्+C → REPHA+C and C+्+र → C+RAKARA
 *   - 1:1 code-point map for everything else
 *   - convertReverse: Masaram Gondi → Devanagari (best effort)
 *
 * The dictionary keeps its own long-form engine in src/lib/mapping/masaram.ts
 * (it generated the existing 451 stored entries); both engines share the
 * same canonical 1:1 table via ./mapping.ts.
 */

import {
  CONJUNCT,
  DEVA_TO_MASARAM,
  MASARAM_TO_DEVA,
  SEQUENCES,
  SPECIAL,
} from "./mapping";
import { toCodePoints } from "./utils";

const { repha, rakara, halanta } = SPECIAL;

function isDevanagariConsonant(cp: number): boolean {
  return (cp >= 0x0915 && cp <= 0x0939) || (cp >= 0x0958 && cp <= 0x095f);
}

function replaceAll(text: string, table: Record<string, string>): string {
  let out = text;
  for (const [src, dst] of Object.entries(table)) {
    out = out.split(src).join(dst);
  }
  return out;
}

/**
 * Convert Devanagari (Hindi) text to Masaram Gondi Unicode.
 *
 * @param text input Devanagari text
 * @param smartRa when true (default), र्+C becomes Repha and C+्+र
 *                becomes Ra-kara, as recommended for the script.
 */
export function convert(text: string, smartRa = true): string {
  if (!text) return text;

  // 1) Multi-char sequences first (longest wins within each table)
  let s = replaceAll(text, SEQUENCES.nukta);
  s = replaceAll(s, SEQUENCES.vocalic);
  s = replaceAll(s, SEQUENCES.conjunct);

  // 2) Smart ra handling
  if (smartRa) {
    const chars = toCodePoints(s);
    const out: number[] = [];
    for (let i = 0; i < chars.length; ) {
      const ch = chars[i];
      // Repha: र + ् + consonant
      if (
        ch === 0x0930 &&
        i + 2 < chars.length &&
        chars[i + 1] === 0x094d &&
        isDevanagariConsonant(chars[i + 2])
      ) {
        out.push(repha, DEVA_TO_MASARAM[chars[i + 2]] ?? chars[i + 2]);
        i += 3;
        continue;
      }
      // Ra-kara: consonant + ् + र
      if (
        isDevanagariConsonant(ch) &&
        i + 2 < chars.length &&
        chars[i + 1] === 0x094d &&
        chars[i + 2] === 0x0930
      ) {
        out.push(DEVA_TO_MASARAM[ch] ?? ch, rakara);
        i += 3;
        continue;
      }
      out.push(ch);
      i += 1;
    }
    s = String.fromCodePoint(...out);
  }

  // 3) Remaining 1:1 mapping
  return Array.from(s)
    .map((ch) => {
      const cp = ch.codePointAt(0) ?? 0;
      return String.fromCodePoint(DEVA_TO_MASARAM[cp] ?? cp);
    })
    .join("");
}

/** Masaram Gondi → Devanagari (best-effort inverse). */
export function convertReverse(text: string): string {
  if (!text) return text;
  let s = text;
  s = s.split(String.fromCodePoint(CONJUNCT.kssa)).join("\u0915\u094D\u0937");
  s = s.split(String.fromCodePoint(CONJUNCT.jnya)).join("\u091c\u094D\u091e");
  s = s.split(String.fromCodePoint(CONJUNCT.tra)).join("\u0924\u094D\u0930");
  s = s.split(String.fromCodePoint(repha)).join("\u0930\u094d"); // र्
  s = s.split(String.fromCodePoint(rakara)).join("\u094D\u0930"); // ्र
  s = s.split(String.fromCodePoint(halanta)).join("\u094D");
  return Array.from(s)
    .map((ch) => {
      const cp = ch.codePointAt(0) ?? 0;
      return String.fromCodePoint(MASARAM_TO_DEVA[cp] ?? cp);
    })
    .join("");
}
