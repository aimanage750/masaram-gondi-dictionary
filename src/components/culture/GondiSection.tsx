"use client";

import Link from "next/link";
import { GONDI_FACTS, GONDI_NOTES, GONDI_STATES, SCRIPTS } from "@/data/culture/gondi";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { SourceBadge } from "./SourceBadge";
import { MetaPill } from "./CultureCards";

export function GondiSection() {
  const masaram = `${devanagariToMasaram("मसराम")} ${devanagariToMasaram("गोंडी")}`;

  return (
    <div className="space-y-8">
      {/* Language facts */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GONDI_FACTS.map((f) => (
          <div key={f.label_en} className="rounded-2xl border border-earth-500/10 bg-white p-4 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-earth-500">{f.label_en}</p>
            <p className="font-deva text-xs text-ink-700/70">{f.label_hi}</p>
            <p className="mt-2 font-english text-lg font-bold text-forest-600">{f.value}</p>
            <SourceBadge s={f.source} className="mt-2" />
          </div>
        ))}
      </div>

      <ul className="space-y-2 rounded-2xl border border-earth-500/10 bg-cream-100/70 p-5">
        {GONDI_NOTES.map((n, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-700">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-500" />
            {n}
          </li>
        ))}
      </ul>

      {/* State-wise Gondi */}
      <section aria-labelledby="gondi-states-h">
        <h3 id="gondi-states-h" className="font-deva text-xl font-bold text-forest-600">
          राज्यवार गोंडी भाषा · State-wise Gondi
        </h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {GONDI_STATES.map((r) => (
            <article key={r.state} className="rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card">
              <h4 className="font-english text-lg font-bold text-forest-600">{r.state}</h4>
              <p className="mt-1.5 flex flex-wrap gap-1.5">
                <MetaPill>{r.regions}</MetaPill>
              </p>
              <dl className="mt-3 space-y-1.5 text-sm text-ink-700">
                <div>
                  <dt className="inline font-semibold text-earth-500">Districts: </dt>
                  <dd className="inline">{r.districts}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-earth-500">Communities: </dt>
                  <dd className="inline">{r.communities}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-earth-500">Scripts: </dt>
                  <dd className="inline">{r.scripts}</dd>
                </div>
              </dl>
              {r.note && <p className="mt-2 text-xs text-ink-700/70">{r.note}</p>}
              <SourceBadge s={r.source} />
            </article>
          ))}
        </div>
      </section>

      {/* Scripts */}
      <section aria-labelledby="gondi-scripts-h">
        <h3 id="gondi-scripts-h" className="font-deva text-xl font-bold text-forest-600">
          गोंडी लिपियाँ · Writing systems of Gondi
        </h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {SCRIPTS.map((s) => (
            <article key={s.name} className="rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card">
              <h4 className="font-english text-lg font-bold text-forest-600">{s.name}</h4>
              {s.period && <p className="mt-1 text-xs text-ink-700/70">Period: {s.period}</p>}
              {s.unicode && <p className="mt-1 text-xs font-medium text-terracotta-600">{s.unicode}</p>}
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.usage}</p>
              <p className="mt-2 rounded-lg bg-cream-100 px-3 py-1.5 text-xs text-ink-700/70">{s.note}</p>
              <SourceBadge s={s.source} />
            </article>
          ))}
        </div>
      </section>

      {/* Masaram highlight */}
      <section
        aria-labelledby="masaram-h"
        className="rounded-3xl border border-gold-500/25 bg-forest-900 p-6 text-cream-100 md:p-8"
      >
        <p className="font-gondi text-3xl text-gold-300 md:text-4xl" aria-hidden>
          {masaram}
        </p>
        <h3 id="masaram-h" className="mt-3 font-display text-2xl text-cream-50">
          मसराम गोंडी — this platform&rsquo;s script
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-cream-200/85">
          This website is built on the Masaram Gondi script (Unicode U+11D00–U+11D5F): the
          dictionary, converter, keyboard and script-learning sections all use real Unicode
          text rendered with Noto Sans Masaram Gondi — never images.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { href: "/", label: "Dictionary" },
            { href: "/converter", label: "Converter" },
            { href: "/script", label: "Script Learning" },
            { href: "/grammar", label: "Grammar" },
            { href: "/vakya", label: "Sentences" },
            { href: "/keyboard", label: "Keyboard" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-gold-400/40 px-4 py-2 text-sm font-medium text-gold-300 hover:bg-gold-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
