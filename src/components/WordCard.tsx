import Link from "next/link";
import type { PublicEntry } from "@/lib/types";
import { GondiScript } from "@/components/GondiScript";
import { toTitleRoman } from "@/lib/mapping/romanize";

/**
 * Professional dictionary card (Image-2 design language):
 * Masaram Gondi gets top visual prominence; Gondi Devanagari, Roman Gondi,
 * Hindi and English follow in a clear hierarchy. Category shown as a badge.
 */
export function WordCard({ entry }: { entry: PublicEntry }) {
  const roman = toTitleRoman(entry.gondi_pronunciation);

  return (
    <Link
      href={`/word/${entry.id}`}
      className="group flex h-full flex-col rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-terracotta-500/50 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
    >
      <div className="flex items-start justify-between gap-3">
        <GondiScript
          text={entry.gondi_script}
          className="text-3xl text-forest-600 transition group-hover:text-terracotta-600 md:text-[2.1rem]"
        />
        {entry.category_hi && (
          <span className="mt-1 shrink-0 rounded-full bg-cream-200 px-2.5 py-0.5 font-deva text-[11px] font-medium text-earth-500">
            {entry.category_hi}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-earth-500/10 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-deva text-lg leading-snug text-ink-800">
            {entry.gondi_pronunciation}
          </span>
          <span className="truncate font-english text-xs italic text-ink-700/60">{roman}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-deva text-base text-ink-800">{entry.hindi}</span>
          <span className="truncate text-right font-english text-sm font-medium text-forest-600">
            {entry.english}
          </span>
        </div>
      </div>
    </Link>
  );
}
