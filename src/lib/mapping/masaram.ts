/**
 * Devanagari → Masaram Gondi Unicode mapper.
 *
 * Block: U+11D00–U+11D5F (Unicode 10.0+).
 * Conjuncts use VIRAMA (U+11D45). Word-final vowel killing uses HALANTA (U+11D44).
 * Cluster-initial RA uses REPHA (U+11D46). Cluster-final RA uses RA-KARA (U+11D47).
 * Dedicated conjunct letters are used for KSSA, JNYA, TRA.
 *
 * This is a true code-point conversion, not a font swap.
 */

const IND_VOWEL: Record<string, string> = {
  अ: "\u{11D00}",
  आ: "\u{11D01}",
  इ: "\u{11D02}",
  ई: "\u{11D03}",
  उ: "\u{11D04}",
  ऊ: "\u{11D05}",
  ऋ: "\u{11D00}\u{11D36}",
  ऌ: "\u{11D00}\u{11D36}",
  ए: "\u{11D06}",
  ऐ: "\u{11D08}",
  ओ: "\u{11D09}",
  औ: "\u{11D0B}",
  ॲ: "\u{11D06}\u{11D43}",
  ऑ: "\u{11D09}\u{11D43}",
};

const CONSONANT: Record<string, string> = {
  क: "\u{11D0C}",
  ख: "\u{11D0D}",
  ग: "\u{11D0E}",
  घ: "\u{11D0F}",
  ङ: "\u{11D10}",
  च: "\u{11D11}",
  छ: "\u{11D12}",
  ज: "\u{11D13}",
  झ: "\u{11D14}",
  ञ: "\u{11D15}",
  ट: "\u{11D16}",
  ठ: "\u{11D17}",
  ड: "\u{11D18}",
  ढ: "\u{11D19}",
  ण: "\u{11D1A}",
  त: "\u{11D1B}",
  थ: "\u{11D1C}",
  द: "\u{11D1D}",
  ध: "\u{11D1E}",
  न: "\u{11D1F}",
  प: "\u{11D20}",
  फ: "\u{11D21}",
  ब: "\u{11D22}",
  भ: "\u{11D23}",
  म: "\u{11D24}",
  य: "\u{11D25}",
  र: "\u{11D26}",
  ल: "\u{11D27}",
  व: "\u{11D28}",
  श: "\u{11D29}",
  ष: "\u{11D2A}",
  स: "\u{11D2B}",
  ह: "\u{11D2C}",
  ळ: "\u{11D2D}",
  क़: "\u{11D0C}\u{11D42}",
  ख़: "\u{11D0D}\u{11D42}",
  ग़: "\u{11D0E}\u{11D42}",
  ज़: "\u{11D13}\u{11D42}",
  ड़: "\u{11D18}\u{11D42}",
  ढ़: "\u{11D19}\u{11D42}",
  फ़: "\u{11D21}\u{11D42}",
  य़: "\u{11D25}\u{11D42}",
};

const VOWEL_SIGN: Record<string, string> = {
  "ा": "\u{11D31}",
  "ि": "\u{11D32}",
  "ी": "\u{11D33}",
  "ु": "\u{11D34}",
  "ू": "\u{11D35}",
  "ृ": "\u{11D36}",
  "ॄ": "\u{11D36}",
  "े": "\u{11D3A}",
  "ै": "\u{11D3C}",
  "ो": "\u{11D3D}",
  "ौ": "\u{11D3F}",
  "ॅ": "\u{11D43}",
  "ॉ": "\u{11D3D}\u{11D43}",
  "ॆ": "\u{11D3A}",
  "ॊ": "\u{11D3D}",
};

const SIGN: Record<string, string> = {
  "ं": "\u{11D40}",
  "ः": "\u{11D41}",
  "ँ": "\u{11D40}",
  "़": "\u{11D42}",
  "्": "\u{11D45}",
};

