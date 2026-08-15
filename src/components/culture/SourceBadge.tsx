import type { CultureSource } from "@/data/culture/types";

/** Compact, honest source attribution pill. */
export function SourceBadge({ s, className = "" }: { s: CultureSource; className?: string }) {
  return (
    <p className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-snug text-ink-700/60 ${className}`}>
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-gold-500" />
      <span>
        Source: {s.source}
        {s.source_year ? ` · ${s.source_year}` : ""}
      </span>
      {s.source_url && (
        <a
          href={s.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-terracotta-500 underline underline-offset-2"
        >
          link
        </a>
      )}
      {s.note && <span className="text-ink-700/50">({s.note})</span>}
      <span className="text-ink-700/45">· verified {s.last_verified}</span>
    </p>
  );
}
