import type { Metadata } from "next";
import { listEntries } from "@/lib/data/store";
import { toPublic } from "@/lib/mapping/enrich";
import { DictionaryExplorer } from "@/components/dictionary/DictionaryExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dictionary",
  description:
    "Explore Masaram Gondi words, their Hindi and English meanings, pronunciation and verified script information. Search in Hindi, English, Gondi Devanagari, Roman Gondi or Masaram Gondi script.",
  alternates: { canonical: "/browse" },
};

export default async function DictionaryPage() {
  const entries = (await listEntries()).map((e) => toPublic(e));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <header className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta-500">
          Masaram Gondi Script Dictionary
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-forest-600 md:text-5xl">
          Dictionary · शब्दकोश
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-deva text-sm leading-relaxed text-ink-700 md:text-base">
          Explore Masaram Gondi words, their Hindi and English meanings, pronunciation and
          verified script information.
        </p>
        <p className="mx-auto mt-1 max-w-2xl font-deva text-sm leading-relaxed text-ink-700/80">
          मसराम गोंडी शब्द, उनके हिन्दी–अंग्रेज़ी अर्थ, उच्चारण और प्रमाणित लिपि जानकारी खोजें।
        </p>
      </header>

      <div className="mt-8">
        <DictionaryExplorer entries={entries} />
      </div>
    </div>
  );
}
