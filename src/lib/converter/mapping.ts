/**
 * Canonical Devanagari ⇄ Masaram Gondi code-point mapping.
 *
 * SINGLE SOURCE OF TRUTH for the 1:1 character map, shared by the
 * Converter UI and any future tooling.
 *
 * Source: converter project `converter/mapping.json` v1.1
 * (repo aimanage750/masaram-gondi) — identical to the table used by
 * the dictionary engine in src/lib/mapping/masaram.ts (verified 2026-08).
 *
 * Unicode block: U+11D00–U+11D5F (Masaram Gondi, 75 characters).
 */

/** Devanagari code point → Masaram Gondi code point (1:1). */
export const DEVA_TO_MASARAM: Record<number, number> = {
  // Independent vowels (swar)
  0x0905: 0x11d00, // अ
  0x0906: 0x11d01, // आ
  0x0907: 0x11d02, // इ
  0x0908: 0x11d03, // ई
  0x0909: 0x11d04, // उ
  0x090a: 0x11d05, // ऊ
  0x090f: 0x11d06, // ए
  0x0910: 0x11d08, // ऐ
  0x0913: 0x11d09, // ओ
  0x0914: 0x11d0b, // औ
  // Short / candra independents (approximations)
  0x090e: 0x11d06, // ऎ → ए
  0x0912: 0x11d09, // ऒ → ओ
  0x090d: 0x11d06, // ऍ → ए
  // Consonants (vyanjan)
  0x0915: 0x11d0c, // क
  0x0916: 0x11d0d, // ख
  0x0917: 0x11d0e, // ग
  0x0918: 0x11d0f, // घ
  0x0919: 0x11d10, // ङ
  0x091a: 0x11d11, // च
  0x091b: 0x11d12, // छ
  0x091c: 0x11d13, // ज
  0x091d: 0x11d14, // झ
  0x091e: 0x11d15, // ञ
  0x091f: 0x11d16, // ट
  0x0920: 0x11d17, // ठ
  0x0921: 0x11d18, // ड
  0x0922: 0x11d19, // ढ
  0x0923: 0x11d1a, // ण
  0x0924: 0x11d1b, // त
  0x0925: 0x11d1c, // थ
  0x0926: 0x11d1d, // द
  0x0927: 0x11d1e, // ध
  0x0928: 0x11d1f, // न
  0x0929: 0x11d1f, // ऩ → न
  0x092a: 0x11d20, // प
  0x092b: 0x11d21, // फ
  0x092c: 0x11d22, // ब
  0x092d: 0x11d23, // भ
  0x092e: 0x11d24, // म
  0x092f: 0x11d25, // य
  0x0930: 0x11d26, // र
  0x0931: 0x11d26, // ऱ → र
  0x0932: 0x11d27, // ल
  0x0933: 0x11d2d, // ळ
  0x0934: 0x11d2d, // ऴ → ळ
  0x0935: 0x11d28, // व
  0x0936: 0x11d29, // श
  0x0937: 0x11d2a, // ष
  0x0938: 0x11d2b, // स
  0x0939: 0x11d2c, // ह
  // Dependent vowel signs (matra)
  0x093e: 0x11d31, // ा
  0x093f: 0x11d32, // ि
  0x0940: 0x11d33, // ी
  0x0941: 0x11d34, // ु
  0x0942: 0x11d35, // ू
  0x0943: 0x11d36, // ृ
  0x0946: 0x11d3a, // ॆ → े
  0x0947: 0x11d3a, // े
  0x0948: 0x11d3c, // ै
  0x094a: 0x11d3d, // ॊ → ो
  0x094b: 0x11d3d, // ो
  0x094c: 0x11d3f, // ौ
  // Signs
  0x0901: 0x11d40, // ँ candrabindu → anusvara (approx)
  0x0902: 0x11d40, // ं anusvara
  0x0903: 0x11d41, // ः visarga
  0x093c: 0x11d42, // ़ nukta
  0x0945: 0x11d43, // ॅ candra e
  0x0949: 0x11d43, // ॉ candra o
  0x094d: 0x11d45, // ् virama
  // Digits
  0x0966: 0x11d50, // ०
  0x0967: 0x11d51, // १
  0x0968: 0x11d52, // २
  0x0969: 0x11d53, // ३
  0x096a: 0x11d54, // ४
  0x096b: 0x11d55, // ५
  0x096c: 0x11d56, // ६
  0x096d: 0x11d57, // ७
  0x096e: 0x11d58, // ८
  0x096f: 0x11d59, // ९
};

