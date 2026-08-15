"use client";

import { FormEvent, useEffect, useState } from "react";
import { Flag } from "lucide-react";

/**
 * Report an Error — reuses the existing /api/contribute pipeline
 * (no new backend). The report is stored as a pending contribution
 * clearly marked "ERROR REPORT".
 */
export default function ReportPage() {
  const [csrf, setCsrf] = useState("");
  const [gondi, setGondi] = useState("");
  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const res = await fetch("/api/contribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gondi_pronunciation: gondi,
        hindi,
        english,
        notes: `ERROR REPORT: ${problem}`,
        contributor_name: name,
        csrf,
      }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error ?? "भेजा नहीं जा सका");
    else {
      setMsg("धन्यवाद! आपकी रिपोर्ट समीक्षा के लिए भेज दी गई है।");
      setGondi("");
      setHindi("");
      setEnglish("");
      setProblem("");
    }
  }

  const input =
    "mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2.5 text-ink-800 outline-none focus:ring-2 focus:ring-terracotta-500/40";

  return (
    <div className="mx-auto max-w-xl px-4 py-10 md:py-14">
      <header className="text-center">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta-500">
          <Flag size={13} aria-hidden /> Report an Error
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-forest-600">
          गलती बताएँ · सुधार में मदद करें
        </h1>
        <p className="mt-3 font-deva text-sm leading-relaxed text-ink-700">
          यदि किसी शब्द की वर्तनी, अर्थ या लिपि में कोई गलती दिखे तो यहाँ बताएँ। रिपोर्ट
          समीक्षा के बाद ही प्रकाशित होती है।
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-3xl border border-earth-500/10 bg-white p-6 text-ink-800 shadow-card"
      >
        <label className="block text-sm font-medium">
          शब्द (गोंडी उच्चारण) · Word
          <input required value={gondi} onChange={(e) => setGondi(e.target.value)} className={`${input} font-deva`} placeholder="जैसे: तल्ला" />
        </label>
        <label className="block text-sm font-medium">
          Hindi अर्थ
          <input required value={hindi} onChange={(e) => setHindi(e.target.value)} className={`${input} font-deva`} placeholder="जैसे: सिर" />
        </label>
        <label className="block text-sm font-medium">
          English meaning
          <input required value={english} onChange={(e) => setEnglish(e.target.value)} className={input} placeholder="e.g. Head" />
        </label>
        <label className="block text-sm font-medium">
          गलती का विवरण · What is wrong?
          <textarea
            required
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={4}
            className={`${input} font-deva`}
            placeholder="जैसे: मसराम लिपि में मात्रा गलत दिख रही है / अर्थ सही नहीं है…"
          />
        </label>
        <label className="block text-sm font-medium">
          आपका नाम (optional)
          <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </label>

        {err && <p className="text-sm text-terracotta-600">{err}</p>}
        {msg && <p className="font-deva text-sm text-forest-600">{msg}</p>}

        <button
          type="submit"
          className="min-h-[44px] w-full rounded-xl bg-terracotta-500 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          रिपोर्ट भेजें · Submit report
        </button>
      </form>
    </div>
  );
}
