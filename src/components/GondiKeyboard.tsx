"use client";

import { useState } from "react";
import { Delete, Space, ArrowLeftRight } from "lucide-react";
import { DEVANAGARI_KEYBOARD, KEYBOARD_LAYOUT } from "@/lib/mapping/masaram";

type Mode = "masaram" | "devanagari";

export function GondiKeyboard({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  const [mode, setMode] = useState<Mode>("devanagari");
  const layout = mode === "masaram" ? KEYBOARD_LAYOUT : DEVANAGARI_KEYBOARD;

  function push(ch: string) {
    onChange(value + ch);
  }

  return (
    <div className={`rounded-2xl border border-terracotta-500/25 bg-cream-50 p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-ink-700/70">
          {mode === "masaram" ? "Masaram Gondi keyboard" : "Gondi Pronunciation (Devanagari)"}
        </p>
        <button
          type="button"
          onClick={() => setMode(mode === "masaram" ? "devanagari" : "masaram")}
          className="inline-flex items-center gap-1 rounded-full bg-forest-500 px-3 py-1 text-xs text-cream-50"
        >
          <ArrowLeftRight size={12} />
          {mode === "masaram" ? "Devanagari" : "Masaram"}
        </button>
      </div>
      <KeyRow keys={layout.vowels} onPress={push} />
      <KeyRow keys={layout.consonants} onPress={push} />
      <KeyRow keys={"signs" in layout ? layout.signs : []} onPress={push} />
      {mode === "masaram" && "digits" in KEYBOARD_LAYOUT && (
        <KeyRow keys={KEYBOARD_LAYOUT.digits} onPress={push} />
      )}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => push(" ")}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-cream-200 py-2 text-sm"
        >
          <Space size={14} /> Space
        </button>
        <button
          type="button"
          onClick={() => onChange(value.slice(0, -1))}
          className="rounded-lg bg-terracotta-500 px-4 py-2 text-cream-50"
        >
          <Delete size={16} />
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-lg border border-ink-700/20 px-3 py-2 text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function isMasaramChar(s: string) {
  const cp = s.codePointAt(0) ?? 0;
  return cp >= 0x11d00 && cp <= 0x11d5f;
}

function KeyRow({
  keys,
  onPress,
}: {
  keys: { label: string; value: string; hint?: string }[];
  onPress: (v: string) => void;
}) {
  if (!keys.length) return null;
  return (
    <div className="mb-1.5 flex flex-wrap gap-1">
      {keys.map((k) => (
        <button
          key={`${k.label}-${k.value}`}
          type="button"
          title={k.hint}
          onClick={() => onPress(k.value)}
          className="min-w-[2.1rem] rounded-md border border-terracotta-500/20 bg-white px-1.5 py-1.5 text-center font-gondi text-lg leading-none text-ink-800 hover:border-terracotta-500 hover:bg-cream-200"
        >
          <span className={isMasaramChar(k.value) ? "font-gondi" : "font-deva"}>
            {k.label}
          </span>
        </button>
      ))}
    </div>
  );
}
