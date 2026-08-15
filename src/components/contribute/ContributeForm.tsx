"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  Flag,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { GondiKeyboard } from "@/components/GondiKeyboard";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { romanizeDevanagari, toTitleRoman } from "@/lib/mapping/romanize";

type Step = "form" | "review" | "success" | "error";

interface FormState {
  gondi_pronunciation: string;
  roman_gondi: string;
  masaram_gondi: string;
  pronunciation: string;
  gondi_example: string;
  dialect: string;
  hindi: string;
  roman_hindi: string;
  hindi_definition: string;
  hindi_example: string;
  hindi_synonyms: string;
  hindi_antonyms: string;
  english: string;
  english_definition: string;
  english_example: string;
  english_synonyms: string;
  english_antonyms: string;
  source_type: string;
  source_name: string;
  source_author: string;
  source_page: string;
  source_url: string;
  notes: string;
  contributor_name: string;
  contributor_email: string;
  website: string; // honeypot — humans never fill this
}

const EMPTY: FormState = {
  gondi_pronunciation: "",
  roman_gondi: "",
  masaram_gondi: "",
  pronunciation: "",
  gondi_example: "",
  dialect: "",
  hindi: "",
  roman_hindi: "",
  hindi_definition: "",
  hindi_example: "",
  hindi_synonyms: "",
  hindi_antonyms: "",
  english: "",
  english_definition: "",
  english_example: "",
  english_synonyms: "",
  english_antonyms: "",
  source_type: "",
  source_name: "",
  source_author: "",
  source_page: "",
  source_url: "",
  notes: "",
  contributor_name: "",
  contributor_email: "",
  website: "",
};

interface Match {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  hindi: string;
  english: string;
}

/* ---------- small presentational helpers ---------- */

function OptionalChip({ note }: { note?: string }) {
  return (
    <span className="rounded-full bg-ink-700/5 px-2 py-0.5 font-english text-[10px] font-semibold uppercase tracking-wide text-ink-700/55">
      Optional{note ? ` — ${note}` : ""}
    </span>
  );
}

function SuggestionChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ochre-500/15 px-2 py-0.5 font-english text-[10px] font-semibold uppercase tracking-wide text-earth-500">
      <Sparkles size={10} aria-hidden /> Suggested — Review Required
    </span>
  );
}

function SectionCard({
  letter,
  title,
  titleHi,
  children,
}: {
  letter: string;
  title: string;
  titleHi: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-7">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-600 font-english text-sm font-bold text-cream-50"
        >
          {letter}
        </span>
        <div>
          <h2 className="font-english text-base font-bold text-forest-600">{title}</h2>
          <p className="font-deva text-sm text-ink-700/70">{titleHi}</p>
        </div>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-earth-500/20 bg-white px-3.5 py-2.5 text-base text-ink-800 outline-none transition focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30";

function Field({
  label,
  labelHi,
  optionalNote,
  hint,
  children,
}: {
  label: string;
  labelHi?: string;
  optionalNote?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-ink-800">
      <span className="flex flex-wrap items-center gap-2">
        <span>
          {label}
          {labelHi ? <span className="ml-1.5 font-deva font-normal text-ink-700/60">· {labelHi}</span> : null}
        </span>
        <OptionalChip note={optionalNote} />
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs font-normal text-ink-700/60">{hint}</span> : null}
    </label>
  );
}

function SuggestButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-1.5 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-ochre-500/50 px-3.5 py-1.5 text-xs font-semibold text-earth-500 transition hover:bg-ochre-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ochre-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Sparkles size={12} aria-hidden /> {label}
    </button>
  );
}

/* ---------- main component ---------- */

