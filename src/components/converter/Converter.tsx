"use client";

import { useMemo, useRef, useState } from "react";
import { convert, convertReverse } from "@/lib/converter/converter";
import { copyText, detectScript } from "@/lib/converter/utils";
import { ConverterInput } from "./ConverterInput";
import { ConverterOutput } from "./ConverterOutput";
import { ConverterControls } from "./ConverterControls";
import { ConverterKeyboard } from "./ConverterKeyboard";
import {
  ConverterModeTabs,
  type ConverterDirection,
} from "./ConverterModeTabs";

/** Example words lifted from the original converter UI (no invented forms). */
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

export function Converter() {
  const [input, setInput] = useState("गोंडी मसराम लिपि");
  const [direction, setDirection] = useState<ConverterDirection>("deva-to-masaram");
  const [smartRa, setSmartRa] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return direction === "deva-to-masaram"
      ? convert(input, smartRa)
      : convertReverse(input);
  }, [input, direction, smartRa]);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1700);
  }

  /**
   * Auto-detect the script while typing:
   * type Masaram Gondi → it switches to Gondi→Hindi automatically,
   * type Devanagari → it switches to Hindi→Gondi.
   */
  function handleInputChange(next: string) {
    const detected = detectScript(next);
    if (detected === "masaram") setDirection("masaram-to-deva");
    else if (detected === "deva") setDirection("deva-to-masaram");
    setInput(next);
  }

  async function handleCopy() {
    const ok = await copyText(output);
    showToast(ok ? "कॉपी हो गया ✓" : "कॉपी नहीं हो सका");
  }

  function handleClear() {
    setInput("");
    inputRef.current?.focus();
    showToast("साफ़ हो गया");
  }

  /** Swap: move the result into the input and flip the direction. */
  function handleSwap() {
    if (!output) return;
    setInput(output);
    setDirection((d) =>
      d === "deva-to-masaram" ? "masaram-to-deva" : "deva-to-masaram"
    );
    showToast("बदल दिया ⇄");
  }

  function handleExample(word: string) {
    setDirection("deva-to-masaram");
    setInput(word);
  }

  return (
    <div className="relative">
      <ConverterModeTabs direction={direction} onChange={setDirection} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-earth-500/10 bg-white p-4 shadow-card md:p-5">
          <ConverterInput
            value={input}
            onChange={handleInputChange}
            direction={direction}
            inputRef={inputRef}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_WORDS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => handleExample(w)}
                className="min-h-[36px] rounded-full border border-terracotta-600/25 bg-white px-3 py-1 font-deva text-sm text-ink-800 hover:bg-ochre-400/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta-500"
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-earth-500/10 bg-white p-4 shadow-card md:p-5">
          <ConverterOutput value={output} direction={direction} />
          <ConverterControls
            onCopy={handleCopy}
            onClear={handleClear}
            onSwap={handleSwap}
            smartRa={smartRa}
            onSmartRaChange={setSmartRa}
            direction={direction}
            hasInput={input.length > 0}
            hasOutput={output.length > 0}
          />
          <p className="mt-3 text-xs leading-relaxed text-ink-700/70">
            नमस्ते = न म स् त े → विराम सहित{" "}
            <span className="font-gondi text-sm">𑴟𑴤𑴫𑵅𑴛𑴺</span> · क्षेत्र ={" "}
            <span className="font-gondi text-sm">𑴮𑴺𑴰</span>
          </p>
        </div>
      </div>

      <ConverterKeyboard
        open={keyboardOpen}
        onToggle={() => setKeyboardOpen((v) => !v)}
        value={input}
        onChange={handleInputChange}
      />

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-sm text-cream-50 transition-opacity duration-200 ${
          toast ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast ?? ""}
      </div>
    </div>
  );
}
