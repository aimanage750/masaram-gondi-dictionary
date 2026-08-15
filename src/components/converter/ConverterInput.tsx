"use client";

import { codePointLength } from "@/lib/converter/utils";
import type { ConverterDirection } from "./ConverterModeTabs";

export function ConverterInput({
  value,
  onChange,
  direction,
  inputRef,
}: {
  value: string;
  onChange: (next: string) => void;
  direction: ConverterDirection;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}) {
  const toGondi = direction === "deva-to-masaram";
  const label = toGondi ? "हिन्दी / देवनागरी लिखें" : "मसराम गोंडी लिखें";

  return (
    <div className="flex h-full flex-col">
      <label
        htmlFor="converter-input"
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-terracotta-600"
      >
        {label}
      </label>
      <textarea
        id="converter-input"
        ref={inputRef}
        lang={toGondi ? "hi" : "gon"}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          toGondi ? "यहाँ लिखें… नमस्ते भारत" : "यहाँ लिखें… 𑴟𑴤𑴫𑵅𑴛𑴺 𑴣𑴱𑴦𑴛"
        }
        className={`min-h-[148px] w-full flex-1 resize-y rounded-2xl border-[1.5px] border-ink-800/15 bg-white px-4 py-3.5 text-[26px] leading-[1.55] text-ink-800 outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30 ${
          toGondi ? "font-deva" : "font-gondi"
        }`}
        aria-describedby="converter-count"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-ink-700/60">
          लिपि अपने आप पहचानी जाती है — गोंडी लिखो तो हिन्दी दिखेगी, हिन्दी लिखो तो गोंडी।
        </p>
        <p id="converter-count" className="text-xs text-ink-700/70">
          {codePointLength(value)} अक्षर
        </p>
      </div>
    </div>
  );
}
