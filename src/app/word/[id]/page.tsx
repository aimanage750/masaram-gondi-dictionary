import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getEntry, listEntries } from "@/lib/data/store";
import { WordDetail, type RelatedWord } from "@/components/dictionary/WordDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);
  if (!entry || entry.status !== "published") return {};
  const title = `${entry.gondi_pronunciation} — ${entry.roman_gondi} — ${entry.hindi} — ${entry.english}`;
  const description = `Dictionary entry for the Masaram Gondi word ${entry.gondi_script} (${entry.gondi_pronunciation} / ${entry.roman_gondi}): Hindi ${entry.hindi}, English ${entry.english}. Verified script, pronunciation and meaning.`;
  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: `/word/${entry.id}` },
    openGraph: {
      title: `${title} · Masaram Gondi Dictionary`,
      description,
      url: `/word/${entry.id}`,
      type: "article",
    },
  };
  return metadata;
}

export default async function WordPage({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);
  if (!entry || entry.status !== "published") notFound();

  // Related words: same category, public-safe subset only.
  let related: RelatedWord[] = [];
  if (entry.category) {
    const pool = await listEntries({ category: entry.category });
    related = pool
      .filter((e) => e.id !== entry.id && e.status === "published")
      .slice(0, 6)
      .map((e) => ({
        id: e.id,
        gondi_script: e.gondi_script,
        gondi_pronunciation: e.gondi_pronunciation,
        hindi: e.hindi,
      }));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
      >
        <ArrowLeft size={15} aria-hidden /> Back to Dictionary · शब्दकोश
      </Link>

      <div className="mt-4">
        <WordDetail
          entry={{
            id: entry.id,
            gondi_script: entry.gondi_script,
            gondi_pronunciation: entry.gondi_pronunciation,
            roman_gondi: entry.roman_gondi,
            roman_hindi: entry.roman_hindi,
            hindi: entry.hindi,
            english: entry.english,
            category: entry.category,
            category_hi: entry.category_hi,
            source: entry.source,
            source_page: entry.source_page,
            verified: entry.verified,
          }}
          related={related}
        />
      </div>
    </div>
  );
}
