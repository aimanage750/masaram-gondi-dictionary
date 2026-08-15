import { notFound } from "next/navigation";
import { CATEGORY_META } from "@/data/raw-entries";
import { listEntries } from "@/lib/data/store";
import { toPublic } from "@/lib/mapping/enrich";
import { WordCard } from "@/components/WordCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const meta = CATEGORY_META.find((c) => c.slug === params.category);
  if (!meta) notFound();
  const entries = await listEntries({ category: params.category });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm uppercase tracking-wide text-gold-300">{meta.name}</p>
      <h1 className="font-display text-3xl text-cream-50 font-deva">{meta.name_hi}</h1>
      <p className="mt-1 text-sm text-cream-200/70">{entries.length} entries</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {entries.map((e) => (
          <WordCard key={e.id} entry={toPublic(e)} />
        ))}
      </div>
    </div>
  );
}