const DIGIT: Record<string, string> = {
  "०": "\u{11D50}",
  "१": "\u{11D51}",
  "२": "\u{11D52}",
  "३": "\u{11D53}",
  "४": "\u{11D54}",
  "५": "\u{11D55}",
  "६": "\u{11D56}",
  "७": "\u{11D57}",
  "८": "\u{11D58}",
  "९": "\u{11D59}",
  "0": "\u{11D50}",
  "1": "\u{11D51}",
  "2": "\u{11D52}",
  "3": "\u{11D53}",
  "4": "\u{11D54}",
  "5": "\u{11D55}",
  "6": "\u{11D56}",
  "7": "\u{11D57}",
  "8": "\u{11D58}",
  "9": "\u{11D59}",
};

const VIRAMA_DEV = "्";
const NUKTA_DEV = "़";
const MASARAM_VIRAMA = "\u{11D45}";
const MASARAM_HALANTA = "\u{11D44}";
const MASARAM_REPHA = "\u{11D46}";
const MASARAM_RAKARA = "\u{11D47}";
const MASARAM_NUKTA = "\u{11D42}";

const KSSA = "\u{11D2E}";
const JNYA = "\u{11D2F}";
const TRA = "\u{11D30}";

const PASSTHROUGH = new Set([
  " ",
  "\u00A0",
  "-",
  "–",
  "—",
  "/",
  "(",
  ")",
  ",",
  ".",
  "·",
  ":",
  ";",
  "'",
  "’",
  '"',
  "?",
  "!",
  "+",
  "&",
]);

export const MASARAM_RANGE = { start: 0x11d00, end: 0x11d5f };

export function isMasaramGondi(text: string): boolean {
  return [...text].some((ch) => {
    const cp = ch.codePointAt(0) ?? 0;
    return cp >= MASARAM_RANGE.start && cp <= MASARAM_RANGE.end;
  });
}

export function missingMasaramGlyphs(text: string): string[] {
  const missing: string[] = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= MASARAM_RANGE.start && cp <= MASARAM_RANGE.end) {
      if (
        cp === 0x11d07 ||
        cp === 0x11d0a ||
        (cp >= 0x11d37 && cp <= 0x11d39) ||
        cp === 0x11d3b ||
        cp === 0x11d3e ||
        (cp >= 0x11d48 && cp <= 0x11d4f) ||
        (cp >= 0x11d5a && cp <= 0x11d5f)
      ) {
        missing.push(`U+${cp.toString(16).toUpperCase()}`);
      }
    }
  }
  return missing;
}

function dedicatedConjunct(a: string, b: string): string | null {
  if (a === "क" && b === "ष") return KSSA;
  if (a === "ज" && b === "ञ") return JNYA;
  if (a === "त" && b === "र") return TRA;
  return null;
}

/**
 * Convert a Devanagari Gondi pronunciation string into Masaram Gondi Unicode.
 * Original Devanagari is never mutated — this only produces gondi_script.
 */
