"use client";

import { useState } from "react";
import { GondiKeyboard } from "@/components/GondiKeyboard";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { GondiScript } from "@/components/GondiScript";

export default function KeyboardPage() {
  const [q, setQ] = useState("तल्ला");
  const mapped = devanagariToMasaram(q);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl">Masaram Gondi Keyboard</h1>
      <p className="mt-2 text-sm text-ink-700/70">
        Type Devanagari Gondi pronunciation — it maps live to Masaram Gondi Unicode.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mt-4 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-3 font-deva text-xl"
      />
      <div className="gond-frame mt-4 rounded-2xl bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-ink-700/60">Masaram Gondi</p>
        <GondiScript text={mapped} className="text-4xl text-forest-600" />
      </div>
      <div className="mt-4">
        <GondiKeyboard value={q} onChange={setQ} />
      </div>
    </div>
  );
}
