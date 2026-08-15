import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAdjacentLessons } from "@/data/grammar/lessons";
import { POLICY_NOTE, type GrammarLesson, type GrammarSection } from "@/data/grammar/types";
import { GrammarTable } from "./GrammarTable";
import { ExampleBox } from "./ExampleBox";
import { PendingBadge, PendingNote } from "./PendingNote";

function Section({ section }: { section: GrammarSection }) {
  return (
    <section aria-labelledby={`sec-${section.id}`} className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id={`sec-${section.id}`} className="font-deva text-2xl font-bold text-ink-800">
          {section.heading}
        </h2>
        {section.heading_en && (
          <span className="text-sm uppercase tracking-wide text-terracotta-600">
            {section.heading_en}
          </span>
        )}
        {section.pending && <PendingBadge />}
      </div>

      {section.paragraphs && (
        <div className="mt-3 space-y-2">
          {section.paragraphs.map((p, i) => (
            <p key={i} className="font-deva leading-relaxed text-ink-800">
              {p}
            </p>
          ))}
        </div>
      )}

      {section.terms && (
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {section.terms.map((t) => (
            <div
              key={t.label}
              className="flex flex-wrap items-center gap-2 rounded-lg bg-white/70 px-3 py-2"
            >
              <dt className="text-xs uppercase tracking-wide text-ink-700/60">{t.label}:</dt>
              <dd
                className={
                  t.script === "en"
                    ? "text-ink-800"
                    : t.script === "gondi"
                      ? "font-gondi text-xl text-forest-600"
                      : "font-deva text-ink-800"
                }
              >
                {t.value}
              </dd>
              {t.pending && <PendingBadge />}
            </div>
          ))}
        </dl>
      )}

      {section.table && <GrammarTable table={section.table} />}

      {section.examples && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {section.examples.map((e) => (
            <ExampleBox key={`${e.gondi_pronunciation}-${e.hindi}`} example={e} />
          ))}
        </div>
      )}

      {section.rules && (
        <ul className="mt-3 list-disc space-y-1 pl-5 font-deva text-ink-800">
          {section.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      {section.note && (
        <p className="mt-3 rounded-r-xl border-l-4 border-ochre-500 bg-[#fff1cc] px-3 py-2 text-sm leading-relaxed text-ink-700">
          {section.note}
        </p>
      )}

      {section.pending && !section.examples?.length && !section.table && <PendingNote />}
    </section>
  );
}

export function LessonLayout({ lesson }: { lesson: GrammarLesson }) {
  const { prev, next } = getAdjacentLessons(lesson.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/grammar"
          className="text-terracotta-500 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          ← व्याकरण
        </Link>
      </nav>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">Grammar · व्याकरण</p>
        <h1 className="mt-2 flex flex-wrap items-baseline gap-x-4 font-deva text-3xl font-bold text-forest-600 md:text-4xl">
          <span aria-hidden className="font-gondi text-terracotta-500">{lesson.glyph}</span>
          {lesson.name_hi}
          <span className="text-lg font-normal text-ink-700/70">{lesson.name_en}</span>
        </h1>
        <p className="mt-2 font-deva leading-relaxed text-ink-700">{lesson.summary}</p>
      </header>

      <div className="mt-8 rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card md:p-8">
        <p className="rounded-xl border border-forest-500/25 bg-forest-500/10 px-3 py-2 text-sm leading-relaxed text-ink-700">
          {POLICY_NOTE}
        </p>
        {lesson.sections.map((s) => (
          <Section key={s.id} section={s} />
        ))}
      </div>

      <nav aria-label="पाठ क्रम" className="mt-6 flex items-stretch justify-between gap-3">
        {prev ? (
          <Link
            href={`/grammar/${prev.slug}`}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-earth-500/15 bg-cream-200/60 px-4 py-3 text-ink-800 hover:border-terracotta-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
          >
            <ChevronLeft size={18} aria-hidden />
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wide text-ink-700/60">पिछला पाठ</span>
              <span className="block truncate font-deva">{prev.name_hi}</span>
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`/grammar/${next.slug}`}
            className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-2xl border border-ochre-500/25 bg-forest-700/70 px-4 py-3 text-right text-cream-100 hover:border-gold-400/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
          >
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-wide text-ink-700/60">अगला पाठ</span>
              <span className="block truncate font-deva">{next.name_hi}</span>
            </span>
            <ChevronRight size={18} aria-hidden />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </div>
  );
}
