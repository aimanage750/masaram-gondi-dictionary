import Link from "next/link";
import { ArrowRight, Languages, MessageSquareText, Search, Shuffle } from "lucide-react";
import { SearchBar, type SearchLang } from "@/components/SearchBar";
import { WordCard } from "@/components/WordCard";
import { FeatureCards } from "@/components/home/FeatureCards";
import { StatsBar } from "@/components/home/StatsBar";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CulturalDivider } from "@/components/ui/CulturalDivider";
import { listEntries, listSentences } from "@/lib/data/store";
import { searchEntries } from "@/lib/search";
import { CATEGORY_META } from "@/data/raw-entries";
import { LESSONS } from "@/data/grammar/lessons";

export const dynamic = "force-dynamic";

const LANG_MATCH: Record<string, string[]> = {
  hindi: ["hindi", "roman_hindi"],
  english: ["english"],
  gondi: ["gondi_script", "gondi_pronunciation", "roman_gondi"],
};

const ACTION_TABS = [
  { href: "#search", label: "Search Word", icon: Search, active: true },
  { href: "/translator", label: "Translate", icon: Languages, active: false },
  { href: "/vakya", label: "Sentence", icon: MessageSquareText, active: false },
  { href: "/converter", label: "Converter", icon: Shuffle, active: false },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; lang?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const lang = (searchParams.lang ?? "all") as SearchLang;
  const entries = await listEntries();
  const sentences = await listSentences(false);

  let hits = q ? searchEntries(entries, q, { limit: 40 }) : [];
  if (q && lang !== "all" && LANG_MATCH[lang]) {
    hits = hits.filter((h) => LANG_MATCH[lang].includes(h.matched_on));
  }

  return (
    <div>
      {/* ============ HERO ============ */}
      <section
        className="relative isolate overflow-hidden"
        aria-label="Masaram Gondi Script Dictionary"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url(/img/hero-landscape.jpg)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-cream-100/60 via-transparent to-cream-100"
        />

        <div className="mx-auto max-w-4xl px-4 pb-16 pt-12 text-center md:pb-20 md:pt-16">
          <p className="anim-rise font-gondi text-4xl text-forest-600 drop-shadow-sm md:text-5xl">
            𑴤𑴫𑴦𑴱𑴤 𑴎𑴽𑵀𑴘𑴳
          </p>
          <h1 className="anim-rise mt-3 font-display text-4xl font-bold text-forest-600 md:text-6xl">
            Masaram Gondi
          </h1>
          <p className="anim-rise font-display text-2xl font-semibold text-terracotta-500 md:text-4xl">
            Script Dictionary
          </p>
          <p className="anim-rise-1 mx-auto mt-4 max-w-xl text-sm italic text-ink-800/85 md:text-base">
            &ldquo;A Language is Not Just Words, It&rsquo;s Our Culture, Our Roots.&rdquo;
          </p>

          <div className="anim-rise-1 mt-5">
            <CulturalDivider className="text-earth-500" />
          </div>

          {/* Action tabs */}
          <nav aria-label="Quick actions" className="anim-rise-2 mt-6">
            <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-earth-500/15 bg-cream-50/90 p-1.5 shadow-card backdrop-blur">
              {ACTION_TABS.map((t) => {
                const Icon = t.icon;
                return t.active ? (
                  <a
                    key={t.label}
                    href={t.href}
                    aria-current="page"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta-500 px-4 py-2 text-sm font-semibold text-cream-50 shadow-card"
                  >
                    <Icon size={15} aria-hidden />
                    {t.label}
                  </a>
                ) : (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-ink-800 transition hover:bg-cream-200 hover:text-forest-600"
                  >
                    <Icon size={15} aria-hidden />
                    {t.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Search */}
          <div id="search" className="anim-rise-2 mx-auto mt-5 max-w-3xl scroll-mt-24">
            <SearchBar initial={q} initialLang={lang} autoFocus={false} />
            <p className="mt-3 text-sm text-ink-800/80">
              Example: <span className="font-deva">तल्ला</span> • Head •{" "}
              <span className="font-deva">सिर</span>
              <span aria-hidden className="mx-2 text-terracotta-500">→</span>
              <span className="font-gondi text-base text-forest-600">𑴛𑴧𑵅𑴱</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      {q && (
        <section className="mx-auto max-w-7xl px-4 pt-10">
          <SectionTitle
            kicker="Search Results"
            title={`${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”`}
          />
          {hits.length === 0 ? (
            <div className="gond-frame mx-auto mt-6 max-w-2xl rounded-3xl bg-white p-8 text-center">
              <p className="font-deva text-lg text-ink-800">
                uploaded source में यह प्रविष्टि नहीं मिली।
              </p>
              <p className="mt-2 text-sm text-ink-700/75">
                No matching entry in the uploaded गोंडी करीयाट source. Gondi words are never
                invented here.{" "}
                <Link href="/contribute" className="font-medium text-terracotta-500 underline underline-offset-2">
                  Suggest this word
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hits.map((h) => (
                <WordCard key={h.entry.id} entry={h.entry} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ============ FEATURE CARDS ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-12">
        <FeatureCards />
      </section>

      {/* ============ STATS (real data) ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-8" aria-label="Platform statistics">
        <StatsBar
          words={entries.length}
          sentences={sentences.length}
          lessons={LESSONS.length}
          characters={75}
        />
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-14">
        <SectionTitle
          kicker="Dictionary"
          title="Browse by Category"
          sub="श्रेणी के अनुसार गोंडी शब्द देखें — पुस्तक गोंडी करीयाट से।"
          divider
        />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          {CATEGORY_META.filter((c) => c.slug !== "general").map((c) => (
            <Link
              key={c.slug}
              href={`/browse/${c.slug}`}
              className="group rounded-2xl border border-earth-500/10 bg-white p-4 text-center shadow-card transition hover:-translate-y-0.5 hover:border-terracotta-500/40"
            >
              <span className="block font-medium text-forest-600 group-hover:text-terracotta-500">
                {c.name}
              </span>
              <span className="mt-0.5 block font-deva text-sm text-ink-700">{c.name_hi}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-card transition hover:bg-forest-500"
          >
            पूरा शब्दकोश खोलें · Open Dictionary
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
