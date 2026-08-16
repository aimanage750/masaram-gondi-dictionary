import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getEntry } from "@/lib/data/store";
import { ReportForm, type ReportedWord } from "@/components/report/ReportForm";

export const metadata: Metadata = {
  title: "Report a Dictionary Error · शब्दकोश में गलती की रिपोर्ट करें",
  description:
    "Found an incorrect word, meaning, spelling, pronunciation or other information? Help us improve the Masaram Gondi Dictionary. Reports are reviewed before any correction is made.",
  alternates: { canonical: "/report" },
};

export const dynamic = "force-dynamic";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: { word?: string };
}) {
  // Verify the reported word server-side — a client-supplied id is never
  // trusted on its own; the entry must exist in the database.
  let word: ReportedWord | null = null;
  if (searchParams.word) {
    const entry = await getEntry(searchParams.word);
    if (entry) {
      word = {
        id: entry.id,
        gondi_script: entry.gondi_script,
        gondi_pronunciation: entry.gondi_pronunciation,
        roman_gondi: entry.roman_gondi,
        hindi: entry.hindi,
        english: entry.english,
      };
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          <ArrowLeft size={15} aria-hidden /> Back to Dictionary · शब्दकोश
        </Link>
        {word && (
          <Link
            href={`/word/${word.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-500 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
          >
            <ArrowLeft size={15} aria-hidden /> Back to Word · शब्द पर वापस
          </Link>
        )}
      </nav>

      <header className="mt-5 max-w-3xl">
        <h1 className="font-english text-3xl font-bold text-forest-600 md:text-4xl">
          Report a Dictionary Error
        </h1>
        <p className="mt-1 font-deva text-xl text-terracotta-600">
          शब्दकोश में गलती की रिपोर्ट करें
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-700/90">
          Found an incorrect word, meaning, spelling, pronunciation or other information? Help us
          improve the dictionary.
        </p>
        <p className="mt-1 font-deva text-base leading-relaxed text-ink-700/80">
          हर रिपोर्ट की समीक्षा होती है — कोई भी सुधार स्वतः लागू नहीं होता।
        </p>
        {!word && searchParams.word && (
          <p className="mt-3 rounded-2xl bg-ochre-500/10 p-3.5 text-sm text-earth-500">
            दिया गया शब्द Dictionary में नहीं मिला। आप फिर भी सामान्य रिपोर्ट भेज सकते हैं।
          </p>
        )}
      </header>

      <div className="mt-7 max-w-4xl">
        <ReportForm word={word} />
      </div>
    </div>
  );
}
