"use client";

import { FormEvent, useEffect, useState } from "react";
import { GondiKeyboard } from "@/components/GondiKeyboard";

export default function ContributePage() {
  const [csrf, setCsrf] = useState("");
  const [gondi, setGondi] = useState("");
  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");
  const [notes, setNotes] = useState("");
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
        notes,
        contributor_name: name,
        csrf,
      }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error ?? "Could not submit");
    else {
      setMsg("धन्यवाद। आपका सुझाव समीक्षा के लिए भेज दिया गया है।");
      setGondi("");
      setHindi("");
      setEnglish("");
      setNotes("");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-3xl text-cream-50">Contribute a word · योगदान</h1>
      <p className="mt-2 font-deva text-cream-200/80">
        केवल वही गोंडी शब्द भेजें जो किसी स्रोत में लिखा हो। अनुमान से शब्द न बनाएँ।
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-3xl border border-ochre-500/25 bg-cream-50 p-5 text-ink-800 shadow-card md:p-6">
        <label className="block text-sm">
          Gondi Pronunciation
          <input
            required
            value={gondi}
            onChange={(e) => setGondi(e.target.value)}
            className="mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2 font-deva"
          />
        </label>
        <GondiKeyboard value={gondi} onChange={setGondi} />
        <label className="block text-sm">
          Hindi
          <input
            required
            value={hindi}
            onChange={(e) => setHindi(e.target.value)}
            className="mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2 font-deva"
          />
        </label>
        <label className="block text-sm">
          English
          <input
            required
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            className="mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Source / notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Your name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-terracotta-500/30 bg-white px-3 py-2"
          />
        </label>
        {err && <p className="text-sm text-terracotta-600">{err}</p>}
        {msg && <p className="text-sm text-forest-600">{msg}</p>}
        <button className="rounded-xl bg-forest-500 px-5 py-2 text-cream-50">Submit for review</button>
      </form>
    </div>
  );
}
