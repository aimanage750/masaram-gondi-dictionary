"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DictionaryEntry } from "@/lib/types";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { CATEGORY_META } from "@/data/raw-entries";

export function EntryForm({ entry }: { entry?: DictionaryEntry }) {
  const router = useRouter();
  const [csrf, setCsrf] = useState("");
  const [gondi, setGondi] = useState(entry?.gondi_pronunciation ?? "");
  const [hindi, setHindi] = useState(entry?.hindi ?? "");
  const [english, setEnglish] = useState(entry?.english ?? "");
  const [category, setCategory] = useState(entry?.category ?? "general");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [err, setErr] = useState<string | null>(null);
  const mapped = devanagariToMasaram(gondi);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch(entry ? `/api/entries/${entry.id}` : "/api/entries", {
      method: entry ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gondi_pronunciation: gondi,
        hindi,
        english,
        category,
        notes,
        csrf,
        status: "published",
      }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error ?? "Save failed");
    else router.push("/admin/entries");
  }

  async function onDelete() {
    if (!entry || !confirm("Delete this entry?")) return;
    await fetch(`/api/entries/${entry.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csrf }),
    });
    router.push("/admin/entries");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-3">
      <label className="block text-sm">
        Gondi Pronunciation (source form — do not “correct”)
        <input
          required
          value={gondi}
          onChange={(e) => setGondi(e.target.value)}
          className="mt-1 w-full rounded-xl border px-3 py-2 font-deva"
        />
      </label>
      <div className="rounded-xl bg-cream-200 p-3">
        <p className="text-xs uppercase text-ink-700/60">Masaram Gondi (generated)</p>
        <p className="font-gondi text-3xl text-forest-600">{mapped}</p>
      </div>
      <label className="block text-sm">
        Hindi
        <input required value={hindi} onChange={(e) => setHindi(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 font-deva" />
      </label>
      <label className="block text-sm">
        English
        <input required value={english} onChange={(e) => setEnglish(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
      </label>
      <label className="block text-sm">
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
          {CATEGORY_META.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Notes / source
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
      </label>
      {err && <p className="text-sm text-terracotta-600">{err}</p>}
      <div className="flex gap-2">
        <button className="rounded-xl bg-forest-500 px-4 py-2 text-cream-50">Save</button>
        {entry && (
          <button type="button" onClick={onDelete} className="rounded-xl border border-terracotta-500 px-4 py-2 text-terracotta-600">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