export function devanagariToMasaram(input: string): string {
  if (!input) return "";
  const s = input.normalize("NFC").replace(/[\u200C\u200D]/g, "");
  const chars = [...s];
  let out = "";
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    if (PASSTHROUGH.has(ch) || /[A-Za-z]/.test(ch)) {
      out += ch;
      i += 1;
      continue;
    }

    if (DIGIT[ch]) {
      out += DIGIT[ch];
      i += 1;
      continue;
    }

    if (IND_VOWEL[ch]) {
      out += IND_VOWEL[ch];
      i += 1;
      continue;
    }

    if (SIGN[ch] && ch !== VIRAMA_DEV && ch !== NUKTA_DEV) {
      out += SIGN[ch];
      i += 1;
      continue;
    }

    if (VOWEL_SIGN[ch]) {
      out += VOWEL_SIGN[ch];
      i += 1;
      continue;
    }

    if (ch === "।" || ch === "॥") {
      out += ch;
      i += 1;
      continue;
    }

    if (!CONSONANT[ch]) {
      out += ch;
      i += 1;
      continue;
    }

    // Consonant cluster
    const base = ch;
    i += 1;
    let nukta = false;
    if (chars[i] === NUKTA_DEV) {
      nukta = true;
      i += 1;
    }

    // Repha: र + ् + C  →  REPHA + C
    if (base === "र" && chars[i] === VIRAMA_DEV && chars[i + 1] && CONSONANT[chars[i + 1]]) {
      i += 1; // skip virama
      const nextC = chars[i];
      i += 1;
      let nextNukta = false;
      if (chars[i] === NUKTA_DEV) {
        nextNukta = true;
        i += 1;
      }
      out += MASARAM_REPHA + CONSONANT[nextC] + (nextNukta ? MASARAM_NUKTA : "");
      if (chars[i] && VOWEL_SIGN[chars[i]]) {
        out += VOWEL_SIGN[chars[i]];
        i += 1;
      }
      if (chars[i] && SIGN[chars[i]] && chars[i] !== VIRAMA_DEV && chars[i] !== NUKTA_DEV) {
        out += SIGN[chars[i]];
        i += 1;
      }
      continue;
    }

    // Consume virama-linked consonants
    const cluster: { c: string; nukta: boolean }[] = [{ c: base, nukta }];
    while (chars[i] === VIRAMA_DEV && chars[i + 1] && CONSONANT[chars[i + 1]]) {
      i += 1;
      const nc = chars[i];
      i += 1;
      let nn = false;
      if (chars[i] === NUKTA_DEV) {
        nn = true;
        i += 1;
      }
      cluster.push({ c: nc, nukta: nn });
    }

    const deadFinal = chars[i] === VIRAMA_DEV && !CONSONANT[chars[i + 1] ?? ""];
    if (deadFinal) i += 1;

    // Dedicated conjuncts (क्ष / ज्ञ / त्र) when they appear as a pair
    if (cluster.length === 2) {
      const special = dedicatedConjunct(cluster[0].c, cluster[1].c);
      if (special) {
        out += special;
        if (chars[i] && VOWEL_SIGN[chars[i]]) {
          out += VOWEL_SIGN[chars[i]];
          i += 1;
        }
        if (chars[i] && SIGN[chars[i]] && chars[i] !== VIRAMA_DEV && chars[i] !== NUKTA_DEV) {
          out += SIGN[chars[i]];
          i += 1;
        }
        continue;
      }
    }

    // Ra-kara: C + ् + र  (and not already handled as TRA)
    if (cluster.length >= 2 && cluster[cluster.length - 1].c === "र") {
      const head = cluster.slice(0, -1);
      for (let k = 0; k < head.length; k++) {
        out += CONSONANT[head[k].c] + (head[k].nukta ? MASARAM_NUKTA : "");
        if (k < head.length - 1) out += MASARAM_VIRAMA;
      }
      out += MASARAM_RAKARA;
    } else {
      for (let k = 0; k < cluster.length; k++) {
        out += CONSONANT[cluster[k].c] + (cluster[k].nukta ? MASARAM_NUKTA : "");
        if (k < cluster.length - 1) out += MASARAM_VIRAMA;
      }
      if (deadFinal) out += MASARAM_HALANTA;
    }

    if (chars[i] && VOWEL_SIGN[chars[i]]) {
      out += VOWEL_SIGN[chars[i]];
      i += 1;
    }
    if (chars[i] && SIGN[chars[i]] && chars[i] !== VIRAMA_DEV && chars[i] !== NUKTA_DEV) {
      out += SIGN[chars[i]];
      i += 1;
    }
  }

  return out;
}

