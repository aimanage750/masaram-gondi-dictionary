"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Copy,
  Flag,
  Share2,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { GondiScript } from "@/components/GondiScript";
import { copyText, shareText } from "@/lib/converter/utils";

export interface WordDetailData {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  roman_hindi: string;
  hindi: string;
  english: string;
  category?: string;
  category_hi?: string;
  source?: string;
  source_page?: string | null;
  verified?: boolean;
}

export interface RelatedWord {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  hindi: string;
}

function speak(text: string, lang = "hi-IN") {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-english text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-500">
      {children}
    </h2>
  );
}

function FormRow({
  label,
  value,
  kind,
  onCopy,
}: {
  label: string;
  value: string;
  kind: "gondi" | "deva" | "roman" | "english";
  onCopy: (v: string) => void;
}) {
  if (!value) return null;
  const cls =
    kind === "gondi"
      ? "font-gondi text-2xl leading-[1.5] text-forest-600"
      : kind === "deva"
        ? "font-deva text-xl text-ink-800"
        : kind === "english"
          ? "font-english text-lg font-medium text-forest-600"
          : "font-english text-base italic text-ink-700";
  return (
    <div className="flex items-center justify-between gap-3 border-t border-earth-500/10 py-2.5 first:border-t-0">
      <div className="min-w-0">
        <p className="font-english text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-700/55">
          {label}
        </p>
        <p className={`mt-0.5 break-words ${cls}`}>{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(value)}
        aria-label={`${label} कॉपी करें`}
        title="Copy"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-700/60 transition hover:bg-cream-200 hover:text-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-500"
      >
        <Copy size={14} aria-hidden />
      </button>
    </div>
  );
}

