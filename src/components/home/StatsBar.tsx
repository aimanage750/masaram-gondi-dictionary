import { BookOpen, MessagesSquare, GraduationCap, PenLine } from "lucide-react";

/** Real project statistics only — never invented numbers. */
export function StatsBar({
  words,
  sentences,
  lessons,
  characters,
}: {
  words: number;
  sentences: number;
  lessons: number;
  characters: number;
}) {
  const stats = [
    { icon: BookOpen, value: words, label: "Words", hi: "शब्द" },
    { icon: MessagesSquare, value: sentences, label: "Sentences", hi: "वाक्य" },
    { icon: GraduationCap, value: lessons, label: "Grammar Lessons", hi: "व्याकरण पाठ" },
    { icon: PenLine, value: characters, label: "Script Characters", hi: "लिपि अक्षर" },
  ];

  return (
    <div className="rounded-3xl bg-forest-900 px-4 py-6 shadow-lift md:px-8">
      <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-center gap-3 md:gap-4">
            <dt className="sr-only">
              {s.label} ({s.hi})
            </dt>
            <s.icon className="shrink-0 text-gold-400" size={26} aria-hidden />
            <dd>
              <p className="font-display text-2xl font-bold text-cream-50 md:text-3xl">
                {s.value}
                <span className="text-gold-400">+</span>
              </p>
              <p className="text-xs text-cream-200/75">
                {s.label} · <span className="font-deva">{s.hi}</span>
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
