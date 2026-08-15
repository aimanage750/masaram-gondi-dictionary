"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { KEYBOARD_LAYOUT } from "@/lib/mapping/masaram";

type Category = "vowels" | "consonants" | "matras" | "signs" | "digits";

interface Row {
  deva: string;
  gondi: string;
  cp: string;
  cpNum: number;
  cat: Category;
}

const SIGN_LABELS: Record<string, string> = {
  halanta: "हलंता (्)",
  "् virama": "विराम (्)",
  repha: "रेफ़ (र्)",
  "ra-kara": "र-कार (्र)",
};

const MATRA_CHARS = "ािीुूृेैोौंः़ॅ";

function rowsFrom(
  keys: { label: string; value: string; hint?: string }[],
  cat: Category
): Row[] {
  return keys.map((k) => {
    const cpNum = k.value.codePointAt(0) ?? 0;
    return {
      deva: k.hint ? SIGN_LABELS[k.hint] ?? k.hint : "",
      gondi: k.label.replace("◌", ""),
      cp: `U+${cpNum.toString(16).toUpperCase()}`,
      cpNum,
      cat,
    };
  });
}

const ALL_ROWS: Row[] = [
  ...rowsFrom(KEYBOARD_LAYOUT.vowels, "vowels"),
  ...rowsFrom(KEYBOARD_LAYOUT.consonants, "consonants"),
  ...rowsFrom(KEYBOARD_LAYOUT.signs, "signs").map((r) =>
    r.deva.length === 1 && MATRA_CHARS.includes(r.deva)
      ? { ...r, cat: "matras" as Category }
      : r
  ),
  ...rowsFrom(KEYBOARD_LAYOUT.digits, "digits"),
];

const FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vowels", label: "Vowels · स्वर" },
  { id: "consonants", label: "Consonants · व्यंजन" },
  { id: "matras", label: "Matras · मात्राएँ" },
  { id: "signs", label: "Signs · चिह्न" },
  { id: "digits", label: "Digits · अंक" },
];

const SECTION_TITLE: Record<Category, string> = {
  vowels: "स्वर · Vowels",
  consonants: "व्यंजन · Consonants",
  matras: "मात्राएँ · Matras",
  signs: "चिह्न / संयुक्त · Signs",
  digits: "अंक · Digits",
};

/** Search by Devanagari, Masaram Gondi glyph, or Unicode code point. */
function matches(r: Row, q: string): boolean {
  if (!q) return true;
  const nq = q.toLowerCase().replace(/^u\+/, "").trim();
  if (!nq) return true;
  if (r.deva && r.deva.includes(q)) return true;
  if (r.gondi.includes(q)) return true;
  if (r.cp.toLowerCase().replace("u+", "").includes(nq)) return true;
  if (r.cpNum.toString(16).toLowerCase() === nq) return true;
  return false;
}

/** One category table; height always fits its own rows (no stretching). */
function SectionCard({ s, className = "" }: { s: { cat: Category; rows: Row[] }; className?: string }) {
  return (
    <div className={`rounded-2xl border border-earth-500/10 bg-white p-4 shadow-card ${className}`}>
      <h3 className="mb-3 font-deva text-lg font-bold text-terracotta-700">
        {SECTION_TITLE[s.cat]}
        <span className="ml-2 text-xs font-normal text-ink-700/50">{s.rows.length}</span>
      </h3>
      <div className="overflow-x-auto" tabIndex={0} role="group" aria-label={SECTION_TITLE[s.cat]}>
        <table className="w-full min-w-[300px] border-collapse text-base">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.06em] text-terracotta-700">
              <th scope="col" className="border-b border-ink-800/15 px-2 py-1.5 font-semibold">देवनागरी</th>
              <th scope="col" className="border-b border-ink-800/15 px-2 py-1.5 font-semibold">गोंडी</th>
              <th scope="col" className="border-b border-ink-800/15 px-2 py-1.5 font-semibold">कोड</th>
            </tr>
          </thead>
          <tbody>
            {s.rows.map((r) => (
              <tr key={`${r.gondi}-${r.cp}`} className="odd:bg-white/50">
                <td className="border-b border-ink-800/10 px-2 py-1.5 font-deva text-ink-800">{r.deva}</td>
                <td className="border-b border-ink-800/10 px-2 py-1.5 font-gondi text-2xl text-terracotta-700">{r.gondi}</td>
                <td className="border-b border-ink-800/10 px-2 py-1.5 text-xs text-forest-500">{r.cp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CharMapExplorer() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Category | "all">("all");

  const sections = useMemo(() => {
    const rows = ALL_ROWS.filter(
      (r) => (filter === "all" || r.cat === filter) && matches(r, q.trim())
    );
    const order: Category[] = ["vowels", "consonants", "matras", "signs", "digits"];
    return order
      .map((cat) => ({ cat, rows: rows.filter((r) => r.cat === cat) }))
      .filter((s) => s.rows.length > 0);
  }, [q, filter]);

  const small = sections.filter((s) => s.cat !== "consonants");
  const consonants = sections.filter((s) => s.cat === "consonants");

  return (
    <div>
      {/* search + filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-700/50"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search character / अक्षर / U+11D0C…"
            aria-label="Search the character map by Devanagari, Masaram Gondi or code point"
            className="w-full rounded-xl border border-earth-500/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-800 outline-none placeholder:text-ink-700/45 focus:ring-2 focus:ring-terracotta-500/40"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Character map filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 ${
                filter === f.id
                  ? "bg-forest-600 text-cream-50 shadow-card"
                  : "bg-white text-ink-800 hover:bg-cream-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-earth-500/10 bg-white p-6 text-center text-sm text-ink-700">
          इस खोज से मेल खाता कोई अक्षर नहीं मिला।
        </p>
      ) : (
        <>
          {/* compact sections keep their natural height */}
          {small.length > 0 && (
            <div className="mt-4 grid items-start gap-4 md:grid-cols-2">
              {small.map((s) => (
                <SectionCard key={s.cat} s={s} />
              ))}
            </div>
          )}
          {/* long consonant table gets full width */}
          {consonants.map((s) => (
            <SectionCard key={s.cat} s={s} className="mt-4" />
          ))}
        </>
      )}
    </div>
  );
}
