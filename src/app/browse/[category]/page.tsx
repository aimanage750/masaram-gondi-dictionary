import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_META } from "@/data/raw-entries";
import { listEntries } from "@/lib/data/store";
import { toPublic } from "@/lib/mapping/enrich";
import { WordCard } from "@/components/WordCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { category: string } }) {
  const meta = CATEGORY_META.find((c) => c.slug === params.category);
  if (!meta) return {};
  const metadata: Metadata = {
    title: `${meta.name} · ${meta.name_hi}`,
    description: `Masaram Gondi dictionary words in the ${meta.name} (${meta.name_hi}) category — Gondi script, Devanagari pronunciation, Hindi and English meanings.`,
    alternates: { canonical: `/browse/${meta.slug}` },
  };
  return metadata;
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const meta = CATEGORY_META.find((c) => c.slug === params.category);
  if (!meta) notFound();
  const entries = await listEntries({ category: params.category });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-500">{meta.name}</p>
      <h1 className="font-display text-3xl font-bold text-forest-600 font-deva">{meta.name_hi}</h1>
      <p className="mt-1 text-sm text-ink-700/70">{entries.length} entries</p>
      {entries.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-earth-500/10 bg-white p-8 text-center text-sm text-ink-700/80 shadow-card">
          इस श्रेणी में अभी कोई प्रविष्टि नहीं है। · No entries in this category yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {entries.map((e) => (
            <WordCard key={e.id} entry={toPublic(e)} />
          ))}
        </div>
      )}
    </div>
  );
}
