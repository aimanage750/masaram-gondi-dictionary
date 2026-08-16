"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  Flag,
  Loader2,
} from "lucide-react";

export interface ReportedWord {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  hindi: string;
  english: string;
}

const ERROR_TYPE_OPTIONS: Array<{ code: string; en: string; hi: string }> = [
  { code: "gondi_word", en: "Incorrect Gondi Word", hi: "गलत गोंडी शब्द" },
  { code: "roman_gondi", en: "Incorrect Roman Gondi", hi: "गलत रोमन गोंडी" },
  { code: "masaram_gondi", en: "Incorrect Masaram Gondi Script", hi: "गलत मसराम गोंडी लिपि" },
  { code: "hindi_word", en: "Incorrect Hindi Word", hi: "गलत हिन्दी शब्द" },
  { code: "english_word", en: "Incorrect English Word", hi: "गलत अंग्रेज़ी शब्द" },
  { code: "hindi_meaning", en: "Incorrect Hindi Meaning", hi: "गलत हिन्दी अर्थ" },
  { code: "english_meaning", en: "Incorrect English Meaning", hi: "गलत अंग्रेज़ी अर्थ" },
  { code: "pronunciation", en: "Incorrect Pronunciation", hi: "गलत उच्चारण" },
  { code: "hindi_example", en: "Incorrect Hindi Example", hi: "गलत हिन्दी उदाहरण" },
  { code: "english_example", en: "Incorrect English Example", hi: "गलत अंग्रेज़ी उदाहरण" },
  { code: "gondi_example", en: "Incorrect Gondi Example", hi: "गलत गोंडी उदाहरण" },
  { code: "source", en: "Incorrect Source", hi: "गलत स्रोत" },
  { code: "typo", en: "Typographical Error", hi: "टाइपोग्राफ़िकल गलती" },
  { code: "duplicate", en: "Duplicate Word", hi: "डुप्लिकेट शब्द" },
  { code: "other", en: "Other", hi: "अन्य" },
];

const CORRECTION_FIELDS: Array<{ key: string; label: string; font?: string }> = [
  { key: "correct_gondi_devanagari", label: "Correct Gondi Devanagari", font: "font-deva" },
  { key: "correct_roman_gondi", label: "Correct Roman Gondi", font: "font-english" },
  { key: "correct_masaram_gondi", label: "Correct Masaram Gondi", font: "font-gondi" },
  { key: "correct_hindi", label: "Correct Hindi", font: "font-deva" },
  { key: "correct_english", label: "Correct English", font: "font-english" },
  { key: "correct_pronunciation", label: "Correct Pronunciation", font: "font-deva" },
  { key: "correct_hindi_definition", label: "Correct Hindi Definition", font: "font-deva" },
  { key: "correct_english_definition", label: "Correct English Definition", font: "font-english" },
  { key: "correct_hindi_example", label: "Correct Hindi Example", font: "font-deva" },
  { key: "correct_english_example", label: "Correct English Example", font: "font-english" },
  { key: "correct_gondi_example", label: "Correct Gondi Example", font: "font-deva" },
];

const inputCls =
  "mt-1.5 w-full rounded-xl border border-earth-500/20 bg-white px-3.5 py-2.5 text-base text-ink-800 outline-none transition focus:border-ochre-500 focus:ring-2 focus:ring-ochre-500/30";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-7">
      {children}
    </section>
  );
}

function CardTitle({ en, hi }: { en: string; hi?: string }) {
  return (
    <h2 className="font-english text-base font-bold text-forest-600">
      {en}
      {hi ? <span className="ml-2 font-deva text-sm font-normal text-ink-700/60">· {hi}</span> : null}
    </h2>
  );
}

