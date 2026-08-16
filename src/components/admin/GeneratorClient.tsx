"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, Loader2, Search, Sparkles } from "lucide-react";
import { useCsrf } from "./useCsrf";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { toTitleRoman } from "@/lib/mapping/romanize";

/** Phase 9 Word Generator.
 *
 * Research policy (no fabrication):
 *  - Masaram Gondi / Roman Gondi candidates come from the project's OWN
 *    verified conversion mapping — labelled SOURCE: verified mapping.
 *  - Hindi/English references come from EXISTING dictionary data only.
 *  - This deployment has no web/AI research backend; those fields stay
 *    editable and are labelled "Manual / pending research". Generated
 *    drafts save as status=draft, verified=false with an
 *    AUTHOR VERIFICATION REQUIRED flag.
 */
export function GeneratorClient() {
  const csrf = useCsrf();
  const [gondi, setGondi] = useState("");
  const [romanGondi, setRomanGondi] = useState("");
  const [masaram, setMasaram] = useState("");
  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");
  const [hindiDef, setHindiDef] = useState("");
  const [englishDef, setEnglishDef] = useState("");
  const [refs, setRefs] = useState<{ id: string; gondi_script: string; gondi_pronunciation: string; hindi: string; english: string }[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const derived = useMemo(() => {
    const g = gondi.trim();
    return {
      masaram: g ? devanagariToMasaram(g) : "",
      romanGondi: g ? toTitleRoman(g) : "",
    };
  }, [gondi]);

  async function research() {
    if (!gondi.trim() && !hindi.trim() && !english.trim()) return;
    setSearching(true);
    try {
      const q = gondi.trim() || hindi.trim() || english.trim();
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
      const data = res.ok ? await res.json() : { results: [] };
      setRefs(data.results ?? []);
    } catch {
      setRefs([]);
    } finally {
      setSearching(false);
    }
  }

  async function saveDraft(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setMsg(null);
    if (!gondi.trim() || !hindi.trim() || !english.trim()) {
      setMsg({ ok: false, text: "Gondi, Hindi और English — तीनों भरें।" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gondi_pronunciation: gondi.trim(),
          hindi: hindi.trim(),
          english: english.trim(),
          roman_gondi: romanGondi.trim() || undefined,
          gondi_script: masaram.trim() || undefined,
          category: "general",
          status: "draft",
          verified: false,
          notes: `GENERATOR DRAFT — AUTHOR VERIFICATION REQUIRED. ${
            hindiDef.trim() ? `HI-DEF: ${hindiDef.trim()}. ` : ""
          }${englishDef.trim() ? `EN-DEF: ${englishDef.trim()}.` : ""}`.slice(0, 500),
          csrf,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: typeof data?.error === "string" ? data.error : "Save failed" });
        return;
      }
      setMsg({
        ok: true,
        text: `Draft saved (id ${data.id}). Status: DRAFT · AUTHOR VERIFICATION REQUIRED — it is NOT public.`,
      });
    } catch {
      setMsg({ ok: false, text: "Save failed — network error" });
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-earth-500/20 bg-white px-3.5 py-2.5 text-base text-ink-800 outline-none transition focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30";

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Word Generator</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-700/70">
          Enter a new word — the system prepares a structured dictionary draft using the verified
          mapping and existing dictionary references. Nothing is invented: Hindi/English meaning
          fields stay manual until researched, and every draft requires author verification.
        </p>
      </header>

      <form onSubmit={saveDraft} noValidate className="mt-6 space-y-5">
        {/* Input */}
        <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-6">
          <h2 className="font-english text-base font-bold text-forest-600">Input · इनपुट</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium">
              Gondi Devanagari
              <input value={gondi} onChange={(e) => setGondi(e.target.value)} maxLength={200} className={`${inputCls} font-deva`} />
            </label>
            <label className="block text-sm font-medium">
              Roman Gondi
              <input value={romanGondi} onChange={(e) => setRomanGondi(e.target.value)} maxLength={200} className={`${inputCls} font-english`} />
            </label>
            <label className="block text-sm font-medium">
              Masaram Gondi
              <input value={masaram} onChange={(e) => setMasaram(e.target.value)} maxLength={200} className={`${inputCls} font-gondi text-xl`} />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={research}
              disabled={searching}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-forest-600/30 px-5 py-2 text-sm font-semibold text-forest-600 hover:bg-forest-600/10 disabled:opacity-50"
            >
              {searching ? <Loader2 size={14} aria-hidden className="animate-spin" /> : <Search size={14} aria-hidden />}
              Research in existing dictionary
            </button>
            {gondi.trim() && !masaram && (
              <button
                type="button"
                onClick={() => setMasaram(derived.masaram)}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ochre-500/50 px-5 py-2 text-sm font-semibold text-earth-500 hover:bg-ochre-500/10"
              >
                <Sparkles size={13} aria-hidden /> Use derived Masaram
              </button>
            )}
            {gondi.trim() && !romanGondi && (
              <button
                type="button"
                onClick={() => setRomanGondi(derived.romanGondi)}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ochre-500/50 px-5 py-2 text-sm font-semibold text-earth-500 hover:bg-ochre-500/10"
              >
                <Sparkles size={13} aria-hidden /> Use candidate Roman Gondi
              </button>
            )}
          </div>
        </section>

        {/* Derived structure */}
        <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-6">
          <h2 className="font-english text-base font-bold text-forest-600">Prepared Structure</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-cream-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">Masaram Gondi Script</p>
              {masaram || derived.masaram ? (
                <p className="mt-1 font-gondi text-3xl text-forest-600">{masaram || derived.masaram}</p>
              ) : (
                <p className="mt-1 text-sm font-medium text-earth-500">Pending Author Verification</p>
              )}
              <p className="mt-1.5 text-[11px] text-ink-700/60">
                SOURCE: verified mapping · AUTHOR VERIFICATION REQUIRED before publish
              </p>
            </div>
            <div className="rounded-2xl bg-cream-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">Roman Gondi — Candidate Spellings</p>
              <p className="mt-1 font-english text-lg text-ink-800">
                {[...new Set([romanGondi, derived.romanGondi].filter(Boolean))].join("  ·  ") || "—"}
              </p>
              <p className="mt-1.5 text-[11px] text-ink-700/60">
                Multiple spellings need author verification — never auto-authoritative.
              </p>
            </div>
          </div>
        </section>

        {/* References from existing dictionary */}
        {refs !== null && (
          <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-6">
            <h2 className="font-english text-base font-bold text-forest-600">
              Source / Research · existing dictionary data
            </h2>
            {refs.length === 0 ? (
              <p className="mt-3 text-sm text-ink-700/60">
                No similar words in the current dictionary. · कोई मेल खाता शब्द नहीं मिला।
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-earth-500/10">
                {refs.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                    <span className="flex items-baseline gap-3">
                      <span className="font-gondi text-lg text-forest-600">{r.gondi_script}</span>
                      <span className="font-deva text-sm text-ink-800">{r.gondi_pronunciation}</span>
                      <span className="text-sm text-ink-700/70">{r.hindi} · {r.english}</span>
                    </span>
                    <Link href={`/word/${r.id}`} className="text-xs font-semibold text-terracotta-600 underline underline-offset-2">
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[11px] text-ink-700/60">
              Web/AI research is NOT connected in this deployment — fields below remain manual so no
              unverified content is ever presented as fact.
            </p>
          </section>
        )}

        {/* Manual / researched meanings */}
        <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-6">
          <h2 className="font-english text-base font-bold text-forest-600">
            Hindi & English · manual / pending research
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Hindi Word
              <input value={hindi} onChange={(e) => setHindi(e.target.value)} maxLength={200} className={`${inputCls} font-deva`} />
            </label>
            <label className="block text-sm font-medium">
              English Word
              <input value={english} onChange={(e) => setEnglish(e.target.value)} maxLength={200} className={`${inputCls} font-english`} />
            </label>
            <label className="block text-sm font-medium">
              Hindi Definition (editable)
              <textarea value={hindiDef} onChange={(e) => setHindiDef(e.target.value)} maxLength={500} rows={2} className={`${inputCls} font-deva`} />
            </label>
            <label className="block text-sm font-medium">
              English Definition (editable)
              <textarea value={englishDef} onChange={(e) => setEnglishDef(e.target.value)} maxLength={500} rows={2} className={`${inputCls} font-english`} />
            </label>
          </div>
        </section>

        {msg && (
          <p
            role={msg.ok ? "status" : "alert"}
            className={`flex items-start gap-2 rounded-2xl p-4 text-sm font-medium ${
              msg.ok ? "bg-forest-600/10 text-forest-600" : "bg-terracotta-500/10 text-terracotta-700"
            }`}
          >
            {msg.ok ? <CheckCircle2 size={16} aria-hidden className="mt-0.5 shrink-0" /> : <BadgeCheck size={16} aria-hidden className="mt-0.5 shrink-0" />}
            {msg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !csrf}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-forest-600 px-8 py-3 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-forest-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} aria-hidden className="animate-spin" /> : <Sparkles size={16} aria-hidden />}
          Save as Draft · ड्राफ्ट सेव करें
        </button>
      </form>
    </div>
  );
}
