"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Copy, Eraser, Loader2 } from "lucide-react";
import type { PublicEntry } from "@/lib/types";
import { normalizeSearch } from "@/lib/mapping/romanize";
import { copyText, codePointLength } from "@/lib/converter/utils";
import { GondiScript } from "@/components/GondiScript";

type From = "hindi" | "english" | "gondi";

function toLabel(from: From) {
  return from === "gondi" ? "Hindi + English" : "Masaram Gondi";
}

function score(e: PublicEntry, from: From, q: string): number {
  const nq = normalizeSearch(q);
  if (!nq) return 0;
  const vals =
    from === "hindi"
      ? [e.hindi]
      : from === "english"
        ? [e.english]
        : [e.gondi_script, e.gondi_pronunciation];
  let best = 0;
  for (const raw of vals) {
    const v = normalizeSearch(raw);
    if (!v) continue;
    if (v === nq) best = Math.max(best, 100);
    else if (v.startsWith(nq)) best = Math.max(best, 80);
    else if (v.includes(nq)) best = Math.max(best, 45);
    // english multi-word token match
    if (from === "english") {
      for (const t of v.split(/\s+/)) {
        if (t === nq) best = Math.max(best, 90);
        else if (t.startsWith(nq) && nq.length >= 3) best = Math.max(best, 60);
      }
    }
  }
  return best;
}

export function TranslatorClient() {
  const [entries, setEntries] = useState<PublicEntry[] | null>(null);
  const [from, setFrom] = useState<From>("hindi");
  const [text, setText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/dictionary")
      .then((r) => r.json())
      .then((d) => alive && setEntries(d.entries ?? []))
      .catch(() => alive && setEntries([]));
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    const q = text.trim();
    if (!entries || !q || q.length < 1) return [];
    return entries
      .map((e) => ({ e, s: score(e, from, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.e);
  }, [entries, from, text]);

  function show(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  }

  async function copy(s: string) {
    show((await copyText(s)) ? "कॉपी हो गया ✓" : "कॉपी नहीं हो सका");
  }

  function swap() {
    setFrom((f) => (f === "gondi" ? "hindi" : "gondi"));
  }

  const placeholder =
    from === "hindi"
      ? "हिन्दी शब्द लिखें… जैसे: सिर, पानी"
      : from === "english"
        ? "Type an English word… e.g. head, water"
        : "मसराम गोंडी या उच्चारण लिखें…";

  return (
    <div className="relative">
      {/* language selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        <label className="flex items-center gap-2 rounded-2xl border border-earth-500/15 bg-white px-4 py-2.5 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">From</span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as From)}
            className="bg-transparent font-deva text-sm font-medium text-ink-800 outline-none"
            aria-label="Source language"
          >
            <option value="hindi">हिन्दी</option>
            <option value="english">English</option>
            <option value="gondi">गोंडी (Masaram/उच्चारण)</option>
          </select>
        </label>

        <button
          type="button"
          onClick={swap}
          aria-label="भाषाएँ बदलें (swap)"
          className="grid h-11 w-11 place-items-center rounded-full bg-terracotta-500 text-cream-50 shadow-card transition hover:rotate-180 hover:bg-terracotta-600"
        >
          <ArrowLeftRight size={18} aria-hidden />
        </button>

        <div className="flex items-center gap-2 rounded-2xl border border-earth-500/15 bg-cream-200/70 px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-700/60">To</span>
          <span className="font-deva text-sm font-medium text-forest-600">{toLabel(from)}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* input */}
        <div className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
          <label htmlFor="tr-in" className="text-xs font-semibold uppercase tracking-[0.08em] text-terracotta-500">
            {from === "hindi" ? "हिन्दी लिखें" : from === "english" ? "Type in English" : "गोंडी लिखें"}
          </label>
          <textarea
            id="tr-in"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className={`mt-2 min-h-[140px] w-full resize-y rounded-2xl border border-earth-500/15 bg-cream-50 px-4 py-3 text-xl text-ink-800 outline-none focus:ring-2 focus:ring-terracotta-500/40 ${
              from === "english" ? "" : "font-deva"
            } ${from === "gondi" ? "font-gondi" : ""}`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setText("");
                show("साफ़ हो गया");
              }}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-terracotta-500/30 px-4 py-2 text-sm font-medium text-terracotta-600 hover:bg-terracotta-500/10"
            >
              <Eraser size={14} aria-hidden /> साफ़ (Clear)
            </button>
            <span className="ml-auto text-xs text-ink-700/60">{codePointLength(text)} अक्षर</span>
          </div>
        </div>

        {/* output */}
        <div className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-forest-600">
            Translation · {toLabel(from)}
          </p>
          {entries === null ? (
            <p className="mt-6 flex items-center gap-2 text-sm text-ink-700/70">
              <Loader2 size={16} className="animate-spin" aria-hidden /> शब्दकोश लोड हो रहा है…
            </p>
          ) : results.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-cream-100 p-5 text-center">
              <p className="font-deva text-ink-800">
                {text.trim() ? "कोश में इसका अनुवाद नहीं मिला।" : "अनुवाद यहाँ दिखेगा।"}
              </p>
              <p className="mt-1 text-xs text-ink-700/70">
                केवल अपलोड की गई पुस्तक के शब्द — अनुमान से कुछ नहीं।{" "}
                <a href="/contribute" className="text-terracotta-500 underline underline-offset-2">
                  शब्द सुझाएँ
                </a>
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {results.map((e) => (
                <li key={e.id} className="rounded-2xl border border-earth-500/10 bg-cream-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <GondiScript text={e.gondi_script} className="text-3xl text-forest-600" />
                      <p className="mt-2 font-deva text-lg text-ink-800">
                        {e.gondi_pronunciation}
                        <span className="mx-2 text-ink-700/50">·</span>
                        {e.hindi}
                        <span className="mx-2 text-ink-700/50">·</span>
                        <span className="text-ink-700">{e.english}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(from === "gondi" ? `${e.hindi} — ${e.english}` : e.gondi_script)}
                      aria-label="अनुवाद कॉपी करें"
                      className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl bg-terracotta-500 px-3.5 py-2 text-sm font-medium text-cream-50 hover:bg-terracotta-600"
                    >
                      <Copy size={14} aria-hidden /> कॉपी
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-700/70">
        अनुवाद अपलोड की गई पुस्तक <em>गोंडी करीयाट</em> के शब्दकोश-डेटा से मिलते हैं — machine
        translation नहीं।
      </p>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-sm text-cream-50 transition-opacity ${
          toast ? "opacity-100" : "opacity-0"
        }`}
      >
        {toast ?? ""}
      </div>
    </div>
  );
}
