import { SearchBar } from "@/components/SearchBar";
import { WordCard } from "@/components/WordCard";
import { listEntries } from "@/lib/data/store";
import { searchEntries } from "@/lib/search";
import { CATEGORY_META } from "@/data/raw-entries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const entries = await listEntries();
  const hits = q ? searchEntries(entries, q, { limit: 40 }) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <section className="mx-auto max-w-3xl text-center">
        <p className="font-gondi text-4xl text-forest-600 md:text-5xl">𑴎𑴉𑴟𑴱𑴝𑴳</p>
        <h1 className="mt-3 font-display text-3xl text-ink-800 md:text-5xl text-balance">
          Masaram Gondi Dictionary
        </h1>
        <p className="mt-3 font-deva text-lg text-ink-700">
          गोंडी · हिन्दी · English · 𑴤𑴫𑴦𑴤 𑴎𑴉𑴟𑴱𑴝𑴳
        </p>
        <p className="mt-2 text-sm text-ink-700/70">
          Search in Gondi pronunciation, Roman Gondi, Hindi, English or Masaram Gondi script.
        </p>
        <div className="mt-6 text-left">
          <SearchBar initial={q} autoFocus />
        </div>
        {!q && (
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            <Link href="/browse" className="gond-frame rounded-2xl bg-white/80 p-4">
              <span className="block font-display text-lg text-forest-600">श्रेणी</span>
              <span className="font-deva text-sm text-ink-700">शब्द विषय से</span>
            </Link>
            <Link href="/vakya" className="gond-frame rounded-2xl bg-white/80 p-4">
              <span className="block font-display text-lg text-terracotta-600">वाक्यांश</span>
              <span className="font-deva text-sm text-ink-700">गोंडी वाक्य · जल्द</span>
            </Link>
          </div>
        )}
        <p className="mt-3 text-xs text-ink-700/60">
          Try <em>तल्ला</em>, <em>Talla</em>, <em>सिर</em>, <em>Head</em> or{" "}
          <span className="font-gondi">𑴛𑴧𑵅𑴧𑴱</span>
        </p>
      </section>

      {q && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl text-ink-800">
            {hits.length} result{hits.length === 1 ? "" : "s"} for “{q}”
          </h2>
          {hits.length === 0 ? (
            <div className="gond-frame rounded-2xl bg-cream-50 p-6">
              <p className="font-deva text-lg">uploaded source में यह प्रविष्टि नहीं मिली।</p>
              <p className="mt-2 text-sm text-ink-700/70">
                No matching entry in the uploaded गोंडी करीयाट source. Gondi words are never
                invented here.{" "}
                <Link href="/contribute" className="text-terracotta-600 underline">
                  Suggest this word
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {hits.map((h) => (
                <WordCard key={h.entry.id} entry={h.entry} />
              ))}
            </div>
          )}
        </section>
      )}

      {!q && (
        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl">Browse by category</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {CATEGORY_META.filter((c) => c.slug !== "general").map((c) => (
              <Link
                key={c.slug}
                href={`/browse/${c.slug}`}
                className="rounded-2xl border border-forest-500/20 bg-white/70 p-4 hover:border-forest-500"
              >
                <span className="block font-medium text-forest-600">{c.name}</span>
                <span className="font-deva text-sm text-ink-700">{c.name_hi}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
