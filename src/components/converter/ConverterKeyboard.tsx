"use client";

import Link from "next/link";
import { GondiKeyboard } from "@/components/GondiKeyboard";

/**
 * On-screen Masaram Gondi keyboard for the converter input.
 * Reuses the existing GondiKeyboard component + KEYBOARD_LAYOUT —
 * the single source of truth for key mappings.
 */
export function ConverterKeyboard({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-earth-500/10 bg-cream-100/70 p-3">
      <GondiKeyboard value={value} onChange={onChange} />
      <p className="mt-2 text-right">
        <Link
          href="/keyboard"
          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2 text-sm font-medium text-terracotta-600 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          Open Full Keyboard →
        </Link>
      </p>
    </div>
  );
}
