"use client";

import { useState } from "react";
import { GondiKeyboard } from "@/components/GondiKeyboard";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { GondiScript } from "@/components/GondiScript";

export function KeyboardClient() {
  const [q, setQ] = useState("तल्ला");
  const mapped = devanagariToMasaram(q);

  return (
    <>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Devanagari Gondi pronunciation input"
        className="mt-4 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-3 font-deva text-xl text-ink-800 placeholder:text-ink-700/40"
      />
      <div className="gond-frame mt-4 rounded-2xl bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-ink-700/60">Masaram Gondi</p>
        <GondiScript text={mapped} className="text-4xl text-forest-600" />
      </div>
      <div className="mt-4">
        <GondiKeyboard value={q} onChange={setQ} />
      </div>
    </>
  );
}
