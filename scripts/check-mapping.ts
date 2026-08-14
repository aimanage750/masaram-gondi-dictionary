import { devanagariToMasaram } from "../src/lib/mapping/masaram";
import { toTitleRoman } from "../src/lib/mapping/romanize";

const got = devanagariToMasaram("तल्ला");
const expect = "𑴛𑴧𑵅𑴧𑴱";
console.log("तल्ला →", got);
console.log("expected", expect);
console.log("match", got === expect);
console.log("roman", toTitleRoman("तल्ला"));
if (got !== expect) process.exit(1);
