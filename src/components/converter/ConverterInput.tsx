"use client";

import { Eraser, Keyboard, KeyboardOff } from "lucide-react";
import { codePointLength, wordCount } from "@/lib/converter/utils";
import { ConverterKeyboard } from "./ConverterKeyboard";
import type { ConverterDirection } from "./ConverterModeTabs";

export const EXAMPLE_WORDS = [
  "मसराम",
  "गोंडी",
  "नमस्ते",
  "भारत",
  "हिन्दी",
  "जय हिन्द",
  "क्षेत्र",
  "पानी",
  "घर",
  "नाम",
  "दिन",
];

export function ConverterInput({
  value,
  onChange,
  direction,
  inputRef,
  onClear,
  onExample,
  keyboardOpen,
  onToggleKeyboard,
}: {
  value: string;
  onChange: (next: string) => void;
  direction: ConverterDirection;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  onClear: () => void;
  onExample: (word: string) => void;
  keyboardOpen: boolean;
  onToggleKeyboard: () => void;
}) {
  const toGondi = direction === "deva-to-masaram";
  const label = toGondi ? "हिन्दी / देवनागरी लिखें" : "मसराम गोंडी लिखें";

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <label
          htmlFor="converter-input"
          className="text-xs font-semibold uppercase tracking-[0.08em] text-terracotta-600"
        >
          {label}
        </label>
        <span className="text-[11px] text-ink-700/60">
          Characters: {codePointLength(value)} · Words: {wordCount(value)}
        </span>
      </div>

      <textarea
        id="converter-input"
        ref={inputRef}
        lang={toGondi ? "hi" : "gon"}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          toGondi ? "यहाँ लिखें या paste करें… नमस्ते भारत" : "यहाँ मसराम गोंडी अक्षर लिखें या paste करें…"
        }
        className={`min-h-[148px] w-full flex-1 resize-y rounded-2xl border-[1.5px] border-ink-800/15 bg-white px-4 py-3.5 text-[24px] leading-[1.6] text-ink-800 outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30 ${
          toGondi ? "font-deva" : "font-gondi"
        }`}
      />

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={value.length === 0}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-terracotta-600/30 px-3.5 py-2 text-sm font-medium text-terracotta-700 hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Eraser size={14} aria-hidden /> साफ़ (Clear)
        </button>
        <button
          type="button"
          onClick={onToggleKeyboard}
          aria-expanded={keyboardOpen}
          aria-controls="converter-keyboard"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-forest-600/25 px-3.5 py-2 text-sm font-medium text-forest-600 hover:bg-forest-600/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
        >
          {keyboardOpen ? <KeyboardOff size={14} aria-hidden /> : <Keyboard size={14} aria-hidden />}
          {keyboardOpen ? "कीबोर्ड बंद करें" : "मसराम कीबोर्ड"}
        </button>
      </div>

      {keyboardOpen && (
        <div id="converter-keyboard" className="mt-3">
          <ConverterKeyboard value={value} onChange={onChange} />
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-700/60">
          Try an example · उदाहरण आज़माएँ
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLE_WORDS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onExample(w)}
              className="min-h-[36px] rounded-full border border-terracotta-600/25 bg-white px-3 py-1 font-deva text-sm text-ink-800 hover:bg-ochre-400/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta-500"
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
