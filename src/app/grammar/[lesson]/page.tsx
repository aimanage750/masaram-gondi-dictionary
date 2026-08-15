import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LESSONS, getLesson } from "@/data/grammar/lessons";
import { LessonLayout } from "@/components/grammar/LessonLayout";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ lesson: l.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { lesson: string };
}): Metadata {
  const lesson = getLesson(params.lesson);
  if (!lesson) return {};
  return {
    title: `${lesson.name_hi} (${lesson.name_en}) · Masaram Gondi Grammar`,
    description: `Masaram Gondi grammar — ${lesson.name_hi} (${lesson.name_en}): ${lesson.summary}`,
    alternates: { canonical: `/grammar/${lesson.slug}` },
  };
}

export default function GrammarLessonPage({
  params,
}: {
  params: { lesson: string };
}) {
  const lesson = getLesson(params.lesson);
  if (!lesson) notFound();
  return <LessonLayout lesson={lesson} />;
}