export const KEYBOARD_LAYOUT = {
  vowels: [
    { label: "𑴀", value: "\u{11D00}", hint: "अ" },
    { label: "𑴁", value: "\u{11D01}", hint: "आ" },
    { label: "𑴂", value: "\u{11D02}", hint: "इ" },
    { label: "𑴃", value: "\u{11D03}", hint: "ई" },
    { label: "𑴄", value: "\u{11D04}", hint: "उ" },
    { label: "𑴅", value: "\u{11D05}", hint: "ऊ" },
    { label: "𑴆", value: "\u{11D06}", hint: "ए" },
    { label: "𑴈", value: "\u{11D08}", hint: "ऐ" },
    { label: "𑴉", value: "\u{11D09}", hint: "ओ" },
    { label: "𑴋", value: "\u{11D0B}", hint: "औ" },
  ],
  consonants: [
    { label: "𑴌", value: "\u{11D0C}", hint: "क" },
    { label: "𑴍", value: "\u{11D0D}", hint: "ख" },
    { label: "𑴎", value: "\u{11D0E}", hint: "ग" },
    { label: "𑴏", value: "\u{11D0F}", hint: "घ" },
    { label: "𑴐", value: "\u{11D10}", hint: "ङ" },
    { label: "𑴑", value: "\u{11D11}", hint: "च" },
    { label: "𑴒", value: "\u{11D12}", hint: "छ" },
    { label: "𑴓", value: "\u{11D13}", hint: "ज" },
    { label: "𑴔", value: "\u{11D14}", hint: "झ" },
    { label: "𑴕", value: "\u{11D15}", hint: "ञ" },
    { label: "𑴖", value: "\u{11D16}", hint: "ट" },
    { label: "𑴗", value: "\u{11D17}", hint: "ठ" },
    { label: "𑴘", value: "\u{11D18}", hint: "ड" },
    { label: "𑴙", value: "\u{11D19}", hint: "ढ" },
    { label: "𑴚", value: "\u{11D1A}", hint: "ण" },
    { label: "𑴛", value: "\u{11D1B}", hint: "त" },
    { label: "𑴜", value: "\u{11D1C}", hint: "थ" },
    { label: "𑴝", value: "\u{11D1D}", hint: "द" },
    { label: "𑴞", value: "\u{11D1E}", hint: "ध" },
    { label: "𑴟", value: "\u{11D1F}", hint: "न" },
    { label: "𑴠", value: "\u{11D20}", hint: "प" },
    { label: "𑴡", value: "\u{11D21}", hint: "फ" },
    { label: "𑴢", value: "\u{11D22}", hint: "ब" },
    { label: "𑴣", value: "\u{11D23}", hint: "भ" },
    { label: "𑴤", value: "\u{11D24}", hint: "म" },
    { label: "𑴥", value: "\u{11D25}", hint: "य" },
    { label: "𑴦", value: "\u{11D26}", hint: "र" },
    { label: "𑴧", value: "\u{11D27}", hint: "ल" },
    { label: "𑴨", value: "\u{11D28}", hint: "व" },
    { label: "𑴩", value: "\u{11D29}", hint: "श" },
    { label: "𑴪", value: "\u{11D2A}", hint: "ष" },
    { label: "𑴫", value: "\u{11D2B}", hint: "स" },
    { label: "𑴬", value: "\u{11D2C}", hint: "ह" },
    { label: "𑴭", value: "\u{11D2D}", hint: "ळ" },
    { label: "𑴮", value: "\u{11D2E}", hint: "क्ष" },
    { label: "𑴯", value: "\u{11D2F}", hint: "ज्ञ" },
    { label: "𑴰", value: "\u{11D30}", hint: "त्र" },
  ],
  signs: [
    { label: "◌𑴱", value: "\u{11D31}", hint: "ा" },
    { label: "◌𑴲", value: "\u{11D32}", hint: "ि" },
    { label: "◌𑴳", value: "\u{11D33}", hint: "ी" },
    { label: "◌𑴴", value: "\u{11D34}", hint: "ु" },
    { label: "◌𑴵", value: "\u{11D35}", hint: "ू" },
    { label: "◌𑴶", value: "\u{11D36}", hint: "ृ" },
    { label: "◌𑴺", value: "\u{11D3A}", hint: "े" },
    { label: "◌𑴼", value: "\u{11D3C}", hint: "ै" },
    { label: "◌𑴽", value: "\u{11D3D}", hint: "ो" },
    { label: "◌𑴿", value: "\u{11D3F}", hint: "ौ" },
    { label: "◌𑵀", value: "\u{11D40}", hint: "ं" },
    { label: "◌𑵁", value: "\u{11D41}", hint: "ः" },
    { label: "◌𑵂", value: "\u{11D42}", hint: "़" },
    { label: "◌𑵃", value: "\u{11D43}", hint: "ॅ" },
    { label: "◌𑵄", value: "\u{11D44}", hint: "halanta" },
    { label: "◌𑵅", value: "\u{11D45}", hint: "् virama" },
    { label: "𑵆", value: "\u{11D46}", hint: "repha" },
    { label: "◌𑵇", value: "\u{11D47}", hint: "ra-kara" },
  ],
  digits: [
    { label: "𑵐", value: "\u{11D50}", hint: "0" },
    { label: "𑵑", value: "\u{11D51}", hint: "1" },
    { label: "𑵒", value: "\u{11D52}", hint: "2" },
    { label: "𑵓", value: "\u{11D53}", hint: "3" },
    { label: "𑵔", value: "\u{11D54}", hint: "4" },
    { label: "𑵕", value: "\u{11D55}", hint: "5" },
    { label: "𑵖", value: "\u{11D56}", hint: "6" },
    { label: "𑵗", value: "\u{11D57}", hint: "7" },
    { label: "𑵘", value: "\u{11D58}", hint: "8" },
    { label: "𑵙", value: "\u{11D59}", hint: "9" },
  ],
};

