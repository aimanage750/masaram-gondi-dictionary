"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Settings2 } from "lucide-react";
import { convert, convertReverse } from "@/lib/converter/converter";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import {
  copyText,
  detectScript,
  downloadText,
  loadHistory,
  saveHistory,
  shareText,
  toCodePoints,
  type HistoryEntry,
} from "@/lib/converter/utils";
import { ConverterInput } from "./ConverterInput";
import { ConverterOutput } from "./ConverterOutput";
import { ConverterControls } from "./ConverterControls";
import {
  ConverterModeTabs,
  type ConverterDirection,
} from "./ConverterModeTabs";
import { UnicodeInspector } from "./UnicodeInspector";
import { ConverterHistory } from "./ConverterHistory";

export function Converter() {
  const [input, setInput] = useState("गोंडी मसराम लिपि");
  const [direction, setDirection] = useState<ConverterDirection>("deva-to-masaram");
  const [smartRa, setSmartRa] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [inspectChar, setInspectChar] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // History lives only in the browser; load once on mount (no SSR markup).
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return direction === "deva-to-masaram"
      ? convert(input, smartRa)
      : convertReverse(input);
  }, [input, direction, smartRa]);

  /** Source-script characters the engine passed through unchanged (no verified mapping). */
  const unmapped = useMemo(() => {
    if (!output) return [] as string[];
    const cps = toCodePoints(output);
    const seen = new Set<number>();
    const chars: string[] = [];
    for (const cp of cps) {
      const inSource =
        direction === "deva-to-masaram"
          ? cp >= 0x0900 && cp <= 0x097f // Devanagari left unconverted
          : cp >= 0x11d00 && cp <= 0x11d5f; // Masaram left unconverted
      if (inSource && !seen.has(cp)) {
        seen.add(cp);
        chars.push(String.fromCodePoint(cp));
      }
    }
    return chars;
  }, [output, direction]);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1700);
  }

  /** Auto-detect on typing; manual tab choice always wins until next typing. */
  function handleInputChange(next: string) {
    const detected = detectScript(next);
    if (detected === "masaram") setDirection("masaram-to-deva");
    else if (detected === "deva") setDirection("deva-to-masaram");
    setInput(next);
  }

  function pushHistory() {
    if (!input.trim() || !output) return;
    const entry: HistoryEntry = { input, output, direction, at: Date.now() };
    setHistory((prev) => {
      const next = [entry, ...prev.filter((e) => e.input !== input || e.direction !== direction)].slice(0, 8);
      saveHistory(next);
      return next;
    });
  }

  async function handleCopy() {
    const ok = await copyText(output);
    if (ok) pushHistory();
    showToast(ok ? "कॉपी हो गया ✓" : "कॉपी नहीं हो सका");
  }

  function handleDownload() {
    const ok = downloadText(output);
    if (ok) pushHistory();
    showToast(ok ? "डाउनलोड हो गया ✓" : "डाउनलोड नहीं हो सका");
  }

  async function handleShare() {
    showToast("शेयर किया जा रहा है...");
    const r = await shareText(output);
    if (r !== "failed") pushHistory();
    showToast(r === "shared" ? "शेयर हो गया ✓" : r === "copied" ? "कॉपी हो गया ✓" : "शेयर नहीं हो सका");
  }

  function handleClear() {
    setInput("");
    inputRef.current?.focus();
    showToast("साफ़ हो गया");
  }

  function handleSwap() {
    if (!output) return;
    setInput(output);
    setDirection((d) => (d === "deva-to-masaram" ? "masaram-to-deva" : "deva-to-masaram"));
    showToast("बदल दिया ⇄");
  }

  function handleExample(word: string) {
    setDirection("deva-to-masaram");
    setInput(word);
  }

  function handleReuse(e: HistoryEntry) {
    setDirection(e.direction);
    setInput(e.input);
    showToast("history से लोड हो गया");
  }

  function handleDelete(at: number) {
    setHistory((prev) => {
      const next = prev.filter((e) => e.at !== at);
      saveHistory(next);
      return next;
    });
  }

  function handleClearAll() {
    setHistory(() => {
      saveHistory([]);
      return [];
    });
    showToast("history साफ़ हो गई");
  }

  return (
    <div className="relative">
      <ConverterModeTabs direction={direction} onChange={setDirection} />

      {/* Workspace: input | swap | output */}
      <div className="grid gap-3 md:grid-cols-[1fr_3.25rem_1fr] md:gap-2">
        <div className="rounded-2xl border border-earth-500/10 bg-white p-4 shadow-card md:p-5">
          <ConverterInput
            value={input}
            onChange={handleInputChange}
            direction={direction}
            inputRef={inputRef}
            onClear={handleClear}
            onExample={handleExample}
            keyboardOpen={keyboardOpen}
            onToggleKeyboard={() => setKeyboardOpen((v) => !v)}
          />
        </div>

        <div className="flex items-center justify-center py-1 md:py-0">
          <button
            type="button"
            onClick={handleSwap}
            disabled={!output}
            aria-label="इनपुट और आउटपुट बदलें (swap)"
            title="Swap"
            className="grid h-12 w-12 place-items-center rounded-full bg-terracotta-500 text-cream-50 shadow-card transition hover:rotate-180 hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowLeftRight size={18} aria-hidden className="rotate-90 md:rotate-0" />
          </button>
        </div>

        <div className="rounded-2xl border border-earth-500/10 bg-white p-4 shadow-card md:p-5">
          <ConverterOutput
            value={output}
            direction={direction}
            unmapped={unmapped}
            onInspect={setInspectChar}
          />
          <ConverterControls
            onCopy={handleCopy}
            onDownload={handleDownload}
            onShare={handleShare}
            hasOutput={output.length > 0}
          />
          <p className="mt-3 text-xs leading-relaxed text-ink-700/70">
            नमस्ते = न म स् त े → विराम सहित{" "}
            <span className="font-gondi text-sm">{devanagariToMasaram("नमस्ते")}</span> · क्षेत्र ={" "}
            <span className="font-gondi text-sm">{devanagariToMasaram("क्षेत्र")}</span>
          </p>
        </div>
      </div>

      {/* Advanced settings */}
      <details className="group mt-6 rounded-2xl border border-earth-500/10 bg-white shadow-card">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 font-english text-sm font-semibold text-forest-600 hover:text-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-terracotta-500">
          <Settings2 size={16} aria-hidden />
          Advanced Settings · एडवांस्ड सेटिंग्स
          <span aria-hidden className="ml-auto text-ink-700/50 transition group-open:rotate-180">▾</span>
        </summary>
        <div className="border-t border-earth-500/10 px-5 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={smartRa}
              onChange={(e) => setSmartRa(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-terracotta-500"
            />
            <span>
              <span className="block text-sm font-semibold text-ink-800">
                Smart-Ra / Repha handling
              </span>
              <span className="mt-0.5 block font-deva text-sm text-ink-700">
                र् और र-कार के सही मसराम गोंडी रूपांतरण के लिए उपयोग किया जाता है।
              </span>
            </span>
          </label>
        </div>
      </details>

      {/* Unicode Inspector + History */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <UnicodeInspector value={inspectChar} onChange={setInspectChar} />
        <ConverterHistory
          entries={history}
          onReuse={handleReuse}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      </div>

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
