import type { GrammarExample } from "@/data/grammar/types";
import { GondiScript } from "@/components/GondiScript";

/** One sourced example: Gondi script, pronunciation, Hindi, English, source. */
export function ExampleBox({ example }: { example: GrammarExample }) {
  return (
    <div className="rounded-xl border border-ink-800/10 bg-white/70 p-4">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <GondiScript
          text={example.gondi_script}
          className="text-3xl text-forest-600"
        />
        <span className="font-deva text-lg text-ink-800">
          {example.gondi_pronunciation}
        </span>
      </div>
      <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-ink-700/60">हिन्दी:</dt>
          <dd className="font-deva text-ink-800">{example.hindi}</dd>
        </div>
        {example.english && (
          <div className="flex gap-1.5">
            <dt className="text-ink-700/60">English:</dt>
            <dd className="text-ink-800">{example.english}</dd>
          </div>
        )}
      </dl>
      <p className="mt-2 text-xs text-ink-700/60">
        स्रोत: {example.source}
        {example.note ? ` · ${example.note}` : ""}
      </p>
    </div>
  );
}
