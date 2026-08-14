import Link from "next/link";
import { CATEGORY_META } from "@/data/raw-entries";
import { listEntries } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const entries = await listEntries();
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink-800">Browse</h1>
      <p className="mt-1 font-deva text-ink-700">श्रेणी के अनुसार शब्द देखें</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_META.filter((c) => (counts.get(c.slug) ?? 0) > 0).map((c) => (
          <Link
            key={c.slug}
            href={`/browse/${c.slug}`}
            className="gond-frame rounded-2xl bg-cream-50 p-5"
          >
            <h2 className="font-display text-xl text-forest-600">{c.name}</h2>
            <p className="font-deva">{c.name_hi}</p>
            <p className="mt-2 text-sm text-ink-700/70">{counts.get(c.slug)} words</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
