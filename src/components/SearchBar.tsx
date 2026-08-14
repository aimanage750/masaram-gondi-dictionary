"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { GondiKeyboard } from "@/components/GondiKeyboard";

export function SearchBar({
  initial = "",
  autoFocus = false,
}: {
  initial?: string;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState(initial);
  const [keys, setKeys] = useState(false);
  const router = useRouter();

  function go(e?: FormEvent) {
    e?.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="w-full">
      <form onSubmit={go} className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autoFocus}
          placeholder="तल्ला · Talla · सिर · Head · 𑴛𑴧𑵅𑴧𑴱"
          className="w-full rounded-2xl border-2 border-terracotta-500/30 bg-white py-3.5 pl-4 pr-28 font-deva text-lg text-ink-800 shadow-card outline-none focus:border-terracotta-500"
          aria-label="Search dictionary"
        />
        <div className="absolute inset-y-1.5 right-1.5 flex gap-1">
          <button
            type="button"
            onClick={() => setKeys((v) => !v)}
            className="rounded-xl px-3 text-sm text-forest-600 hover:bg-cream-200"
          >
            ⌨
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-xl bg-terracotta-500 px-4 text-sm font-medium text-cream-50"
          >
            <Search size={16} /> Search
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