export function ReportForm({ word }: { word: ReportedWord | null }) {
  const [csrf, setCsrf] = useState("");
  const [errorTypes, setErrorTypes] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [suggested, setSuggested] = useState("");
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const [sourceType, setSourceType] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceAuthor, setSourceAuthor] = useState("");
  const [sourcePage, setSourcePage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [evidence, setEvidence] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [step, setStep] = useState<"form" | "success" | "error">("form");
  const [formErr, setFormErr] = useState<string | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [dupWarning, setDupWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  function toggleType(code: string) {
    setErrorTypes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  function validate(): string | null {
    if (errorTypes.length === 0) return "कृपया चुनें कि क्या गलत है (What is wrong?) — कम से कम एक विकल्प।";
    if (!description.trim()) return "कृपया समस्या का विवरण लिखें (Describe the problem).";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Email मान्य नहीं है। खाली छोड़ सकते हैं।";
    if (sourceUrl.trim() && !/^https:\/\/[\w.-]+(:\d+)?(\/\S*)?$/i.test(sourceUrl.trim()))
      return "Source URL https:// से शुरू होना चाहिए।";
    return null;
  }

  async function submit(force: boolean) {
    if (submitting) return;
    const v = validate();
    if (v) {
      setFormErr(v);
      return;
    }
    setFormErr(null);

    // Duplicate-report notice (does not block legitimate reports).
    if (!force && word) {
      try {
        const res = await fetch(`/api/reports/check?word=${encodeURIComponent(word.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.open === "number" && data.open > 0) {
            setDupWarning(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
        }
      } catch {
        // best-effort; continue with submission
      }
    }

    setSubmitting(true);
    setServerErr(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dictionary_entry_id: word?.id ?? "",
          error_types: errorTypes,
          description,
          suggested_correction: suggested,
          ...corrections,
          source_type: sourceType,
          source_name: sourceName,
          source_author: sourceAuthor,
          source_page: sourcePage,
          source_url: sourceUrl,
          evidence,
          reporter_name: name,
          reporter_email: email,
          website,
          csrf,
        }),
      });
      if (res.ok) {
        setStep("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json().catch(() => ({}));
        setServerErr(
          typeof data?.error === "string" && data.error.length < 200
            ? data.error
            : "Something went wrong. Your report could not be submitted."
        );
        setStep("error");
      }
    } catch {
      setServerErr("Something went wrong. Your report could not be submitted.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit(false);
  }

  function resetAll() {
    setErrorTypes([]);
    setDescription("");
    setSuggested("");
    setCorrections({});
    setSourceType("");
    setSourceName("");
    setSourceAuthor("");
    setSourcePage("");
    setSourceUrl("");
    setEvidence("");
    setName("");
    setEmail("");
    setFormErr(null);
    setServerErr(null);
    setDupWarning(false);
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------ SUCCESS ------------------------------ */
  if (step === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-earth-500/10 bg-white p-8 text-center shadow-card md:p-12">
        <CheckCircle2 size={56} aria-hidden className="mx-auto text-forest-600" />
        <h2 className="mt-4 font-english text-2xl font-bold text-forest-600">Report Submitted</h2>
        <p className="mt-1 font-deva text-lg text-ink-800">✓ आपकी रिपोर्ट प्राप्त हुई — धन्यवाद!</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-700/80">
          Thank you for helping improve the Masaram Gondi Dictionary. Your report has been
          received and will be reviewed.
        </p>
        <p className="mt-2 font-deva text-sm text-ink-700/70">
          रिपोर्ट की समीक्षा के बाद ही कोई सुधार किया जाएगा — शब्दकोश स्वतः नहीं बदलता।
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
            <Flag size={14} aria-hidden /> Report Another Error
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------ ERROR ------------------------------ */
  if (step === "error") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-earth-500/10 bg-white p-8 text-center shadow-card md:p-10">
        <AlertTriangle size={48} aria-hidden className="mx-auto text-ochre-500" />
        <h2 className="mt-4 font-english text-xl font-bold text-ink-800">Submission Failed</h2>
        <p className="mt-2 text-sm text-ink-700/80">
          {serverErr ?? "Something went wrong. Your report could not be submitted."}
        </p>
        <p className="mt-1 font-deva text-sm text-ink-700/70">
          आपकी रिपोर्ट नहीं भेजी जा सकी। कृपया फिर कोशिश करें।
        </p>
        <button
          type="button"
          onClick={() => setStep("form")}
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ------------------------------ FORM ------------------------------ */
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Duplicate notice */}
      {dupWarning && word && (
        <div
          role="alertdialog"
          aria-label="Possible duplicate report"
          className="rounded-3xl border border-ochre-500/40 bg-ochre-500/10 p-5 md:p-6"
        >
          <p className="flex items-center gap-2 font-deva text-base font-semibold text-earth-500">
            <AlertTriangle size={18} aria-hidden />
            This issue may already have been reported. · यह समस्या पहले ही रिपोर्ट की जा चुकी हो सकती है।
          </p>
          <p className="mt-1 text-sm text-ink-700/80">
            You can still submit your report — additional detail helps the review.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/word/${word.id}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-terracotta-600/30 px-5 py-2 text-sm font-semibold text-terracotta-700 hover:bg-terracotta-500/10"
            >
              <Eye size={14} aria-hidden /> View Word
            </Link>
            <button
              type="button"
              onClick={() => {
                setDupWarning(false);
                submit(true);
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-forest-600 px-5 py-2 text-sm font-semibold text-cream-50 shadow-card hover:bg-forest-500"
            >
              Continue Report · फिर भी भेजें
            </button>
          </div>
        </div>
      )}

      {/* Word being reported — real data from the database */}
      {word && (
        <Card>
          <p className="font-english text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-500">
            Word Being Reported · जिस शब्द की रिपोर्ट हो रही है
          </p>
          <p className="mt-3 font-gondi text-4xl leading-[1.4] text-forest-600 md:text-5xl">
            {word.gondi_script}
          </p>
          <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-3 border-t border-earth-500/10 pt-2">
              <dt className="text-ink-700/60">Gondi</dt>
              <dd className="font-deva font-medium text-ink-800">{word.gondi_pronunciation}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-earth-500/10 pt-2">
              <dt className="text-ink-700/60">Roman Gondi</dt>
              <dd className="font-english font-medium text-ink-800">{word.roman_gondi}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-earth-500/10 pt-2">
              <dt className="text-ink-700/60">Hindi</dt>
              <dd className="font-deva font-medium text-ink-800">{word.hindi}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-earth-500/10 pt-2">
              <dt className="text-ink-700/60">English</dt>
              <dd className="font-english font-medium text-ink-800">{word.english}</dd>
            </div>
          </dl>
        </Card>
      )}

      {/* Error type */}
      <Card>
        <CardTitle en="What is wrong?" hi="क्या गलत है?" />
        <p className="mt-1 text-xs text-ink-700/60">
          Select one or more. · एक या अधिक चुनें। <span className="font-semibold text-terracotta-600">Required · आवश्यक</span>
        </p>
        <fieldset className="mt-4">
          <legend className="sr-only">Error types</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ERROR_TYPE_OPTIONS.map((opt) => {
              const checked = errorTypes.includes(opt.code);
              return (
                <label
                  key={opt.code}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-ochre-500/40 ${
                    checked
                      ? "border-ochre-500 bg-ochre-500/10 text-earth-500"
                      : "border-earth-500/15 bg-white text-ink-800 hover:border-ochre-500/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleType(opt.code)}
                    className="h-4 w-4 shrink-0 accent-ochre-500"
                  />
                  <span>
                    {opt.en}
                    <span className="block font-deva text-xs text-ink-700/60">{opt.hi}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Card>

      {/* Description */}
      <Card>
        <label className="block text-sm font-medium text-ink-800">
          <span className="flex flex-wrap items-center gap-2">
            Describe the problem · समस्या का विवरण
            <span className="rounded-full bg-terracotta-500/10 px-2 py-0.5 font-english text-[10px] font-semibold uppercase tracking-wide text-terracotta-600">
              Required · आवश्यक
            </span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Explain what you think is incorrect…"
            aria-describedby="desc-hint"
            className={`${inputCls} font-deva`}
          />
        </label>
        <p id="desc-hint" className="mt-1 text-xs text-ink-700/60">
          Example: “Roman Gondi spelling appears incorrect.” · जैसे: “रोमन गोंडी स्पेलिंग गलत लग रही है।”
        </p>

        <label className="mt-5 block text-sm font-medium text-ink-800">
          Suggested Correction · सुझाया गया सुधार
          <span className="ml-2 rounded-full bg-ink-700/5 px-2 py-0.5 font-english text-[10px] font-semibold uppercase tracking-wide text-ink-700/55">
            Optional
          </span>
          <textarea
            value={suggested}
            onChange={(e) => setSuggested(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder={"Current: तल्ला\nSuggested: …"}
            className={`${inputCls} font-deva`}
          />
        </label>
        <p className="mt-1 text-xs text-ink-700/60">
          सुझाव केवल समीक्षा के लिए सेव होते हैं — शब्दकोश स्वतः नहीं बदलता। Suggestions are stored
          as USER SUGGESTION only.
        </p>
      </Card>

      {/* Specific correction fields */}
      <Card>
        <CardTitle en="Specific Corrections" hi="विशिष्ट सुधार" />
        <p className="mt-1 text-xs text-ink-700/60">
          All optional — fill only what you are sure about. · सभी वैकल्पिक।
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {CORRECTION_FIELDS.map((cf) => (
            <label key={cf.key} className="block text-sm font-medium text-ink-800">
              {cf.label}
              <input
                value={corrections[cf.key] ?? ""}
                onChange={(e) => setCorrections((c) => ({ ...c, [cf.key]: e.target.value }))}
                maxLength={cf.key.includes("definition") ? 500 : cf.key.includes("example") ? 400 : 200}
                className={`${inputCls} ${cf.font ?? ""}`}
              />
            </label>
          ))}
        </div>
      </Card>

      {/* Source / evidence */}
      <Card>
        <CardTitle en="Source / Evidence" hi="स्रोत / प्रमाण" />
        <p className="mt-1 text-xs text-ink-700/60">
          Optional — never fabricate a source. If you have none, leave this blank. · वैकल्पिक —
          स्रोत न हो तो खाली छोड़ें।
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-ink-800">
            Source Type
            <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className={inputCls}>
              <option value="">— Select —</option>
              <option value="book">Book · पुस्तक</option>
              <option value="pdf">PDF</option>
              <option value="website">Website · वेबसाइट</option>
              <option value="academic">Academic Reference · शैक्षणिक</option>
              <option value="author">Author · लेखक</option>
              <option value="community">Community Source · सामुदायिक</option>
              <option value="other">Other · अन्य</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-ink-800">
            Source Name
            <input value={sourceName} onChange={(e) => setSourceName(e.target.value)} maxLength={200} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-ink-800">
            Author · लेखक
            <input value={sourceAuthor} onChange={(e) => setSourceAuthor(e.target.value)} maxLength={120} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-ink-800">
            Page · पृष्ठ
            <input value={sourcePage} onChange={(e) => setSourcePage(e.target.value)} maxLength={40} className={inputCls} />
          </label>
        </div>
        <label className="mt-4 block text-sm font-medium text-ink-800">
          URL
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            maxLength={500}
            inputMode="url"
            placeholder="https://…"
            className={`${inputCls} font-english`}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-ink-800">
          Additional Evidence · अतिरिक्त प्रमाण
          <textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} maxLength={800} rows={3} className={inputCls} />
        </label>
      </Card>

      {/* Reporter */}
      <Card>
        <CardTitle en="Your Information" hi="आपकी जानकारी" />
        <p className="mt-1 text-xs text-ink-700/60">
          Email is optional and will not be displayed publicly. · ईमेल वैकल्पिक है और कभी सार्वजनिक
          नहीं दिखाया जाएगा।
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-ink-800">
            Name · नाम
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className={inputCls} />
          </label>
          <label className="block text-sm font-medium text-ink-800">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={120}
              inputMode="email"
              autoComplete="email"
              className={`${inputCls} font-english`}
            />
          </label>
        </div>
        {/* Honeypot */}
        <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>
      </Card>

      {formErr && (
        <p role="alert" className="rounded-2xl bg-terracotta-500/10 p-4 text-sm font-medium text-terracotta-700">
          {formErr}
        </p>
      )}
      {serverErr && step === "form" && (
        <p role="alert" className="rounded-2xl bg-terracotta-500/10 p-4 text-sm font-medium text-terracotta-700">
          {serverErr}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 px-8 py-3 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 size={16} aria-hidden className="animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Flag size={15} aria-hidden /> Submit Report · रिपोर्ट भेजें
          </>
        )}
      </button>
    </form>
  );
}
