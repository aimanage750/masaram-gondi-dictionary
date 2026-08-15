import type { Metadata } from "next";
import Link from "next/link";
import { Keyboard, Shuffle } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CulturalDivider } from "@/components/ui/CulturalDivider";
import { KEYBOARD_LAYOUT, devanagariToMasaram } from "@/lib/mapping/masaram";

export const metadata: Metadata = {
  title: "Script Learning · लिपि सीखें",
  description:
    "Learn the Masaram Gondi script — vowels (स्वर), consonants (व्यंजन), vowel signs (मात्राएँ), signs and numbers. 75 characters, Unicode U+11D00–U+11D5F, created by Munshi Mangal Singh Masaram (1918).",
  alternates: { canonical: "/script" },
};

type Key = { label: string; value: string; hint?: string };

function GlyphCard({ k }: { k: Key }) {
  const cp = (k.value.codePointAt(k.label.startsWith("◌") ? 1 : 0) ?? 0)
    .toString(16)
    .toUpperCase();
  return (
    <div className="group rounded-2xl border border-earth-500/10 bg-white p-3 text-center shadow-card transition hover:-translate-y-0.5 hover:border-terracotta-500/40">
      <p className="font-gondi text-3xl text-forest-600 transition group-hover:text-terracotta-500 md:text-4xl">
        {k.label}
      </p>
      <p className="mt-1 font-deva text-sm text-ink-800">{k.hint}</p>
      <p className="text-[10px] uppercase tracking-wide text-ink-700/50">U+{cp}</p>
    </div>
  );
}

function Section({ id, title, sub, keys }: { id: string; title: string; sub: string; keys: Key[] }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 id={id} className="font-display text-2xl text-forest-600">
          {title}
        </h2>
        <p className="text-sm text-ink-700/70">{sub}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {keys.map((k) => (
          <GlyphCard key={`${k.label}-${k.value}`} k={k} />
        ))}
      </div>
    </section>
  );
}

export default function ScriptPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <SectionTitle
        kicker="Script Learning"
        title="मसराम गोंडी लिपि सीखें"
        sub="मुंशी मंगल सिंह मसराम (1918) द्वारा रचित लिपि — ७५ अक्षर · Unicode U+11D00–U+11D5F। बड़े अक्षर, उच्चारण-संकेत और कोड के साथ।"
        divider
      />

      <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-earth-500/10 bg-white p-6 text-center shadow-card">
        <p className="font-gondi text-4xl text-terracotta-500" aria-hidden>
          {devanagariToMasaram("मसराम गोंडी")}
        </p>
        <p className="mt-2 font-deva text-ink-800">
          दोनों लिपियाँ ब्राह्मी-शैली की अबुगिदा हैं — हर व्यंजन में अंतर्निहित &ldquo;अ&rdquo; स्वर
          है; मात्राएँ उसे बदलती हैं।
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/keyboard"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-card hover:bg-forest-500"
          >
            <Keyboard size={16} aria-hidden /> कीबोर्ड से अभ्यास करें
          </Link>
          <Link
            href="/converter"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-terracotta-500/40 px-5 py-2.5 text-sm font-semibold text-terracotta-600 hover:bg-terracotta-500/10"
          >
            <Shuffle size={16} aria-hidden /> Converter खोलें
          </Link>
        </div>
      </div>

      <Section id="swar" title="स्वर · Vowels" sub="अ → 𑴀" keys={KEYBOARD_LAYOUT.vowels} />
      <Section
        id="vyanjan"
        title="व्यंजन · Consonants"
        sub="क → 𑴌 … ळ → 𑴭, संयुक्त क्ष ज्ञ त्र सहित"
        keys={KEYBOARD_LAYOUT.consonants}
      />
      <Section
        id="matra"
        title="मात्राएँ व चिह्न · Vowel signs & marks"
        sub="ा ि ी ु ू … विराम, हलंता, रेफ़, र-कार"
        keys={KEYBOARD_LAYOUT.signs}
      />
      <Section id="ank" title="अंक · Numbers" sub="० → 𑵐 … ९ → 𑵙" keys={KEYBOARD_LAYOUT.digits} />

      <div className="mt-14">
        <CulturalDivider className="text-terracotta-500" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-ink-700/80">
          सीखने का सरल क्रम: पहले स्वर, फिर व्यंजन, फिर मात्राओं से जोड़कर पढ़ना। कीबोर्ड पर
          रोज़ ५ मिनट अभ्यास — और Converter में अपना नाम लिखकर देखें।
        </p>
      </div>
    </div>
  );
}
