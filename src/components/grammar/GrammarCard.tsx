import Link from "next/link";
import type { GrammarLesson } from "@/data/grammar/types";
import { PendingBadge } from "./PendingNote";

/** Lesson card on the /grammar index page. */
export function GrammarCard({
  lesson,
  index,
}: {
  lesson: GrammarLesson;
  index: number;
}) {
  const fullyPending = lesson.sections.every((s) => s.pending);

  return (
    <Link
      href={`/grammar/${lesson.slug}`}
      className="group flex gap-4 rounded-2xl border border-earth-500/10 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-terracotta-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
    >
      <span
        aria-hidden
        className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-forest-500 font-gondi text-3xl text-gold-300 shadow-inset"
      >
        {lesson.glyph}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-700/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-deva text-xl font-bold text-ink-800">
            {lesson.name_hi}
          </span>
          <span className="text-xs uppercase tracking-wide text-terracotta-600">
            {lesson.name_en}
          </span>
        </span>
        <span className="mt-1 block font-deva text-sm leading-relaxed text-ink-700">
          {lesson.summary}
        </span>
        <span className="mt-2 block">
          {fullyPending ? <PendingBadge /> : (
            <span className="text-xs font-medium text-forest-600">स्रोत-सहित उदाहरण उपलब्ध</span>
          )}
        </span>
      </span>
    </Link>
  );
}
