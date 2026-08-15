"use client";

import { ArrowLeftRight, Copy, Eraser } from "lucide-react";
import type { ConverterDirection } from "./ConverterModeTabs";

/**
 * Action buttons below the output: Copy, Swap (बदलो), Clear (साफ़)
 * + the smart-ra option for Hindi → Gondi mode.
 */
export function ConverterControls({
  onCopy,
  onClear,
  onSwap,
  smartRa,
  onSmartRaChange,
  direction,
  hasInput,
  hasOutput,
}: {
  onCopy: () => void;
  onClear: () => void;
  onSwap: () => void;
  smartRa: boolean;
  onSmartRaChange: (on: boolean) => void;
  direction: ConverterDirection;
  hasInput: boolean;
  hasOutput: boolean;
}) {
  const btn =
    "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:cursor-not-allowed disabled:opacity-45";

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          disabled={!hasOutput}
          className={`${btn} bg-terracotta-500 text-cream-50 shadow hover:bg-terracotta-600`}
        >
          <Copy size={15} aria-hidden /> कॉपी (Copy)
        </button>
        <button
          type="button"
          onClick={onSwap}
          disabled={!hasOutput}
          aria-label="इनपुट और आउटपुट बदलें"
          className={`${btn} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}
        >
          <ArrowLeftRight size={15} aria-hidden /> ⇄ बदलो (Swap)
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasInput}
          className={`${btn} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}
        >
          <Eraser size={15} aria-hidden /> साफ़ (Clear)
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {direction === "deva-to-masaram" && (
          <label className="inline-flex min-h-[40px] cursor-pointer select-none items-center gap-2 rounded-xl bg-cream-200 px-3 py-2 text-sm text-ink-800">
            <input
              type="checkbox"
              checked={smartRa}
              onChange={(e) => onSmartRaChange(e.target.checked)}
              className="h-4 w-4 accent-terracotta-500"
            />
            स्मार्ट र (र् / ्र)
          </label>
        )}
        <span className="ml-auto rounded-full bg-forest-500/15 px-3 py-1 text-xs font-medium text-forest-600" aria-live="polite">
          {direction === "deva-to-masaram" ? "देवनागरी → मसराम गोंडी" : "मसराम गोंडी → देवनागरी"}
        </span>
      </div>
    </div>
  );
}
