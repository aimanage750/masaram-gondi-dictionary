/**
 * Golden tests for the migrated converter engine.
 * Cases copied from converter/python/devanagari_to_masaram_gondi.py
 * (repo aimanage750/masaram-gondi) — the original source of truth.
 *
 * Run: npx tsx scripts/test-converter.ts
 */
import { convert, convertReverse } from "../src/lib/converter/converter";
import { devanagariToMasaram } from "../src/lib/mapping/masaram";
import { DEVA_TO_MASARAM } from "../src/lib/converter/mapping";

let failed = 0;

function check(name: string, got: string, expected: string) {
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`  ${ok ? "OK " : "FAIL"}  ${name}  →  ${got}${ok ? "" : `   expected ${expected}`}`);
}

console.log("=== Golden tests (1:1 + conjuncts) — from original python suite ===");
const GOLDEN: Record<string, string> = {
  "मसराम": "𑴤𑴫𑴦𑴱𑴤",
  "गोंडी": "𑴎𑴽𑵀𑴘𑴳",
  "नमस्ते": "𑴟𑴤𑴫𑵅𑴛𑴺",
  "भारत": "𑴣𑴱𑴦𑴛",
  "हिन्दी": "𑴬𑴲𑴟𑵅𑴝𑴳",
  "जय हिन्द": "𑴓𑴥 𑴬𑴲𑴟𑵅𑴝",
  "क्षेत्र": "𑴮𑴺𑴰",
};
for (const [src, exp] of Object.entries(GOLDEN)) check(src, convert(src), exp);

console.log("\n=== Smart ra (README demo) ===");
check("कर्म (Repha)", convert("कर्म"), "𑴌𑵆𑴤");
check("क्रम (Ra-kara)", convert("क्रम"), "𑴌𑵇𑴤");

console.log("\n=== Extras from original suite ===");
check("पानी", convert("पानी"), "𑴠𑴱𑴟𑴳");
check("घर", convert("घर"), "𑴏𑴦");
console.log("  informational:");
for (const w of ["नाम", "दिन", "क़लम", "ऑफिस", "ऋषि", "१२३"]) {
  console.log(`    ${w} → ${convert(w)}`);
}

console.log("\n=== Reverse round-trip ===");
for (const [src] of Object.entries(GOLDEN)) {
  const back = convertReverse(convert(src));
  const ok = back === src || convert(back) === convert(src);
  if (!ok) failed++;
  console.log(`  ${ok ? "OK " : "FAIL"}  ${src} ↔ ${back}`);
}

console.log("\n=== Punctuation / spaces / empty / long input ===");
check("empty", convert(""), "");
check("punctuation passthrough", convert("नमस्ते, भारत! कैसे हो?"), convert("नमस्ते") + ", " + convert("भारत") + "! " + convert("कैसे") + " " + convert("हो") + "?");
const long = "मसराम गोंडी लिपि में हिन्दी लिखना बहुत आसान है। संयुक्त अक्षर जैसे क्ष, ज्ञ और त्र भी बनते हैं।";
const longOut = convert(long);
console.log("  long sentence →", longOut);
if (!longOut.includes("𑴮")) { failed++; console.log("  FAIL long sentence missing KSSA conjunct"); }

console.log("\n=== Dictionary engine (src/lib/mapping/masaram.ts) unchanged ===");
check("तल्ला", devanagariToMasaram("तल्ला"), "𑴛𑴧𑵅𑴧𑴱");
check("मसराम (dict engine)", devanagariToMasaram("मसराम"), "𑴤𑴫𑴦𑴱𑴤");
check("गोंडी (dict engine)", devanagariToMasaram("गोंडी"), "𑴎𑴽𑵀𑴘𑴳");

console.log("\n=== Shared mapping table parity (mapping.ts vs dictionary engine table) ===");
// The dictionary engine's base letters must agree with the shared table.
const pairs: [string, string][] = [
  ["क", "ख"], ["ग", "घ"], ["च", "ज"], ["ट", "ड"], ["त", "न"],
  ["प", "ब"], ["म", "य"], ["र", "ल"], ["व", "ह"], ["ळ", "स"],
];
for (const [a] of pairs) {
  const shared = String.fromCodePoint(DEVA_TO_MASARAM[a.codePointAt(0)!]);
  const dict = Array.from(devanagariToMasaram(a + "ा"))[0]; // base letter before matra
  const ok = shared === dict;
  if (!ok) failed++;
  console.log(`  ${ok ? "OK " : "FAIL"}  ${a}: shared ${shared} vs dict ${dict}`);
}

console.log("\n=== Script auto-detect (typing Gondi → Hindi mode) ===");
import { detectScript } from "../src/lib/converter/utils";
check("detect deva", detectScript("नमस्ते"), "deva");
check("detect masaram", detectScript("𑴟𑴤𑴫𑵅𑴛𑴺"), "masaram");
check("detect none", detectScript("123 ,."), "none");
check("detect mixed", detectScript("नमस्ते 𑴟𑴤"), "mixed");

console.log("\n=== Reverse: Masaram Gondi typed → Hindi shown ===");
check("𑴎𑴽𑵀𑴘𑴳", convertReverse("𑴎𑴽𑵀𑴘𑴳"), "गोंडी");
check("𑴤𑴫𑴦𑴱𑴤", convertReverse("𑴤𑴫𑴦𑴱𑴤"), "मसराम");
check("𑴛𑴧𑵅𑴧𑴱", convertReverse("𑴛𑴧𑵅𑴧𑴱"), "तल्ला");
check("repha word", convertReverse(convert("कर्म")), "कर्म");
check("rakara word", convertReverse(convert("क्रम")), "क्रम");

console.log("\n=== Astral-safe backspace (keyboard delete) ===");
function backspace(value: string): string {
  return Array.from(value).slice(0, -1).join("");
}
check("delete gondi char", backspace("𑴎𑴽"), "𑴎");
check("delete last gondi char → empty, no broken surrogate", backspace("𑴎"), "");

console.log(failed === 0 ? "\nALL PASSED ✅" : `\n${failed} FAILED ❌`);
process.exit(failed === 0 ? 0 : 1);
