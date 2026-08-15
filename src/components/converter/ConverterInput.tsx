"use client";

import { codePointLength } from "@/lib/converter/utils";

export function ConverterInput({
  value,
  onChange,
  direction,
  inputRef,
}: {
  value: string;
  onChange: (next: string) => void;
  direction: "deva-to-masaram" | "masaram-to-deva";
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}) {
  const label =
    direction === "deva-to-masaram" ? "हिन्दी / देवनागरी लिखें" : "मसराम गोंडी लिखें";

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
        lang={direction === "deva-to-masaram" ? "hi" : "gon"}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={direction === "deva-to-masaram" ? "यहाँ लिखें… नमस्ते भारत" : "यहाँ लिखें… 𑴟𑴤𑴫𑵅𑴛𑴺"}
        className={`min-h-[148px] w-full flex-1 resize-y rounded-2xl border-[1.5px] border-ink-800/15 bg-white px-4 py-3.5 text-[26px] leading-[1.55] text-ink-800 outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30 ${
          direction === "masaram-to-deva" ? "font-gondi" : "font-deva"
        }`}
        aria-describedby="converter-count"
      />
      <p id="converter-count" className="mt-2 text-right text-xs text-ink-700/70">
        {codePointLength(value)} अक्षर
      </p>
    </div>
  );
}