export function ContributeForm() {
  const [csrf, setCsrf] = useState("");
  const [f, setF] = useState<FormState>(EMPTY);
  const [step, setStep] = useState<Step>("form");
  const [formErr, setFormErr] = useState<string | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [suggested, setSuggested] = useState<Record<string, boolean>>({});
  const [suggestionsUsed, setSuggestionsUsed] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  function set<K extends keyof FormState>(key: K, value: string) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  const hasIdentifier = useMemo(
    () => f.gondi_pronunciation.trim() || f.roman_gondi.trim() || f.masaram_gondi.trim(),
    [f.gondi_pronunciation, f.roman_gondi, f.masaram_gondi]
  );

  /* ----- mapping suggestions (existing verified mappings, never invented) ----- */

  function suggestMasaram() {
    if (!f.gondi_pronunciation.trim() || f.masaram_gondi.trim()) return;
    set("masaram_gondi", devanagariToMasaram(f.gondi_pronunciation.trim()));
    setSuggested((s) => ({ ...s, masaram_gondi: true }));
    setSuggestionsUsed((u) => (u.includes("masaram-from-devanagari") ? u : [...u, "masaram-from-devanagari"]));
  }

  function suggestRomanGondi() {
    if (!f.gondi_pronunciation.trim() || f.roman_gondi.trim()) return;
    set("roman_gondi", toTitleRoman(f.gondi_pronunciation.trim()));
    setSuggested((s) => ({ ...s, roman_gondi: true }));
    setSuggestionsUsed((u) => (u.includes("roman-gondi-from-devanagari") ? u : [...u, "roman-gondi-from-devanagari"]));
  }

  function suggestRomanHindi() {
    if (!f.hindi.trim() || f.roman_hindi.trim()) return;
    set("roman_hindi", romanizeDevanagari(f.hindi.trim()));
    setSuggested((s) => ({ ...s, roman_hindi: true }));
    setSuggestionsUsed((u) => (u.includes("roman-hindi-from-hindi") ? u : [...u, "roman-hindi-from-hindi"]));
  }

  /* ----- duplicate check ----- */

  async function checkDuplicates(): Promise<Match[]> {
    const queries = [
      f.gondi_pronunciation,
      f.roman_gondi,
      f.masaram_gondi,
      f.hindi,
      f.english,
    ]
      .map((q) => q.trim())
      .filter(Boolean)
      .filter((q, i, arr) => arr.indexOf(q) === i)
      .slice(0, 5);

    const responses = await Promise.all(
      queries.map((q) =>
        fetch(`/api/contribute/check?q=${encodeURIComponent(q)}&limit=3`).then((r) =>
          r.ok ? r.json() : { results: [] }
        )
      )
    );
    const seen = new Set<string>();
    const merged: Match[] = [];
    for (const res of responses) {
      for (const e of (res.results ?? []) as Match[]) {
        if (!seen.has(e.id)) {
          seen.add(e.id);
          merged.push(e);
        }
      }
    }
    return merged.slice(0, 5);
  }

  /* ----- form → review (with duplicate check) ----- */

  async function onReview() {
    setFormErr(null);
    setMatches(null);

    if (!hasIdentifier) {
      setFormErr(
        "कम से कम एक गोंडी पहचान आवश्यक है — Gondi Devanagari, Roman Gondi या Masaram Gondi में से कोई एक भरें।"
      );
      return;
    }
    if (f.contributor_email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contributor_email.trim())) {
      setFormErr("Email मान्य नहीं है। खाली छोड़ सकते हैं।");
      return;
    }
    if (f.source_url.trim() && !/^https:\/\/[\w.-]+(:\d+)?(\/\S*)?$/i.test(f.source_url.trim())) {
      setFormErr("Source URL https:// से शुरू होना चाहिए।");
      return;
    }

    setChecking(true);
    try {
      const found = await checkDuplicates();
      if (found.length > 0) {
        setMatches(found);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    } catch {
      // duplicate check is best-effort; proceed to review
    } finally {
      setChecking(false);
    }
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ----- submit ----- */

  async function onSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setServerErr(null);
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, suggestions_used: suggestionsUsed, csrf }),
      });
      if (res.ok) {
        setStep("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json().catch(() => ({}));
        setServerErr(
          typeof data?.error === "string" && data.error.length < 200
            ? data.error
            : "Something went wrong. Your contribution was not submitted."
        );
        setStep("error");
      }
    } catch {
      setServerErr("Something went wrong. Your contribution was not submitted.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setF(EMPTY);
    setSuggested({});
    setSuggestionsUsed([]);
    setMatches(null);
    setFormErr(null);
    setServerErr(null);
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ----- review summary rows ----- */

  const allRows: Array<[string, string, boolean?]> = [
    ["Gondi Devanagari · गोंडी", f.gondi_pronunciation],
    ["Roman Gondi", f.roman_gondi],
    ["Masaram Gondi", f.masaram_gondi, true],
    ["Pronunciation · उच्चारण", f.pronunciation],
    ["Gondi Example", f.gondi_example],
    ["Dialect / Region", f.dialect],
    ["Hindi · हिन्दी", f.hindi],
    ["Roman Hindi", f.roman_hindi],
    ["Hindi Definition", f.hindi_definition],
    ["Hindi Example", f.hindi_example],
    ["Hindi Synonyms", f.hindi_synonyms],
    ["Hindi Antonyms", f.hindi_antonyms],
    ["English", f.english],
    ["English Definition", f.english_definition],
    ["English Example", f.english_example],
    ["English Synonyms", f.english_synonyms],
    ["English Antonyms", f.english_antonyms],
    ["Source Type", f.source_type],
    ["Source Name", f.source_name],
    ["Author", f.source_author],
    ["Book / Page", f.source_page],
    ["Source URL", f.source_url],
    ["Additional Notes", f.notes],
    ["Contributor Name", f.contributor_name],
  ];
  const reviewRows = allRows.filter(([, v]) => typeof v === "string" && v.trim() !== "");

  /* ============================ RENDER ============================ */

  if (step === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-earth-500/10 bg-white p-8 text-center shadow-card md:p-12">
        <CheckCircle2 size={56} aria-hidden className="mx-auto text-forest-600" />
        <h2 className="mt-4 font-english text-2xl font-bold text-forest-600">Contribution Submitted</h2>
        <p className="mt-1 font-deva text-lg text-ink-800">✓ आपका योगदान प्राप्त हुआ — धन्यवाद!</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-700/80">
          Thank you for helping improve the Masaram Gondi Dictionary. Your contribution has been
          received and will be reviewed before it can appear in the public Dictionary.
        </p>
        <p className="mt-2 font-deva text-sm text-ink-700/70">
          समीक्षा के बाद ही शब्द सार्वजनिक शब्दकोश में जोड़ा जाएगा।
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/browse"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
          >
            <ArrowLeft size={15} aria-hidden /> Back to Dictionary
          </Link>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-terracotta-600/30 px-6 py-2.5 text-sm font-semibold text-terracotta-700 transition hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
          >
            <Plus size={15} aria-hidden /> Contribute Another Word
          </button>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card md:p-8">
          <h2 className="font-english text-xl font-bold text-forest-600">Review Your Contribution</h2>
          <p className="mt-1 font-deva text-sm text-ink-700/70">
            सबमिट करने से पहले अपनी जानकारी जाँच लें।
          </p>
          <dl className="mt-5 divide-y divide-earth-500/10">
            {reviewRows.map(([label, value, masaram]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
                <dt className="font-english text-xs font-semibold uppercase tracking-wide text-ink-700/55">
                  {label}
                </dt>
                <dd
                  className={`break-words text-base text-ink-800 ${
                    masaram ? "font-gondi text-2xl leading-[1.5] text-forest-600" : "font-deva"
                  }`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          {reviewRows.length === 0 && (
            <p className="mt-4 text-sm text-ink-700/70">कोई फ़ील्ड नहीं भरी गई।</p>
          )}
          {suggestionsUsed.length > 0 && (
            <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-earth-500">
              <SuggestionChip /> mapping-derived suggestions included — admin will re-verify.
            </p>
          )}
          <p className="mt-4 rounded-2xl bg-cream-100 p-4 text-sm leading-relaxed text-ink-700/80">
            Your contribution will be stored as <strong>PENDING</strong> and reviewed before
            publication. It will <strong>not</strong> appear in the public Dictionary automatically.
          </p>
          {serverErr && (
            <p role="alert" className="mt-4 rounded-2xl bg-terracotta-500/10 p-4 text-sm font-medium text-terracotta-700">
              {serverErr}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setStep("form");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-earth-500/25 px-6 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-cream-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
            >
              <Pencil size={14} aria-hidden /> Edit
            </button>
            <button
              type="button"
              onClick={() => onSubmit()}
              disabled={submitting}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-forest-600 px-7 py-2.5 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-forest-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} aria-hidden className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} aria-hidden /> Submit Contribution
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-earth-500/10 bg-white p-8 text-center shadow-card md:p-10">
        <AlertTriangle size={48} aria-hidden className="mx-auto text-ochre-500" />
        <h2 className="mt-4 font-english text-xl font-bold text-ink-800">Submission Failed</h2>
        <p className="mt-2 text-sm text-ink-700/80">
          {serverErr ?? "Something went wrong. Your contribution was not submitted."}
        </p>
        <p className="mt-1 font-deva text-sm text-ink-700/70">आपका योगदान सेव नहीं हुआ। कृपया फिर कोशिश करें।</p>
        <button
          type="button"
          onClick={() => setStep("review")}
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ---------------- FORM STEP ---------------- */

  return (
    <form onSubmit={(e) => { e.preventDefault(); onReview(); }} noValidate className="space-y-5">
      {/* Duplicate warning */}
      {matches && (
        <div
          role="alertdialog"
          aria-label="Possible duplicate word"
          className="rounded-3xl border border-ochre-500/40 bg-ochre-500/10 p-5 md:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="flex items-center gap-2 font-deva text-base font-semibold text-earth-500">
              <AlertTriangle size={18} aria-hidden />
              यह शब्द पहले से Dictionary में मौजूद हो सकता है।
            </p>
            <button
              type="button"
              onClick={() => setMatches(null)}
              aria-label="Dismiss duplicate warning"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-earth-500 hover:bg-ochre-500/20"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
          <p className="mt-1 text-sm text-ink-700/80">This word may already exist in the dictionary:</p>
          <ul className="mt-3 space-y-2">
            {matches.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-earth-500/10 bg-white px-4 py-2.5"
              >
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-3">
                  <span className="font-gondi text-lg text-forest-600">{m.gondi_script}</span>
                  <span className="font-deva text-sm text-ink-800">{m.gondi_pronunciation}</span>
                  <span className="text-sm text-ink-700/70">
                    {m.hindi} · {m.english}
                  </span>
                </span>
                <Link
                  href={`/word/${m.id}`}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-terracotta-600/30 px-3.5 py-1.5 text-xs font-semibold text-terracotta-700 hover:bg-terracotta-500/10"
                >
                  <Eye size={13} aria-hidden /> View Existing Word
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setMatches(null);
              setStep("review");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card hover:bg-forest-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
          >
            Continue as Contribution · नया शब्द के रूप में भेजें
          </button>
        </div>
      )}

      {/* SECTION A — Gondi information */}
      <SectionCard letter="A" title="Gondi Information" titleHi="गोंडी जानकारी">
        <p className="rounded-2xl bg-cream-100 p-3.5 text-xs leading-relaxed text-ink-700/80">
          <strong className="font-english uppercase tracking-wide text-terracotta-600">
            Required · आवश्यक:
          </strong>{" "}
          at least one Gondi identifier — Gondi Devanagari <em>or</em> Roman Gondi <em>or</em>{" "}
          Masaram Gondi. Everything else is <strong>Optional</strong>. · कम से कम एक गोंडी पहचान
          आवश्यक है, बाकी सब वैकल्पिक। Roman Gondi और Roman Hindi अलग-अलग हैं — कृपया मिलाएँ नहीं।
        </p>

        <Field label="Gondi Devanagari" labelHi="गोंडी (देवनागरी)" optionalNote="any one identifier required">
          <input
            value={f.gondi_pronunciation}
            onChange={(e) => set("gondi_pronunciation", e.target.value)}
            maxLength={200}
            placeholder="तल्ला"
            className={`${inputCls} font-deva`}
          />
          <GondiKeyboard value={f.gondi_pronunciation} onChange={(v) => set("gondi_pronunciation", v)} lockMode="devanagari" className="mt-2" />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Roman Gondi"
            optionalNote="any one identifier required"
            hint="Roman spelling of the GONDI word — not the Hindi word. Example: तल्ला → talla."
          >
            <input
              value={f.roman_gondi}
              onChange={(e) => set("roman_gondi", e.target.value)}
              maxLength={200}
              placeholder="talla"
              className={`${inputCls} font-english`}
            />
            {suggested.roman_gondi && <span className="mt-1.5 block"><SuggestionChip /></span>}
            <SuggestButton
              label="Suggest from Gondi Devanagari"
              onClick={suggestRomanGondi}
              disabled={!f.gondi_pronunciation.trim() || !!f.roman_gondi.trim()}
            />
          </Field>

          <Field
            label="Masaram Gondi Script"
            labelHi="मसराम गोंडी"
            optionalNote="any one identifier required"
            hint="Typed Masaram Unicode is preserved exactly as submitted."
          >
            <input
              value={f.masaram_gondi}
              onChange={(e) => set("masaram_gondi", e.target.value)}
              maxLength={200}
              className={`${inputCls} font-gondi text-xl leading-[1.5]`}
            />
            {suggested.masaram_gondi && <span className="mt-1.5 block"><SuggestionChip /></span>}
            <SuggestButton
              label="Suggest from Gondi Devanagari"
              onClick={suggestMasaram}
              disabled={!f.gondi_pronunciation.trim() || !!f.masaram_gondi.trim()}
            />
            <GondiKeyboard value={f.masaram_gondi} onChange={(v) => set("masaram_gondi", v)} lockMode="masaram" className="mt-2" />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Pronunciation" labelHi="उच्चारण">
            <input
              value={f.pronunciation}
              onChange={(e) => set("pronunciation", e.target.value)}
              maxLength={200}
              className={`${inputCls} font-deva`}
            />
          </Field>
          <Field label="Dialect / Region" labelHi="बोली / क्षेत्र">
            <input
              value={f.dialect}
              onChange={(e) => set("dialect", e.target.value)}
              maxLength={120}
              placeholder="e.g. Dorli / Balaghat"
              className={inputCls}
            />
          </Field>
        </div>

        <Field
          label="Gondi Example"
          optionalNote="Author verification required"
          hint="केवल वही वाक्य दें जो किसी विश्वसनीय स्रोत में लिखा हो। गोंडी वाक्य यहाँ कभी स्वतः नहीं बनाए जाते।"
        >
          <textarea
            value={f.gondi_example}
            onChange={(e) => set("gondi_example", e.target.value)}
            maxLength={400}
            rows={2}
            className={`${inputCls} font-deva`}
          />
        </Field>
      </SectionCard>

      {/* SECTION B — Hindi information */}
      <SectionCard letter="B" title="Hindi Information" titleHi="हिन्दी जानकारी">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Hindi Word" labelHi="हिन्दी शब्द">
            <input
              value={f.hindi}
              onChange={(e) => set("hindi", e.target.value)}
              maxLength={200}
              placeholder="सिर"
              className={`${inputCls} font-deva`}
            />
          </Field>
          <Field label="Roman Hindi" hint="Roman spelling of the HINDI word — e.g. सिर → Sir.">
            <input
              value={f.roman_hindi}
              onChange={(e) => set("roman_hindi", e.target.value)}
              maxLength={200}
              placeholder="Sir"
              className={`${inputCls} font-english`}
            />
            {suggested.roman_hindi && <span className="mt-1.5 block"><SuggestionChip /></span>}
            <SuggestButton
              label="Suggest from Hindi"
              onClick={suggestRomanHindi}
              disabled={!f.hindi.trim() || !!f.roman_hindi.trim()}
            />
          </Field>
        </div>
        <Field label="Hindi Definition" labelHi="हिन्दी अर्थ">
          <textarea
            value={f.hindi_definition}
            onChange={(e) => set("hindi_definition", e.target.value)}
            maxLength={500}
            rows={2}
            className={`${inputCls} font-deva`}
          />
        </Field>
        <Field
          label="Hindi Example"
          hint="उदाहरण सुझाव हो सकते हैं — समीक्षा के बाद ही प्रकाशित होंगे।"
        >
          <textarea
            value={f.hindi_example}
            onChange={(e) => set("hindi_example", e.target.value)}
            maxLength={400}
            rows={2}
            placeholder="मेरे सिर में दर्द हो रहा है।"
            className={`${inputCls} font-deva`}
          />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Hindi Synonyms" labelHi="पर्यायवाची">
            <input
              value={f.hindi_synonyms}
              onChange={(e) => set("hindi_synonyms", e.target.value)}
              maxLength={300}
              className={`${inputCls} font-deva`}
            />
          </Field>
          <Field label="Hindi Antonyms" labelHi="विलोम">
            <input
              value={f.hindi_antonyms}
              onChange={(e) => set("hindi_antonyms", e.target.value)}
              maxLength={300}
              className={`${inputCls} font-deva`}
            />
          </Field>
        </div>
      </SectionCard>

      {/* SECTION C — English information */}
      <SectionCard letter="C" title="English Information" titleHi="अंग्रेज़ी जानकारी">
        <Field label="English Word">
          <input
            value={f.english}
            onChange={(e) => set("english", e.target.value)}
            maxLength={200}
            placeholder="Head"
            className={`${inputCls} font-english`}
          />
        </Field>
        <Field label="English Definition">
          <textarea
            value={f.english_definition}
            onChange={(e) => set("english_definition", e.target.value)}
            maxLength={500}
            rows={2}
            className={`${inputCls} font-english`}
          />
        </Field>
        <Field label="English Example">
          <textarea
            value={f.english_example}
            onChange={(e) => set("english_example", e.target.value)}
            maxLength={400}
            rows={2}
            placeholder="My head is hurting."
            className={`${inputCls} font-english`}
          />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="English Synonyms">
            <input
              value={f.english_synonyms}
              onChange={(e) => set("english_synonyms", e.target.value)}
              maxLength={300}
              className={`${inputCls} font-english`}
            />
          </Field>
          <Field label="English Antonyms">
            <input
              value={f.english_antonyms}
              onChange={(e) => set("english_antonyms", e.target.value)}
              maxLength={300}
              className={`${inputCls} font-english`}
            />
          </Field>
        </div>
      </SectionCard>

      {/* SECTION D — Source / reference */}
      <SectionCard letter="D" title="Source / Reference" titleHi="स्रोत / संदर्भ">
        <p className="rounded-2xl bg-cream-100 p-3.5 text-xs leading-relaxed text-ink-700/80">
          Never fabricate a book, author, page or URL — a reference to a book is enough. If you have
          no source, leave these blank; the submission can still be accepted. · स्रोत न होने पर खाली
          छोड़ें — योगदान फिर भी स्वीकार किया जा सकता है।
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Source Type">
            <select
              value={f.source_type}
              onChange={(e) => set("source_type", e.target.value)}
              className={inputCls}
            >
              <option value="">— Select —</option>
              <option value="book">Book · पुस्तक</option>
              <option value="pdf">PDF</option>
              <option value="author">Author · लेखक</option>
              <option value="website">Website · वेबसाइट</option>
              <option value="academic">Academic Reference · शैक्षणिक</option>
              <option value="community">Community Source · सामुदायिक</option>
              <option value="other">Other · अन्य</option>
            </select>
          </Field>
          <Field label="Source Name">
            <input
              value={f.source_name}
              onChange={(e) => set("source_name", e.target.value)}
              maxLength={200}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Author" labelHi="लेखक">
            <input
              value={f.source_author}
              onChange={(e) => set("source_author", e.target.value)}
              maxLength={120}
              className={inputCls}
            />
          </Field>
          <Field label="Book / Page" labelHi="पुस्तक / पृष्ठ">
            <input
              value={f.source_page}
              onChange={(e) => set("source_page", e.target.value)}
              maxLength={40}
              placeholder="e.g. 42"
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Source URL" hint="Only https:// links are accepted.">
          <input
            value={f.source_url}
            onChange={(e) => set("source_url", e.target.value)}
            maxLength={500}
            inputMode="url"
            placeholder="https://…"
            className={`${inputCls} font-english`}
          />
        </Field>
        <Field label="Additional Notes" labelHi="अतिरिक्त टिप्पणी">
          <textarea
            value={f.notes}
            onChange={(e) => set("notes", e.target.value)}
            maxLength={500}
            rows={3}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      {/* SECTION E — Contributor */}
      <SectionCard letter="E" title="Contributor" titleHi="योगदानकर्ता">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Contributor Name" labelHi="नाम">
            <input
              value={f.contributor_name}
              onChange={(e) => set("contributor_name", e.target.value)}
              maxLength={80}
              className={inputCls}
            />
          </Field>
          <Field
            label="Contributor Email"
            hint="Private — कभी सार्वजनिक नहीं दिखाया जाएगा।"
          >
            <input
              value={f.contributor_email}
              onChange={(e) => set("contributor_email", e.target.value)}
              maxLength={120}
              inputMode="email"
              autoComplete="email"
              className={`${inputCls} font-english`}
            />
          </Field>
        </div>
        {/* Honeypot — hidden from humans and assistive tech */}
        <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={f.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </label>
        </div>
      </SectionCard>

      {formErr && (
        <p role="alert" className="rounded-2xl bg-terracotta-500/10 p-4 text-sm font-medium text-terracotta-700">
          {formErr}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-700/60">
          सुधार करना चाहते हैं?{" "}
          <Link href="/report" className="inline-flex items-center gap-1 font-semibold text-terracotta-500 underline underline-offset-2">
            <Flag size={12} aria-hidden /> Report an Error Instead
          </Link>
        </p>
        <button
          type="submit"
          disabled={checking}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-terracotta-500 px-8 py-3 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? (
            <>
              <Loader2 size={16} aria-hidden className="animate-spin" /> Checking dictionary…
            </>
          ) : (
            <>
              <Eye size={16} aria-hidden /> Review Contribution · समीक्षा करें
            </>
          )}
        </button>
      </div>
    </form>
  );
}
