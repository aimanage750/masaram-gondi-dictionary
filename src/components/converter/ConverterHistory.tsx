"use client";

import { History, Trash2, Undo2 } from "lucide-react";
import type { HistoryEntry } from "@/lib/converter/utils";

/**
 * Recent conversions — stored ONLY in localStorage (private text never
 * leaves the browser). Reuse / delete / clear-all.
 */
export function ConverterHistory({
  entries,
  onReuse,
  onDelete,
  onClearAll,
}: {
  entries: HistoryEntry[];
  onReuse: (e: HistoryEntry) => void;
  onDelete: (at: number) => void;
  onClearAll: () => void;
}) {
  if (entries.length === 0) return null;

  return (
    <section
      aria-labelledby="history-h"
      className="rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="history-h" className="inline-flex items-center gap-2 font-english text-lg font-bold text-forest-600">
          <History size={17} aria-hidden /> Recent conversions
        </h2>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-terracotta-600 hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-500"
        >
          <Trash2 size={13} aria-hidden /> Clear all
        </button>
      </div>
      <p className="mt-1 text-[11px] text-ink-700/55">
        History आपके browser (localStorage) में ही रहती है — server को कुछ नहीं भेजा जाता।
      </p>
      <ul className="mt-3 space-y-2">
        {entries.map((e) => (
          <li
            key={e.at}
            className="flex items-center gap-3 rounded-xl border border-earth-500/10 bg-cream-100/60 px-3 py-2"
          >
            <button
              type="button"
              onClick={() => onReuse(e)}
              className="min-w-0 flex-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-terracotta-500"
              title="दोबारा उपयोग करें"
            >
              <span className="block truncate font-deva text-sm text-ink-800">{e.input}</span>
              <span
                className={`block truncate text-base text-forest-600 ${
                  e.direction === "deva-to-masaram" ? "font-gondi" : "font-deva"
                }`}
              >
                <span aria-hidden className="mr-1 text-terracotta-500">→</span>
                {e.output}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onReuse(e)}
              aria-label="इस conversion को दोबारा उपयोग करें"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-forest-600 hover:bg-forest-600/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-600"
            >
              <Undo2 size={15} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onDelete(e.at)}
              aria-label="यह history entry हटाएँ"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-terracotta-600 hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-500"
            >
              <Trash2 size={15} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
