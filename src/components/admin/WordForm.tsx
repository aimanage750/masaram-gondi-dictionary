"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Save, Sparkles } from "lucide-react";
import { useCsrf } from "./useCsrf";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { romanizeDevanagari, toTitleRoman } from "@/lib/mapping/romanize";

export interface WordFormInitial {
  id?: string;
  gondi_script?: string;
  gondi_pronunciation?: string;
  roman_gondi?: string;
  roman_hindi?: string;
  hindi?: string;
  english?: string;
  category?: string;
  notes?: string | null;
  source?: string;
  source_page?: string | null;
  status?: string;
  verified?: boolean;
}

const CATEGORIES = [
  { slug: "body", hi: "अंग प्रत्यंग" },
  { slug: "people", hi: "मनुष्य की अवस्थाएँ" },
  { slug: "family", hi: "रिश्ते" },
  { slug: "clothes", hi: "वस्त्र" },
  { slug: "household", hi: "घरेलू सामान" },
  { slug: "food", hi: "अनाज" },
  { slug: "building", hi: "भवन" },
  { slug: "sports", hi: "खेल कूद" },
  { slug: "time", hi: "समय" },
  { slug: "direction", hi: "दिशा" },
  { slug: "medicine", hi: "दवाई" },
  { slug: "health", hi: "स्वास्थ्य" },
  { slug: "post", hi: "ग्राम पद" },
  { slug: "general", hi: "सामान्य" },
];

const inputCls =
  "mt-1.5 w-full rounded-xl border border-earth-500/20 bg-white px-3.5 py-2.5 text-base text-ink-800 outline-none transition focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30";

