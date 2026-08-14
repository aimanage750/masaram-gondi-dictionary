"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DictionaryEntry } from "@/lib/types";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { CATEGORY_META } from "@/data/raw-entries";
import { publicError } from "@/lib/api-error";

export function EntryForm({ entry }: { entry?: DictionaryEntry }) {
  const router = useRouter();
  const [csrf, setCsrf] = useState("");
  const [gondi, setGondi] = useState(entry?.gondi_pronunciation ?? "");
  const [hindi, setHindi] = useState(entry?.hindi ?? "");
  const [english, setEnglish] = useState(entry?.english ?? "");
  const [category, setCategory] = useState(entry?.category ?? "general");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const mapped = devanagariToMasaram(gondi);

  useEffect(() => {
    fetch("/api/csrf", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d) => setCsrf(d.token ?? ""))
      .catch(() => setErr("सुरक्षा टोकन नहीं मिला। पेज रीफ्रेश करो।"));
  }, []);

  async function readBody(res: Response) {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { error: text.slice(0, 200) || `HTTP ${res.status}` };
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    if (!csrf) {
      setErr("सुरक्षा टोकन अभी लोड नहीं हुआ। एक सेकंड बाद फिर सेव दबाओ।");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(entry ? `/api/entries/${entry.id}` : "/api/entries", {
        method: entry ? "PUT" : "POST",
        credentials: "same-origin",
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
      const data = await readBody(res);
      if (!res.ok) {
        setErr(publicError(data.error ?? data, "सेव नहीं हुआ"));
        return;
      }
      setOk("सेव हो गया।");
      router.push("/admin/entries");
      router.refresh();
    } catch (e) {
      setErr(publicError(e, "नेटवर्क त्रुटि — सेव नहीं हुआ"));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!entry || !confirm("यह शब्द हटाएँ?")) return;
    setErr(null);
    setOk(null);
    if (!csrf) {
      setErr("सुरक्षा टोकन अभी लोड नहीं हुआ। पेज रीफ्रेश करो।");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/entries/${entry.id}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csrf }),
      });
      const data = await readBody(res);
      if (!res.ok) {
        setErr(publicError(data.error ?? data, "डिलीट नहीं हुआ"));
        return;
      }
      router.push("/admin/entries");
      router.refresh();
    } catch (e) {
      setErr(publicError(e, "डिलीट नहीं हुआ"));
    } finally {
      setBusy(false);
    }
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
      {ok && <p className="text-sm text-forest-600">{ok}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy || !csrf} className="rounded-xl bg-forest-500 px-4 py-2 text-cream-50 disabled:opacity-50">
          {busy ? "सेव हो रहा है…" : "Save"}
        </button>
        {entry && (
          <button type="button" disabled={busy || !csrf} onClick={onDelete} className="rounded-xl border border-terracotta-500 px-4 py-2 text-terracotta-600 disabled:opacity-50">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
