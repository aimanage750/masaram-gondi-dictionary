import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getEntry } from "@/lib/data/store";
import { GondiScript } from "@/components/GondiScript";
import { SpeakButton } from "@/components/SpeakButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);
  if (!entry || entry.status !== "published") return {};
  const meta: Metadata = {
    title: `${entry.gondi_pronunciation} · ${entry.english}`,
    description: `Masaram Gondi word ${entry.gondi_pronunciation} (${entry.hindi}, ${entry.english}) in Masaram Gondi script with pronunciation and meaning.`,
  };
  return meta;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-t border-earth-500/10 pt-4">
      <h2 className="font-english text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-500">
        {label}
      </h2>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

export default async function WordPage({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id);
  if (!entry || entry.status !== "published") notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
      >
        <ArrowLeft size={15} aria-hidden /> Dictionary
      </Link>

      <article className="mt-4 rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card md:p-10">
        {/* Masaram Gondi — strongest prominence */}
        <p className="font-english text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta-500">
          Masaram Gondi
        </p>
        <GondiScript
          text={entry.gondi_script}
          className="mt-2 block text-5xl leading-[1.4] text-forest-600 md:text-6xl"
        />
        {entry.category_hi && (
          <Link
            href={`/browse/${entry.category}`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-3 py-1 font-deva text-xs font-medium text-earth-500 hover:bg-cream-300"
          >
            <BookOpen size={12} aria-hidden />
            {entry.category_hi}
          </Link>
        )}

        <div className="mt-8 space-y-5">
          <Field label="Gondi · गोंडी उच्चारण">
            <p className="font-deva text-2xl text-ink-800">{entry.gondi_pronunciation}</p>
          </Field>

          {entry.roman_gondi && (
            <Field label="Roman Gondi">
              <p className="font-english text-lg italic text-ink-700">{entry.roman_gondi}</p>
            </Field>
          )}

          <Field label="Hindi · हिन्दी">
            <p className="font-deva text-2xl text-ink-800">{entry.hindi}</p>
          </Field>

          <Field label="English">
            <p className="font-english text-xl font-medium text-forest-600">{entry.english}</p>
          </Field>

          {/* Pronunciation audio — shown only when a pronunciation exists */}
          {entry.gondi_pronunciation && (
            <Field label="Pronunciation · उच्चारण सुनें">
              <div className="flex flex-wrap items-center gap-3">
                <SpeakButton text={entry.gondi_pronunciation} />
                <SpeakButton text={entry.hindi} label="हिन्दी उच्चारण सुनें" />
                <SpeakButton text={entry.english} lang="en-IN" label="English pronunciation" />
              </div>
            </Field>
          )}

          {entry.notes && (
            <Field label="Notes · टिप्पणी">
              <p className="font-deva text-base leading-relaxed text-ink-700">{entry.notes}</p>
            </Field>
          )}

          <Field label="Source · स्रोत">
            <p className="font-deva text-sm leading-relaxed text-ink-700">
              {entry.source}
              {entry.source_page ? ` · पृष्ठ ${entry.source_page}` : ""}
            </p>
            <p className="mt-1 text-xs text-ink-700/60">
              केवल अपलोड की गई पुस्तक से सत्यापित प्रविष्टि — अनुमान से कुछ नहीं जोड़ा गया।
            </p>
          </Field>
        </div>
      </article>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/contribute"
          className="inline-flex min-h-[44px] items-center rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-terracotta-600"
        >
          + Contribute a Word
        </Link>
        <Link
          href="/report"
          className="inline-flex min-h-[44px] items-center rounded-full border border-ochre-500/50 bg-white px-5 py-2.5 text-sm font-semibold text-earth-500 hover:bg-ochre-500/10"
        >
          ⚠ Report an Error
        </Link>
      </div>
    </div>
  );
}
