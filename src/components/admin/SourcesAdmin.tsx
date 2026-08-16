"use client";

import { FormEvent, useState } from "react";
import { BadgeCheck, BadgeX, Library, PlusCircle } from "lucide-react";
import { useCsrf } from "./useCsrf";

export interface AdminSource {
  id: string;
  type: string;
  name: string;
  author?: string | null;
  page?: string | null;
  url?: string | null;
  notes?: string | null;
  verified: boolean;
}

const TYPES = ["book", "pdf", "author", "website", "academic", "community", "other"];

export function SourcesAdmin({ sources: initial }: { sources: AdminSource[] }) {
  const csrf = useCsrf();
  const [sources, setSources] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("book");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [page, setPage] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  async function create(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const res = await fetch("/api/admin/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name, author, page, url, notes, csrf }),
    });
    setBusy(false);
    if (res.ok) {
      notify("✓ Source added");
      setShowForm(false);
      setName(""); setAuthor(""); setPage(""); setUrl(""); setNotes("");
      const d = await res.json().catch(() => ({}));
      setSources((s) => [
        { id: d.id ?? `tmp_${Date.now()}`, type, name, author, page, url, notes, verified: false },
        ...s,
      ]);
    } else {
      const d = await res.json().catch(() => ({}));
      notify(d?.error ?? "Failed");
    }
  }

  async function toggleVerified(s: AdminSource) {
    const res = await fetch(`/api/admin/sources/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !s.verified, csrf }),
    });
    if (res.ok) {
      setSources((list) => list.map((x) => (x.id === s.id ? { ...x, verified: !s.verified } : x)));
      notify(s.verified ? "Marked UNVERIFIED" : "✓ Source Verified");
    } else notify("Failed");
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-earth-500/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30";

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Sources</h1>
          <p className="mt-1 text-sm text-ink-700/70">
            Books, PDFs, websites and authors behind linguistic claims. References only — never
            upload copyrighted books without permission.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-card hover:bg-terracotta-600"
        >
          <PlusCircle size={16} aria-hidden /> Add Source
        </button>
      </header>

      {showForm && (
        <form onSubmit={create} className="mt-5 grid gap-4 rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:grid-cols-2 md:p-6">
          <label className="block text-sm font-medium">
            Type
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Source Name *
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} className={inputCls} />
          </label>
          <label className="block text-sm font-medium">
            Author
            <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={120} className={inputCls} />
          </label>
          <label className="block text-sm font-medium">
            Page
            <input value={page} onChange={(e) => setPage(e.target.value)} maxLength={40} className={inputCls} />
          </label>
          <label className="block text-sm font-medium md:col-span-2">
            URL (https only)
            <input value={url} onChange={(e) => setUrl(e.target.value)} maxLength={500} className={inputCls} />
          </label>
          <label className="block text-sm font-medium md:col-span-2">
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={2} className={inputCls} />
          </label>
          <div className="md:col-span-2">
            <button type="submit" disabled={busy || !name.trim()} className="inline-flex min-h-[42px] items-center rounded-full bg-forest-600 px-6 py-2 text-sm font-semibold text-cream-50 shadow-card hover:bg-forest-500 disabled:opacity-50">
              Save Source
            </button>
          </div>
        </form>
      )}

      {sources.length === 0 ? (
        <p className="mt-8 flex items-center justify-center gap-2 rounded-3xl border border-earth-500/10 bg-white p-10 text-sm text-ink-700/60 shadow-card">
          <Library size={16} aria-hidden /> कोई स्रोत नहीं। No sources recorded yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {sources.map((s) => (
            <li key={s.id} className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink-800">
                    <span className="mr-2 rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-ink-700">{s.type}</span>
                    {s.name}
                  </p>
                  <p className="mt-1 text-xs text-ink-700/60">
                    {s.author && <>Author: {s.author} · </>}
                    {s.page && <>Page: {s.page} · </>}
                    {s.url && <span className="break-all">{s.url}</span>}
                  </p>
                  {s.notes && <p className="mt-1 text-xs text-ink-700/70">{s.notes}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => toggleVerified(s)}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    s.verified
                      ? "bg-forest-600/10 text-forest-600 hover:bg-forest-600/20"
                      : "border border-ochre-500/50 text-earth-500 hover:bg-ochre-500/10"
                  }`}
                >
                  {s.verified ? <BadgeCheck size={14} aria-hidden /> : <BadgeX size={14} aria-hidden />}
                  {s.verified ? "Source Verified" : "Source Unverified"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div aria-live="polite" role="status" className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-sm text-cream-50 transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}>
        {toast ?? ""}
      </div>
    </div>
  );
}
