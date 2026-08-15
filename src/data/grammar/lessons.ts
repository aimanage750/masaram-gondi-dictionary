/**
 * Grammar lesson registry — the single place that defines the lesson set,
 * order and slugs. Used by /grammar and /grammar/[lesson].
 */
import type { GrammarLesson } from "./types";
import { SANGYA } from "./lessons/sangya";
import { SARVANAM } from "./lessons/sarvanam";
import { KRIYA } from "./lessons/kriya";
import { VISHESHAN } from "./lessons/visheshan";
import { KRIYA_VISHESHAN } from "./lessons/kriya-visheshan";
import { LING } from "./lessons/ling";
import { VACHAN } from "./lessons/vachan";
import { KAAL } from "./lessons/kaal";
import { KARAK } from "./lessons/karak";
import { VAKYA } from "./lessons/vakya";
import { ANYA } from "./lessons/anya";

export const LESSONS: GrammarLesson[] = [
  SANGYA,
  SARVANAM,
  KRIYA,
  VISHESHAN,
  KRIYA_VISHESHAN,
  LING,
  VACHAN,
  KAAL,
  KARAK,
  VAKYA,
  ANYA,
];

export function getLesson(slug: string): GrammarLesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

/** Previous / next lesson for the lesson pager. */
export function getAdjacentLessons(slug: string): {
  prev?: GrammarLesson;
  next?: GrammarLesson;
} {
  const i = LESSONS.findIndex((l) => l.slug === slug);
  if (i === -1) return {};
  return { prev: LESSONS[i - 1], next: LESSONS[i + 1] };
}
