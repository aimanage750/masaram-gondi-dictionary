"use client";

import { codePointLength, masaramCount, wordCount } from "@/lib/converter/utils";
import type { ConverterDirection } from "./ConverterModeTabs";

const CLICKABLE_LIMIT = 800; // code points; beyond this render plain text

export function ConverterOutput({
  value,
  direction,
  unmapped,
  onInspect,
}: {
  value: string;
  direction: ConverterDirection;
  /** Source-script characters that passed through without a verified mapping. */
  unmapped: string[];
  onInspect: (ch: string) => void;
}) {
  const toGondi = direction === "deva-to-masaram";
  const label = toGondi ? "मसराम गोंडी" : "हिन्दी / देवनागरी";
  const chars = codePointLength(value);
  const words = wordCount(value);
  const gondiChars = masaramCount(value);
  const clickable = chars > 0 && chars <= CLICKABLE_LIMIT;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-terracotta-600">
          {label}
        </span>
        <span className="text-[11px] text-ink-700/60" aria-live="off">
          Characters: {chars} · Words: {words}
          {toGondi && chars > 0 ? ` · Unicode (Masaram) अक्षर: ${gondiChars}` : ""}
        </span>
      </div>

      <div
        lang={toGondi ? "gon" : "hi"}
        aria-live="polite"
        aria-label={`परिणाम: ${label}`}
        className={`min-h-[148px] w-full flex-1 overflow-auto whitespace-pre-wrap break-words rounded-2xl border-[1.5px] border-ink-800/15 px-4 py-3.5 text-[28px] leading-[1.55] text-ink-800 md:text-[30px] ${
          toGondi
            ? "font-gondi [background-image:radial-gradient(circle_at_8px_8px,rgba(169,79,36,0.08)_1.1px,transparent_1.4px)] [background-size:16px_16px]"
            : "font-deva"
        } bg-[#fffdf6]`}
      >
        {clickable
          ? Array.from(value).map((ch, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onInspect(ch)}
                title="Unicode Inspector में देखें"
                className="rounded-md hover:bg-ochre-400/25 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-terracotta-500"
              >
                {ch}
              </button>
            ))
          : value}
      </div>

      {unmapped.length > 0 && (
        <p
          role="status"
          className="mt-2 rounded-xl border border-ochre-500/40 bg-ochre-500/10 px-3 py-2 text-xs leading-relaxed text-ink-800"
        >
          ⚠ कुछ characters की verified Masaram Gondi mapping उपलब्ध नहीं है:{" "}
          <span className="font-deva font-semibold">{unmapped.join(" ")}</span> — ये अक्षर
          बिना बदले रह गए हैं।
        </p>
      )}

      {clickable && chars > 0 && (
        <p className="mt-1.5 text-[11px] text-ink-700/55">
          अक्षर पर click/tap करें → Unicode Inspector में विवरण खुलेगा।
        </p>
      )}
    </div>
  );
}