/**
 * Masaram Gondi → Devanagari (best-effort inverse).
 * First-wins: aliases (ऩ ऱ ऴ ऎ ॊ) never override the canonical letter.
 */
export const MASARAM_TO_DEVA: Record<number, number> = (() => {
  const rev: Record<number, number> = {};
  for (const [src, dst] of Object.entries(DEVA_TO_MASARAM)) {
    const s = Number(src);
    if (rev[dst] === undefined) rev[dst] = s;
  }
  // Canonical preferences for many-to-one targets
  Object.assign(rev, {
    0x11d06: 0x090f, // ए
    0x11d09: 0x0913, // ओ
    0x11d1f: 0x0928, // न
    0x11d26: 0x0930, // र
    0x11d2d: 0x0933, // ळ
    0x11d3a: 0x0947, // े
    0x11d3d: 0x094b, // ो
    0x11d40: 0x0902, // ं
    0x11d44: 0x094d, // halanta → ्
    0x11d45: 0x094d, // virama → ्
  });
  return rev;
})();

/** Masaram Gondi special code points. */
export const SPECIAL = {
  virama: 0x11d45, // conjunct former (युक्त)
  halanta: 0x11d44, // kills inherent vowel (हलं)
  repha: 0x11d46, // cluster-initial RA (र्)
  rakara: 0x11d47, // cluster-final RA (्र)
  nukta: 0x11d42,
  candra: 0x11d43,
} as const;

/** Precomposed conjunct letters used by Masaram Gondi. */
export const CONJUNCT = {
  kssa: 0x11d2e, // क्ष
  jnya: 0x11d2f, // ज्ञ
  tra: 0x11d30, // त्र
} as const;

/**
 * Multi-codepoint sequences used by the converter engine
 * (kept exactly as in the original converter project).
 */
export const SEQUENCES = {
  /** Precomposed Devanagari nukta letters → base + nukta in Gondi. */
  nukta: {
    "\u0958": "\u{11D0C}\u{11D42}", // क़
    "\u0959": "\u{11D0D}\u{11D42}", // ख़
    "\u095a": "\u{11D0E}\u{11D42}", // ग़
    "\u095b": "\u{11D13}\u{11D42}", // ज़
    "\u095c": "\u{11D18}\u{11D42}", // ड़
    "\u095d": "\u{11D19}\u{11D42}", // ढ़
    "\u095e": "\u{11D21}\u{11D42}", // फ़
    "\u095f": "\u{11D25}\u{11D42}", // य़
  },
  /** Dedicated conjunct letters. */
  conjunct: {
    "\u0915\u094D\u0937": "\u{11D2E}", // क्ष
    "\u091c\u094d\u091e": "\u{11D2F}", // ज्ञ
    "\u0924\u094d\u0930": "\u{11D30}", // त्र
  },
  /** Vocalic R / candra vowels. */
  vocalic: {
    "\u090b": "\u{11D26}\u{11D36}", // ऋ → र + ृ-sign
    "\u0960": "\u{11D26}\u{11D36}", // ॠ
    "\u0944": "\u{11D36}", // ॄ
    "\u0911": "\u{11D09}\u{11D43}", // ऑ → ओ + candra
  },
} as const;

export const MASARAM_RANGE = { start: 0x11d00, end: 0x11d5f } as const;

export function isMasaramCodePoint(cp: number): boolean {
  return cp >= MASARAM_RANGE.start && cp <= MASARAM_RANGE.end;
}
