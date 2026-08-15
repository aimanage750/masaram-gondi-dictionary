"use client";

import { ArrowLeftRight, Copy, Eraser } from "lucide-react";

export function ConverterControls({
  onCopy,
  onClear,
  onSwap,
  smartRa,
  onSmartRaChange,
  direction,
}: {
  onCopy: () => void;
  onClear: () => void;
  onSwap: () => void;
  smartRa: boolean;
  onSmartRaChange: (on: boolean) => void;
  direction: "deva-to-masaram" | "masaram-to-deva";
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta-500 px-4 py-2 text-sm font-medium text-cream-50 shadow hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
      >
        <Copy size={15} /> कॉपी
      </button>
      <button
        type="button"
        onClick={onSwap}
        aria-label="दिशा बदलें"
        className="inline-flex items-center gap-1.5 rounded-xl border border-terracotta-600/30 bg-transparent px-4 py-2 text-sm text-terracotta-700 hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
      >
        <ArrowLeftRight size={15} /> ⇄ उलटो
      </button>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-1.5 rounded-xl border border-terracotta-600/30 bg-transparent px-4 py-2 text-sm text-terracotta-700 hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
      >
        <Eraser size={15} /> साफ़
      </button>
      <label className="inline-flex cursor-pointer select-none items-center gap-2 rounded-xl bg-cream-200 px-3 py-2 text-sm text-ink-800">
        <input
          type="checkbox"
          checked={smartRa}
          onChange={(e) => onSmartRaChange(e.target.checked)}
          className="h-4 w-4 accent-terracotta-500"
        />
        स्मार्ट र (र् / ्र)
      </label>
      <span
        className="ml-auto text-xs text-ink-700/70"
        aria-live="polite"
      >
        {direction === "deva-to-masaram" ? "देवनागरी → मसराम" : "मसराम → देवनागरी"}
      </span>
    </div>
  );
}
