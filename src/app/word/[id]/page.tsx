import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntry } from "@/lib/data/store";
import { GondiScript } from "@/components/GondiScript";
import { SpeakButton } from "@/components/SpeakButton";

export const dynamic = "force-dynamic";

export default async function WordPage({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);
  if (!entry || entry.status !== "published") notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-gold-300 underline-offset-2 hover:underline">
        ← Search
      </Link>
      <article className="gond-frame mt-4 rounded-3xl bg-cream-50 p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-forest-500">Masaram Gondi</p>
        <GondiScript text={entry.gondi_script} className="mt-2 block text-5xl text-forest-600 md:text-6xl" />

        <Field label="Gondi Pronunciation">
          <span className="font-deva text-2xl">{entry.gondi_pronunciation}</span>
          <SpeakButton text={entry.gondi_pronunciation} />
        </Field>
        <Field label="Hindi">
          <span className="font-deva text-2xl">{entry.hindi}</span>
          <SpeakButton text={entry.hindi} />
        </Field>
        <Field label="English">
          <span className="text-2xl">{entry.english}</span>
          <SpeakButton text={entry.english} lang="en-IN" />
        </Field>

        {entry.category && (
          <p className="mt-8 text-sm text-ink-700/70">
            Category:{" "}
            <Link href={`/browse/${entry.category}`} className="text-forest-600 underline">
              {entry.category_hi || entry.category}
            </Link>
          </p>
        )}
      </article>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-6 border-t border-terracotta-500/15 pt-4">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-700/60">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