export function WordDetail({
  entry,
  related,
}: {
  entry: WordDetailData;
  related: RelatedWord[];
}) {
  const [toast, setToast] = useState<string | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  function show(msg: string) {
    setToast(msg);
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => setToast(null), 1700));
  }

  async function copy(v: string, what = "कॉपी हो गया ✓") {
    show((await copyText(v)) ? what : "कॉपी नहीं हो सका");
  }

  async function share() {
    show("शेयर किया जा रहा है...");
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${entry.gondi_script} · ${entry.gondi_pronunciation} (${entry.hindi}, ${entry.english}) — Masaram Gondi Dictionary ${url}`;
    const r = await shareText(text);
    show(r === "shared" ? "शेयर हो गया ✓" : r === "copied" ? "कॉपी हो गया ✓" : "शेयर नहीं हो सका");
  }

  const hasPronunciation = !!entry.gondi_pronunciation;
  const actionBtn =
    "inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500";

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_330px]">
      {/* ============ MAIN COLUMN ============ */}
      <div className="space-y-5">
        {/* Entry header: Masaram Gondi → forms → actions */}
        <article className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {entry.category_hi && (
              <Link
                href={`/browse/${entry.category}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1 font-deva text-xs font-medium text-earth-500 hover:bg-cream-300"
              >
                <BookOpen size={12} aria-hidden />
                {entry.category_hi}
              </Link>
            )}
            {entry.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-600/10 px-3 py-1 font-english text-xs font-semibold text-forest-600">
                <ShieldCheck size={12} aria-hidden />
                Author Verified · सत्यापित
              </span>
            )}
          </div>

          <p className="mt-5 font-english text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-500">
            Masaram Gondi
          </p>
          <GondiScript
            text={entry.gondi_script}
            className="mt-2 block break-words text-5xl leading-[1.4] text-forest-600 md:text-6xl"
          />

          {/* Language forms (hidden automatically when empty) */}
          <div className="mt-6">
            <SectionLabel>Language Forms · भाषा रूप</SectionLabel>
            <div className="mt-2">
              <FormRow label="Gondi Devanagari · गोंडी" value={entry.gondi_pronunciation} kind="deva" onCopy={copy} />
              <FormRow label="Roman Gondi" value={entry.roman_gondi} kind="roman" onCopy={copy} />
              <FormRow label="Hindi · हिन्दी" value={entry.hindi} kind="deva" onCopy={copy} />
              <FormRow label="Roman Hindi" value={entry.roman_hindi} kind="roman" onCopy={copy} />
              <FormRow label="English" value={entry.english} kind="english" onCopy={copy} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-earth-500/10 pt-5">
            {hasPronunciation && (
              <button
                type="button"
                onClick={() => speak(entry.gondi_pronunciation)}
                className={`${actionBtn} bg-terracotta-500 text-cream-50 shadow-card hover:bg-terracotta-600`}
              >
                <Volume2 size={16} aria-hidden /> Listen · सुनें
              </button>
            )}
            <button
              type="button"
              onClick={() => copy(entry.gondi_script, "मसराम गोंडी कॉपी हो गया ✓")}
              className={`${actionBtn} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}
            >
              <Copy size={15} aria-hidden /> Copy
            </button>
            <button
              type="button"
              onClick={share}
              className={`${actionBtn} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}
            >
              <Share2 size={15} aria-hidden /> Share
            </button>
            <Link
              href={`/report?word=${entry.id}`}
              className={`${actionBtn} border border-ochre-500/50 text-earth-500 hover:bg-ochre-500/10`}
            >
              <Flag size={14} aria-hidden /> Report Error
            </Link>
          </div>
        </article>

        {/* Definition — existing glosses only, never invented */}
        <article className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card md:p-8">
          <SectionLabel>Definition · अर्थ</SectionLabel>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="font-english text-xs font-semibold uppercase tracking-wide text-ink-700/60">
                Hindi Definition
              </h3>
              <p className="mt-1.5 font-deva text-lg leading-relaxed text-ink-800">{entry.hindi}</p>
            </div>
            <div>
              <h3 className="font-english text-xs font-semibold uppercase tracking-wide text-ink-700/60">
                English Definition
              </h3>
              <p className="mt-1.5 font-english text-lg leading-relaxed text-ink-800">{entry.english}</p>
            </div>
          </div>
        </article>
      </div>

      {/* ============ SECONDARY COLUMN ============ */}
      <div className="space-y-5">
        {hasPronunciation && (
          <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
            <SectionLabel>Pronunciation · उच्चारण</SectionLabel>
            <p className="mt-2 font-deva text-2xl text-ink-800">{entry.gondi_pronunciation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => speak(entry.gondi_pronunciation)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-500"
              >
                <Volume2 size={14} aria-hidden /> गोंडी
              </button>
              <button
                type="button"
                onClick={() => speak(entry.hindi)}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-forest-600/30 px-4 py-2 text-xs font-semibold text-forest-600 hover:bg-forest-600/10"
              >
                <Volume2 size={14} aria-hidden /> हिन्दी
              </button>
              <button
                type="button"
                onClick={() => speak(entry.english, "en-IN")}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-forest-600/30 px-4 py-2 text-xs font-semibold text-forest-600 hover:bg-forest-600/10"
              >
                <Volume2 size={14} aria-hidden /> English
              </button>
            </div>
          </section>
        )}

        {(entry.source || entry.source_page) && (
          <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
            <SectionLabel>Source · स्रोत</SectionLabel>
            <div className="mt-3 space-y-1.5 text-sm text-ink-700">
              {entry.source && (
                <p className="font-deva leading-relaxed">📖 {entry.source}</p>
              )}
              {entry.source_page && (
                <p>
                  <span className="font-english text-xs font-semibold uppercase tracking-wide text-ink-700/55">
                    Page · पृष्ठ:
                  </span>{" "}
                  {entry.source_page}
                </p>
              )}
              <p className="pt-1 text-xs text-ink-700/60">
                केवल स्रोत-सत्यापित प्रविष्टि — अनुमान से कुछ नहीं जोड़ा गया।
              </p>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
            <SectionLabel>Related Words · संबंधित शब्द</SectionLabel>
            <ul className="mt-3 space-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/word/${r.id}`}
                    className="flex items-baseline justify-between gap-3 rounded-xl border border-earth-500/10 bg-cream-100/60 px-3 py-2 transition hover:border-terracotta-500/40 hover:bg-cream-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-500"
                  >
                    <span className="font-gondi text-lg text-forest-600">{r.gondi_script}</span>
                    <span className="truncate font-deva text-sm text-ink-700">
                      {r.gondi_pronunciation} · {r.hindi}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

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
