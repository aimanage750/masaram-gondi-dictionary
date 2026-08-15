"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flag, Plus, Search } from "lucide-react";
import type { PublicEntry } from "@/lib/types";
import { isMasaramGondi } from "@/lib/mapping/masaram";
import { normalizeSearch, toTitleRoman } from "@/lib/mapping/romanize";
import { WordCard } from "@/components/WordCard";

const PAGE = 24;
const MAX_SEARCH = 60;

function score(e: PublicEntry, nq: string, masaramQuery: boolean): number {
  let best = 0;
  const fields: [string, boolean][] = [
    [e.gondi_script, masaramQuery],
    [e.gondi_pronunciation, false],
    [toTitleRoman(e.gondi_pronunciation), false],
    [e.hindi, false],
    [e.english, false],
  ];
  for (const [raw, unicodeExactBoost] of fields) {
    const v = normalizeSearch(raw);
    if (!v) continue;
    let s = 0;
    if (v === nq) s = unicodeExactBoost ? 120 : 100;
    else if (v.startsWith(nq)) s = 80;
    else if (nq.startsWith(v) && v.length >= 2) s = 60;
    else if (v.includes(nq)) s = 45;
    if (s > best) best = s;
  }
  return best;
}

export function DictionaryExplorer({ entries }: { entries: PublicEntry[] }) {
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(PAGE);

  const searching = q.trim().length > 0;

  const results = useMemo(() => {
    if (!searching) return null;
    const nq = normalizeSearch(q.trim());
    const masaram = isMasaramGondi(q);
    return entries
      .map((e) => ({ e, s: score(e, nq, masaram) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.e.hindi.localeCompare(b.e.hindi, "hi"))
      .slice(0, MAX_SEARCH)
      .map((x) => x.e);
  }, [q, entries, searching]);

  const shown = searching ? (results ?? []) : entries.slice(0, visible);

  return (
    <div>
      {/* Search area */}
      <div className="relative mx-auto max-w-3xl">
        <Search
          size={18}
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-700/50"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="search"
          placeholder="Search Hindi, English, Gondi or Roman Gondi…"
          aria-label="Search the dictionary in Hindi, English, Gondi Devanagari, Roman Gondi or Masaram Gondi"
          className="w-full rounded-2xl border border-earth-500/15 bg-white py-4 pl-12 pr-4 font-sans text-base text-ink-800 shadow-card outline-none placeholder:text-ink-700/45 focus:ring-2 focus:ring-terracotta-500/40"
        />
      </div>

      {/* Action area */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/contribute"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          <Plus size={16} aria-hidden /> Contribute a Word · शब्द जोड़ें
        </Link>
        <Link
          href="/report"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ochre-500/50 bg-white px-5 py-2.5 text-sm font-semibold text-earth-500 transition hover:bg-ochre-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-500"
        >
          <Flag size={15} aria-hidden /> Report an Error · गलती बताएँ
        </Link>
      </div>

      {/* Result meta */}
      <p className="mt-8 text-center text-sm text-ink-700/70" aria-live="polite">
        {searching ? (
          <>
            <strong className="font-english text-forest-600">{results?.length ?? 0}</strong> result
            {(results?.length ?? 0) === 1 ? "" : "s"} for “{q.trim()}” · कुल{" "}
            {entries.length} शब्द
          </>
        ) : (
          <>
            <strong className="font-english text-forest-600">{entries.length}</strong> verified
            words · दिखा रहे हैं {shown.length}
          </>
        )}
      </p>

      {/* Cards */}
      {shown.length === 0 ? (
        <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-earth-500/10 bg-white p-8 text-center shadow-card">
          <p className="font-deva text-lg text-ink-800">
            uploaded source में यह प्रविष्टि नहीं मिली।
          </p>
          <p className="mt-2 text-sm text-ink-700/70">
            No matching entry in the uploaded गोंडी करीयाट source. Gondi words are never
            invented here.{" "}
            <Link href="/contribute" className="font-medium text-terracotta-500 underline underline-offset-2">
              Suggest this word
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => (
            <WordCard key={e.id} entry={e} />
          ))}
        </div>
      )}

      {/* Load more */}
      {!searching && visible < entries.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE * 2)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-forest-600/30 bg-white px-6 py-2.5 text-sm font-semibold text-forest-600 transition hover:bg-forest-600/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
          >
            और देखें · Show more ({entries.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