export const DEVANAGARI_KEYBOARD = {
  vowels: [
    { label: "अ", value: "अ" },
    { label: "आ", value: "आ" },
    { label: "इ", value: "इ" },
    { label: "ई", value: "ई" },
    { label: "उ", value: "उ" },
    { label: "ऊ", value: "ऊ" },
    { label: "ए", value: "ए" },
    { label: "ऐ", value: "ऐ" },
    { label: "ओ", value: "ओ" },
    { label: "औ", value: "औ" },
  ],
  consonants: [
    { label: "क", value: "क" },
    { label: "ख", value: "ख" },
    { label: "ग", value: "ग" },
    { label: "घ", value: "घ" },
    { label: "ङ", value: "ङ" },
    { label: "च", value: "च" },
    { label: "छ", value: "छ" },
    { label: "ज", value: "ज" },
    { label: "झ", value: "झ" },
    { label: "ञ", value: "ञ" },
    { label: "ट", value: "ट" },
    { label: "ठ", value: "ठ" },
    { label: "ड", value: "ड" },
    { label: "ढ", value: "ढ" },
    { label: "ण", value: "ण" },
    { label: "त", value: "त" },
    { label: "थ", value: "थ" },
    { label: "द", value: "द" },
    { label: "ध", value: "ध" },
    { label: "न", value: "न" },
    { label: "प", value: "प" },
    { label: "फ", value: "फ" },
    { label: "ब", value: "ब" },
    { label: "भ", value: "भ" },
    { label: "म", value: "म" },
    { label: "य", value: "य" },
    { label: "र", value: "र" },
    { label: "ल", value: "ल" },
    { label: "व", value: "व" },
    { label: "श", value: "श" },
    { label: "ष", value: "ष" },
    { label: "स", value: "स" },
    { label: "ह", value: "ह" },
    { label: "ळ", value: "ळ" },
    { label: "क्ष", value: "क्ष" },
    { label: "ज्ञ", value: "ज्ञ" },
    { label: "त्र", value: "त्र" },
  ],
  signs: [
    { label: "ा", value: "ा" },
    { label: "ि", value: "ि" },
    { label: "ी", value: "ी" },
    { label: "ु", value: "ु" },
    { label: "ू", value: "ू" },
    { label: "ृ", value: "ृ" },
    { label: "े", value: "े" },
    { label: "ै", value: "ै" },
    { label: "ो", value: "ो" },
    { label: "ौ", value: "ौ" },
    { label: "ं", value: "ं" },
    { label: "ः", value: "ः" },
    { label: "ँ", value: "ँ" },
    { label: "्", value: "्" },
    { label: "़", value: "़" },
  ],
};
