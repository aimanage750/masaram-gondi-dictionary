import Link from "next/link";
import type { PublicEntry } from "@/lib/types";
import { GondiScript } from "@/components/GondiScript";

export function WordCard({ entry }: { entry: PublicEntry }) {
  return (
    <Link
      href={`/word/${entry.id}`}
      className="gond-frame group block rounded-2xl bg-white p-4 transition hover:-translate-y-0.5 hover:border-terracotta-500"
    >
      <GondiScript text={entry.gondi_script} className="text-3xl text-forest-600" />
      <dl className="mt-3 space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-36 shrink-0 text-ink-700/70">Gondi Pronunciation</dt>
          <dd className="font-deva text-base text-ink-800">{entry.gondi_pronunciation}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-36 shrink-0 text-ink-700/70">Hindi</dt>
          <dd className="font-deva text-base">{entry.hindi}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-36 shrink-0 text-ink-700/70">English</dt>
          <dd>{entry.english}</dd>
        </div>
      </dl>
    </Link>
  );
}
