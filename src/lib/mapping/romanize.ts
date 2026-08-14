/**
 * Internal romanization for search / matching only.
 * Never shown in the public 4-field result.
 *
 * Scheme matches the project example: तल्ला → Talla
 * (simplified Hindi romanization, not IAST).
 */

const IND: Record<string, string> = {
  अ: "a",
  आ: "aa",
  इ: "i",
  ई: "i",
  उ: "u",
  ऊ: "u",
  ऋ: "ri",
  ऌ: "li",
  ए: "e",
  ऐ: "ai",
  ओ: "o",
  औ: "au",
  ॲ: "e",
  ऑ: "o",
};

const CONS: Record<string, string> = {
  क: "k",
  ख: "kh",
  ग: "g",
  घ: "gh",
  ङ: "n",
  च: "ch",
  छ: "chh",
  ज: "j",
  झ: "jh",
  ञ: "n",
  ट: "t",
  ठ: "th",
  ड: "d",
  ढ: "dh",
  ण: "n",
  त: "t",
  थ: "th",
  द: "d",
  ध: "dh",
  न: "n",
  प: "p",
  फ: "ph",
  ब: "b",
  भ: "bh",
  म: "m",
  य: "y",
  र: "r",
  ल: "l",
  व: "v",
  श: "sh",
  ष: "sh",
  स: "s",
  ह: "h",
  ळ: "l",
  क़: "q",
  ख़: "kh",
  ग़: "g",
  ज़: "z",
  ड़: "d",
  ढ़: "dh",
  फ़: "f",
  य़: "y",
};

const MATRA: Record<string, string> = {
  "ा": "a",
  "ि": "i",
  "ी": "i",
  "ु": "u",
  "ू": "u",
  "ृ": "ri",
  "ॄ": "ri",
  "े": "e",
  "ै": "ai",
  "ो": "o",
  "ौ": "au",
  "ॅ": "e",
  "ॉ": "o",
  "ॆ": "e",
  "ॊ": "o",
};

const VIRAMA = "्";
const NUKTA = "़";

export function romanizeDevanagari(input: string): string {
  if (!input) return "";
  const s = input.normalize("NFC").replace(/[\u200C\u200D]/g, "");
  const chars = [...s];
  let out = "";
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    if (/[\s\-–—/(),.:;'’"?+&]/.test(ch) || /[A-Za-z0-9]/.test(ch)) {
      out += ch;
      i += 1;
      continue;
    }

    if (IND[ch]) {
      out += IND[ch];
      i += 1;
      continue;
    }

    if (ch === "ं" || ch === "ँ") {
      out += "n";
      i += 1;
      continue;
    }
    if (ch === "ः") {
      out += "h";
      i += 1;
      continue;
    }

    if (!CONS[ch]) {
      i += 1;
      continue;
    }

    const base = CONS[ch];
    i += 1;
    if (chars[i] === NUKTA) i += 1;

    // conjuncts
    const pieces = [base];
    while (chars[i] === VIRAMA && chars[i + 1] && CONS[chars[i + 1]]) {
      i += 1;
      pieces.push(CONS[chars[i]]);
      i += 1;
      if (chars[i] === NUKTA) i += 1;
    }

    const dead = chars[i] === VIRAMA && !CONS[chars[i + 1] ?? ""];
    if (dead) i += 1;

    let vowel = "";
    let inherent = false;
    if (chars[i] && MATRA[chars[i]]) {
      vowel = MATRA[chars[i]];
      i += 1;
    } else if (!dead) {
      vowel = "a";
      inherent = true;
    }

    const vowelOut = inherent ? "\u0001" : vowel;

    if (chars[i] === "ं" || chars[i] === "ँ") {
      out += pieces.join("") + (vowelOut === "\u0001" ? "a" : vowelOut) + "n";
      i += 1;
      continue;
    }
    if (chars[i] === "ः") {
      out += pieces.join("") + (vowelOut === "\u0001" ? "a" : vowelOut) + "h";
      i += 1;
      continue;
    }

    out += pieces.join("") + vowelOut;
  }

  // Hindi/Gondi schwa deletion: तल्ला → Talla, सिर → sir (not sira)
  return out.replace(/\u0001(?=$|[\s\-–—/(),])|\u0001$/g, "").replace(/\u0001/g, "a").replace(/\s+/g, " ").trim();
}

export function toTitleRoman(s: string): string {
  const t = romanizeDevanagari(s);
  if (!t) return "";
  return t
    .split(/(\s+|-|\/)/)
    .map((part) => {
      if (!part || /^(\s+|-|\/)$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

export function normalizeSearch(q: string): string {
  return q
    .normalize("NFC")
    .replace(/[\u200C\u200D]/g, "")
    .trim()
    .toLocaleLowerCase("en");
}
