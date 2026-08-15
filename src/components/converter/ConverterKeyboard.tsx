"use client";

import { Keyboard, KeyboardOff } from "lucide-react";
import { GondiKeyboard } from "@/components/GondiKeyboard";

/**
 * Optional on-screen keyboard for the converter input.
 * Reuses the existing GondiKeyboard component (Devanagari pronunciation
 * keys or direct Masaram Gondi keys) — no duplicated layout data.
 */
export function ConverterKeyboard({
  open,
  onToggle,
  value,
  onChange,
}: {
  open: boolean;
  onToggle: () => void;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="converter-keyboard"
        className="inline-flex items-center gap-2 rounded-xl border border-terracotta-600/30 px-4 py-2 text-sm text-terracotta-700 hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
      >
        {open ? <KeyboardOff size={16} /> : <Keyboard size={16} />}
        {open ? "कीबोर्ड छिपाओ" : "कीबोर्ड से लिखो"}
      </button>
      {open && (
        <div id="converter-keyboard" className="mt-3">
          <GondiKeyboard value={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
