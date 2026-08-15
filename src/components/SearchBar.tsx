"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { GondiKeyboard } from "@/components/GondiKeyboard";

export type SearchLang = "all" | "hindi" | "english" | "gondi";

export function SearchBar({
  initial = "",
  initialLang = "all",
  autoFocus = false,
  size = "lg",
}: {
  initial?: string;
  initialLang?: SearchLang;
  autoFocus?: boolean;
  size?: "lg" | "md";
}) {
  const [q, setQ] = useState(initial);
  const [lang, setLang] = useState<SearchLang>(initialLang);
  const [keys, setKeys] = useState(false);
  const router = useRouter();

  function go(e?: FormEvent) {
    e?.preventDefault();
    const query = q.trim();
    if (!query) return;
    const params = new URLSearchParams({ q: query });
    if (lang !== "all") params.set("lang", lang);
    router.push(`/?${params.toString()}`);
  }

  const big = size === "lg";

  return (
    <div className="w-full">
      <form
        onSubmit={go}
        className={`flex items-stretch gap-2 rounded-2xl border border-earth-500/15 bg-white p-2 shadow-lift ${
          big ? "flex-col sm:flex-row sm:items-center" : ""
        }`}
      >
        <div className="relative flex-1">
          <Search
            size={18}
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-700/50"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus={autoFocus}
            placeholder="Type in Hindi, English or Gondi..."
            aria-label="Search dictionary — Type in Hindi, English or Gondi"
            className={`w-full rounded-xl bg-transparent pl-10 pr-3 text-ink-800 outline-none placeholder:text-ink-700/45 focus:ring-2 focus:ring-terracotta-500/40 ${
              big ? "py-3.5 font-sans text-lg" : "py-2.5 font-sans text-base"
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="search-lang">
            Search language
          </label>
          <select
            id="search-lang"
            value={lang}
            onChange={(e) => setLang(e.target.value as SearchLang)}
            className={`rounded-xl border border-earth-500/15 bg-cream-100 px-3 text-sm font-medium text-ink-800 outline-none focus:ring-2 focus:ring-terracotta-500/40 ${
              big ? "py-3.5" : "py-2.5"
            }`}
          >
            <option value="all">All</option>
            <option value="hindi">हिन्दी</option>
            <option value="english">English</option>
            <option value="gondi">गोंडी</option>
          </select>

          <button
            type="button"
            onClick={() => setKeys((v) => !v)}
            aria-label="Masaram Gondi कीबोर्ड खोलें"
            aria-expanded={keys}
            className="rounded-xl px-3 py-2 text-lg text-forest-600 hover:bg-cream-200"
          >
            ⌨
          </button>

          <button
            type="submit"
            className={`inline-flex items-center gap-2 rounded-xl bg-terracotta-500 font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 ${
              big ? "px-6 py-3.5" : "px-4 py-2.5 text-sm"
            }`}
          >
            <Search size={big ? 18 : 15} aria-hidden />
            Search
          </button>
        </div>
      </form>

      {keys && (
        <div className="mt-3">
          <GondiKeyboard value={q} onChange={setQ} />
        </div>
      )}
    </div>
  );
}
