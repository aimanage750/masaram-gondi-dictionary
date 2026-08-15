import type { Metadata } from "next";
import Link from "next/link";
import { Converter } from "@/components/converter/Converter";
import { CharMapExplorer } from "@/components/converter/CharMapExplorer";
import { devanagariToMasaram } from "@/lib/mapping/masaram";

export const metadata: Metadata = {
  title: "Masaram Gondi Script Converter",
  description:
    "Hindi/Devanagari ↔ Masaram Gondi Unicode conversion with Unicode inspector, character map and on-screen keyboard. देवनागरी ⇄ मसराम गोंडी यूनिकोड कन्वर्टर (U+11D00–U+11D5F) — verified 1:1 mapping, no AI guesses.",
  alternates: { canonical: "/converter" },
};

export default function ConverterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-terracotta-500">
          Munshi Mangal Singh Masaram · 1918 · U+11D00
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-forest-600 md:text-4xl">
          Masaram Gondi Script Converter
        </h1>
        <p className="mt-2 font-deva text-lg text-terracotta-500">
          हिन्दी ⇄ मसराम गोंडी — Script Converter &amp; Unicode Tool
        </p>
        <p className="mx-auto mt-2 max-w-2xl font-deva text-sm leading-relaxed text-ink-700">
          हिन्दी टाइप करो — ७५ अक्षरों वाली मसराम गोंडी लिपि में तुरंत लिखो। या मसराम गोंडी
          लिखो — हिन्दी / देवनागरी में देखो। लिपि अपने आप पहचानी जाती है। कॉपी, swap,
          download, share, Unicode inspector और local history — सब इसी पेज पर।
        </p>
        <p className="mt-3 font-gondi text-3xl text-forest-600 md:text-4xl">
          {devanagariToMasaram("मसराम गोंडी")}
        </p>
      </section>

      <section aria-label="Converter" className="mt-8">
        <Converter />
      </section>

      <section aria-labelledby="map-heading" className="mt-12">
        <div className="rounded-2xl border-l-4 border-ochre-500 bg-[#fff1cc] p-4 text-sm leading-relaxed text-ink-700">
          दोनों लिपियाँ ब्राह्मी-शैली की अबुगिदा हैं, इसलिए १:१ ध्वनि-मानचित्र बनता है। मसराम में
          विराम (<span className="font-gondi text-base">𑵅</span>) युक्ताक्षर बनाता है, हलंता (
          <span className="font-gondi text-base">𑵄</span>) सिर्फ़ स्वर मारता है। र् → रेफ़{" "}
          <span className="font-gondi text-base">𑵆</span>, ्र → र-कार{" "}
          <span className="font-gondi text-base">𑵇</span>।
        </div>

        <h2 id="map-heading" className="mt-8 font-display text-2xl font-bold text-forest-600">
          अक्षर मानचित्र <span className="text-base font-normal text-ink-700/70">· Character map</span>
        </h2>
        <p className="mt-1 text-sm text-ink-700/70">
          खोजें Devanagari, मसराम गोंडी अक्षर या Unicode code point से; category filter के साथ।
        </p>
        <div className="mt-4">
          <CharMapExplorer />
        </div>
      </section>

      <section className="mt-10 text-center">
        <Link
          href="/keyboard"
          className="inline-flex items-center gap-2 rounded-xl border border-terracotta-500/40 px-5 py-2.5 text-sm font-semibold text-terracotta-600 hover:bg-terracotta-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          पूरा मसराम गोंडी कीबोर्ड खोलो →
        </Link>
      </section>
    </div>
  );
}
