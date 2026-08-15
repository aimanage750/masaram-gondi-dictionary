"use client";

import {
  DEVA_TO_MASARAM,
  MASARAM_TO_DEVA,
  SEQUENCES,
} from "@/lib/converter/mapping";

/**
 * Unicode Inspector — shows script, code point and the *verified* mapping
 * counterpart when one exists in the existing mapping data.
 * Never invents names or mappings: missing data ⇒ "Mapping information unavailable".
 */
export function UnicodeInspector({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const cp = value ? (value.codePointAt(0) ?? null) : null;
  const hex = cp !== null ? `U+${cp.toString(16).toUpperCase().padStart(4, "0")}` : null;

  let scriptName: string | null = null;
  let mapped: string | null = null;
  let mappedLabel: string | null = null;

  if (cp !== null) {
    if (cp >= 0x11d00 && cp <= 0x11d5f) {
      scriptName = "Masaram Gondi";
      const deva = MASARAM_TO_DEVA[cp];
      if (deva !== undefined) {
        mapped = String.fromCodePoint(deva);
        mappedLabel = "Devanagari";
      }
    } else if (cp >= 0x0900 && cp <= 0x097f) {
      scriptName = "Devanagari";
      const ch = String.fromCodePoint(cp);
      const g = DEVA_TO_MASARAM[cp] ?? undefined;
      if (g !== undefined) {
        mapped = String.fromCodePoint(g);
        mappedLabel = "Masaram Gondi";
      } else if (SEQUENCES.nukta[ch as keyof typeof SEQUENCES.nukta]) {
        mapped = SEQUENCES.nukta[ch as keyof typeof SEQUENCES.nukta];
        mappedLabel = "Masaram Gondi (नक्ता sequence)";
      } else if (SEQUENCES.vocalic[ch as keyof typeof SEQUENCES.vocalic]) {
        mapped = SEQUENCES.vocalic[ch as keyof typeof SEQUENCES.vocalic];
        mappedLabel = "Masaram Gondi (sequence)";
      }
    } else if (!/[\s]/.test(String.fromCodePoint(cp))) {
      scriptName = "Other script / symbol";
    }
  }

  return (
    <section
      aria-labelledby="inspector-h"
      className="rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="inspector-h" className="font-english text-lg font-bold text-forest-600">
          Unicode Inspector
        </h2>
        <label className="flex items-center gap-2 text-xs text-ink-700/70">
          अक्षर paste करें:
          <input
            value={value ?? ""}
            onChange={(e) => {
              const t = e.target.value;
              onChange(t ? Array.from(t)[0] ?? null : null);
            }}
            maxLength={4}
            className="w-20 rounded-lg border border-earth-500/20 bg-cream-50 px-2 py-1.5 text-center font-gondi text-lg text-ink-800 outline-none focus:ring-2 focus:ring-terracotta-500/40"
            aria-label="Inspect a character"
          />
        </label>
      </div>

      {cp === null ? (
        <p className="mt-3 text-sm text-ink-700/70">
          Output में किसी अक्षर पर tap/click करें, या ऊपर अक्षर paste करें — यहाँ उसका
          Unicode विवरण और verified mapping दिखेगी।
        </p>
      ) : (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-cream-100 p-3 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-700/60">
              Character
            </dt>
            <dd
              className={`mt-1 text-4xl text-terracotta-600 ${
                scriptName === "Masaram Gondi"
                  ? "font-gondi"
                  : scriptName === "Devanagari"
                    ? "font-deva"
                    : ""
              }`}
            >
              {String.fromCodePoint(cp)}
            </dd>
          </div>
          <div className="rounded-xl bg-cream-100 p-3 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-700/60">
              Script
            </dt>
            <dd className="mt-1 font-english text-sm font-semibold text-ink-800">
              {scriptName ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl bg-cream-100 p-3 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-700/60">
              Unicode
            </dt>
            <dd className="mt-1 font-english text-sm font-semibold text-ink-800">{hex}</dd>
            <dd className="text-[11px] text-ink-700/60">code point {cp}</dd>
          </div>
          <div className="rounded-xl bg-cream-100 p-3 text-center">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-700/60">
              {mappedLabel ?? "Mapping"}
            </dt>
            {mapped !== null ? (
              <dd
                className={`mt-1 text-3xl text-forest-600 ${
                  mappedLabel?.startsWith("Masaram") ? "font-gondi" : "font-deva"
                }`}
              >
                {mapped}
              </dd>
            ) : (
              <dd className="mt-1 text-xs text-ink-700/70">Mapping information unavailable</dd>
            )}
          </div>
        </dl>
      )}
    </section>
  );
}