function Section({ title, hi, children }: { title: string; hi?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-6">
      <h2 className="font-english text-base font-bold text-forest-600">
        {title}
        {hi ? <span className="ml-2 font-deva text-sm font-normal text-ink-700/60">· {hi}</span> : null}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function WordForm({ initial, mode }: { initial?: WordFormInitial; mode: "create" | "edit" }) {
  const csrf = useCsrf();
  const [gondi, setGondi] = useState(initial?.gondi_pronunciation ?? "");
  const [romanGondi, setRomanGondi] = useState(initial?.roman_gondi ?? "");
  const [masaram, setMasaram] = useState(initial?.gondi_script ?? "");
  const [hindi, setHindi] = useState(initial?.hindi ?? "");
  const [romanHindi, setRomanHindi] = useState(initial?.roman_hindi ?? "");
  const [english, setEnglish] = useState(initial?.english ?? "");
  const [category, setCategory] = useState(initial?.category ?? "general");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [source, setSource] = useState(initial?.source ?? "");
  const [sourcePage, setSourcePage] = useState(initial?.source_page ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [verified, setVerified] = useState(initial?.verified ?? false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const derivedMasaram = useMemo(
    () => (gondi.trim() ? devanagariToMasaram(gondi.trim()) : ""),
    [gondi]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setErr(null);
    if (!gondi.trim() || !hindi.trim() || !english.trim()) {
      setErr("Gondi, Hindi और English — तीनों आवश्यक हैं।");
      return;
    }
    setBusy(true);
    const payload = {
      gondi_pronunciation: gondi.trim(),
      hindi: hindi.trim(),
      english: english.trim(),
      roman_gondi: romanGondi.trim() || undefined,
      roman_hindi: romanHindi.trim() || undefined,
      gondi_script: masaram.trim() || undefined,
      category,
      notes: notes.trim() || undefined,
      source: source.trim() || undefined,
      source_page: sourcePage.trim() || undefined,
      status,
      verified,
      csrf,
    };
    try {
      const res = await fetch(mode === "create" ? "/api/entries" : `/api/entries/${initial?.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof data?.error === "string" ? data.error : "Save failed");
        return;
      }
      setSaved(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErr("Save failed — network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/dictionary"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 underline-offset-2 hover:underline"
      >
        <ArrowLeft size={15} aria-hidden /> Back to Dictionary
      </Link>

      <header className="mt-4">
        <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">
          {mode === "create" ? "Add Word" : "Edit Word"}
        </h1>
        <p className="mt-1 text-sm text-ink-700/70">
          {mode === "create"
            ? "New words start as DRAFT — publish only after author verification."
            : "Changes apply immediately to the stored record. Published words are live on the public site."}
        </p>
      </header>

      {/* CURRENT DATA — shown before editing an existing word */}
      {mode === "edit" && initial && (
        <section aria-label="Current data" className="mt-5 rounded-3xl border border-ochre-500/40 bg-ochre-500/10 p-5">
          <p className="font-english text-[11px] font-semibold uppercase tracking-[0.18em] text-earth-500">
            Current Data · मौजूदा डेटा
          </p>
          <div className="mt-3 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
            <p><span className="text-ink-700/60">Masaram Gondi:</span> <span className="font-gondi text-lg text-forest-600">{initial.gondi_script}</span></p>
            <p><span className="text-ink-700/60">Gondi:</span> <span className="font-deva">{initial.gondi_pronunciation}</span></p>
            <p><span className="text-ink-700/60">Roman Gondi:</span> {initial.roman_gondi}</p>
            <p><span className="text-ink-700/60">Hindi:</span> <span className="font-deva">{initial.hindi}</span></p>
            <p><span className="text-ink-700/60">Roman Hindi:</span> {initial.roman_hindi}</p>
            <p><span className="text-ink-700/60">English:</span> {initial.english}</p>
          </div>
        </section>
      )}

      {saved && (
        <p role="status" className="mt-5 flex items-center gap-2 rounded-2xl bg-forest-600/10 p-4 text-sm font-semibold text-forest-600">
          <CheckCircle2 size={16} aria-hidden /> Saved successfully · सेव हो गया।{" "}
          <Link href="/admin/dictionary" className="underline underline-offset-2">Back to list</Link>
        </p>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
        <Section title="Gondi Information" hi="गोंडी जानकारी">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Gondi Devanagari <span className="text-terracotta-600">*</span>
              <input value={gondi} onChange={(e) => setGondi(e.target.value)} maxLength={200} className={`${inputCls} font-deva`} />
            </label>
            <label className="block text-sm font-medium">
              Roman Gondi
              <input value={romanGondi} onChange={(e) => setRomanGondi(e.target.value)} maxLength={200} className={`${inputCls} font-english`} />
              <button
                type="button"
                onClick={() => gondi.trim() && !romanGondi && setRomanGondi(toTitleRoman(gondi.trim()))}
                disabled={!gondi.trim() || !!romanGondi}
                className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-ochre-500/50 px-3 py-1 text-xs font-semibold text-earth-500 hover:bg-ochre-500/10 disabled:opacity-40"
              >
                <Sparkles size={11} aria-hidden /> Derive from mapping
              </button>
            </label>
          </div>
          <label className="block text-sm font-medium">
            Masaram Gondi Script
            <input value={masaram} onChange={(e) => setMasaram(e.target.value)} maxLength={200} className={`${inputCls} font-gondi text-xl`} />
          </label>
          {derivedMasaram && !masaram && (
            <p className="text-xs text-ink-700/70">
              Derived from verified mapping: <span className="font-gondi text-base text-forest-600">{derivedMasaram}</span>{" "}
              <button
                type="button"
                onClick={() => setMasaram(derivedMasaram)}
                className="font-semibold text-terracotta-600 underline underline-offset-2"
              >
                Use this
              </button>
            </p>
          )}
          {derivedMasaram && masaram && masaram !== derivedMasaram && (
            <p className="rounded-xl bg-ochre-500/10 px-3 py-2 text-xs text-earth-500">
              ⚠ Typed Masaram differs from the verified mapping ({derivedMasaram}). It will be saved
              exactly as typed — flag for AUTHOR VERIFICATION if unsure.
            </p>
          )}
        </Section>

        <Section title="Hindi Information" hi="हिन्दी जानकारी">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Hindi Word <span className="text-terracotta-600">*</span>
              <input value={hindi} onChange={(e) => setHindi(e.target.value)} maxLength={200} className={`${inputCls} font-deva`} />
            </label>
            <label className="block text-sm font-medium">
              Roman Hindi
              <input value={romanHindi} onChange={(e) => setRomanHindi(e.target.value)} maxLength={200} className={`${inputCls} font-english`} />
              <button
                type="button"
                onClick={() => hindi.trim() && !romanHindi && setRomanHindi(romanizeDevanagari(hindi.trim()))}
                disabled={!hindi.trim() || !!romanHindi}
                className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-ochre-500/50 px-3 py-1 text-xs font-semibold text-earth-500 hover:bg-ochre-500/10 disabled:opacity-40"
              >
                <Sparkles size={11} aria-hidden /> Derive from mapping
              </button>
            </label>
          </div>
        </Section>

        <Section title="English Information" hi="अंग्रेज़ी जानकारी">
          <label className="block text-sm font-medium">
            English Word <span className="text-terracotta-600">*</span>
            <input value={english} onChange={(e) => setEnglish(e.target.value)} maxLength={200} className={`${inputCls} font-english`} />
          </label>
        </Section>

        <Section title="Grammar" hi="व्याकरण">
          <label className="block text-sm font-medium">
            Category · श्रेणी
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.slug} · {c.hi}
                </option>
              ))}
            </select>
          </label>
        </Section>

        <Section title="Source" hi="स्रोत">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Source Name
              <input value={source} onChange={(e) => setSource(e.target.value)} maxLength={200} className={inputCls} />
            </label>
            <label className="block text-sm font-medium">
              Page · पृष्ठ
              <input value={sourcePage} onChange={(e) => setSourcePage(e.target.value)} maxLength={40} className={inputCls} />
            </label>
          </div>
          <p className="text-xs text-ink-700/60">
            Never fabricate a source. Leave blank to keep the default primary source.
          </p>
        </Section>

        <Section title="Verification & Status" hi="सत्यापन">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                <option value="draft">draft — not public</option>
                <option value="pending">pending — awaiting review</option>
                <option value="published">published — PUBLIC</option>
                <option value="rejected">rejected</option>
                <option value="archived">archived — hidden, kept</option>
              </select>
            </label>
            <label className="mt-6 flex items-center gap-2.5 text-sm font-medium">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="h-4 w-4 accent-forest-600"
              />
              Author Verified · लेखक-सत्यापित
            </label>
          </div>
          {status === "published" && (
            <p className="rounded-xl bg-terracotta-500/10 px-3 py-2 text-xs font-medium text-terracotta-700">
              ⚠ PUBLISHED makes this word visible on the public dictionary immediately. Confirm the
              data is author-verified.
            </p>
          )}
        </Section>

        <Section title="Internal Notes" hi="टिप्पणी">
          <label className="block text-sm font-medium">
            Notes (never shown publicly)
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={3} className={inputCls} />
          </label>
        </Section>

        {err && (
          <p role="alert" className="rounded-2xl bg-terracotta-500/10 p-4 text-sm font-medium text-terracotta-700">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !csrf}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-forest-600 px-8 py-3 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-forest-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 size={16} aria-hidden className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save size={16} aria-hidden /> {mode === "create" ? "Create Word" : "Save Changes"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
