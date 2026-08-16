"use client";

import { codePointLength, masaramCount, wordCount } from "@/lib/converter/utils";
import type { ConverterDirection } from "./ConverterModeTabs";

export function ConverterOutput({
  value,
  direction,
  unmapped,
}: {
  value: string;
  direction: ConverterDirection;
  /** Source-script characters that passed through without a verified mapping. */
  unmapped: string[];
}) {
  const toGondi = direction === "deva-to-masaram";
  const label = toGondi ? "मसराम गोंडी" : "हिन्दी / देवनागरी";
  const chars = codePointLength(value);
  const words = wordCount(value);
  const gondiChars = masaramCount(value);

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

      {/* Plain continuous text — base character + matra must stay joined
          (no per-character wrappers, otherwise shaping breaks). */}
      <div
        lang={toGondi ? "gon" : "hi"}
        aria-live="polite"
        aria-label={`परिणाम: ${label}`}
        className={`min-h-[148px] w-full flex-1 overflow-auto whitespace-pre-wrap break-words rounded-2xl border-[1.5px] border-ink-800/15 px-4 py-3.5 text-[28px] leading-[1.55] tracking-normal text-ink-800 md:text-[30px] ${
          toGondi
            ? "font-gondi [background-image:radial-gradient(circle_at_8px_8px,rgba(169,79,36,0.08)_1.1px,transparent_1.4px)] [background-size:16px_16px]"
            : "font-deva"
        } note-paper`}
      >
        {value}
      </div>

      {unmapped.length > 0 && (
        <p
          role="status"
          className="mt-3 rounded-xl border border-ochre-500/40 bg-ochre-500/10 px-3 py-2 text-xs leading-relaxed text-ink-800"
        >
          ⚠ कुछ characters की verified Masaram Gondi mapping उपलब्ध नहीं है:{" "}
          <span className="font-deva font-semibold">{unmapped.join(" ")}</span> — ये अक्षर
          बिना बदले रह गए हैं।
        </p>
      )}
    </div>
  );
}
