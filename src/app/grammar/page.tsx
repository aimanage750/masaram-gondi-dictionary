import type { Metadata } from "next";
import { LESSONS } from "@/data/grammar/lessons";
import { GrammarCard } from "@/components/grammar/GrammarCard";

export const metadata: Metadata = {
  title: "Masaram Gondi Grammar",
  description:
    "Learn Masaram Gondi grammar — संज्ञा, सर्वनाम, क्रिया, विशेषण, काल, कारक और वाक्य-रचना — rules, examples and sentence structure in Masaram Gondi script.",
  alternates: { canonical: "/grammar" },
};

export default function GrammarIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta-500">
          Grammar · व्याकरण
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-forest-600 md:text-4xl">
          Masaram Gondi Grammar
        </h1>
        <p className="mt-2 font-gondi text-3xl text-terracotta-500" aria-hidden>
          𑴨𑴥𑴱𑴟𑴟𑴱
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-deva leading-relaxed text-ink-700">
          मसराम गोंडी व्याकरण का अध्ययन-क्रम — संज्ञा से वाक्य तक। हर पाठ में हिन्दी
          व्याख्या, मसराम गोंडी उदाहरण और (जहाँ उपलब्ध हो) नियम मिलेंगे।
        </p>
        <p className="mx-auto mt-3 max-w-2xl rounded-xl border border-earth-500/15 bg-cream-200/60 px-4 py-2 text-sm text-ink-700">
          नीति: गोंडी शब्द और नियम केवल स्रोत (पुस्तक / शब्दकोश) से लिए जाते हैं। जो भाग
          स्रोत में नहीं है, वह &ldquo;स्रोत की पुष्टि बाकी&rdquo; के रूप में दिखता है — अनुमान से कुछ
          नहीं लिखा जाता।
        </p>
      </section>

      <nav aria-label="व्याकरण पाठ" className="mt-10 grid gap-4 md:grid-cols-2">
        {LESSONS.map((lesson, i) => (
          <GrammarCard key={lesson.slug} lesson={lesson} index={i} />
        ))}
      </nav>
    </div>
  );
}
