import type { Metadata } from "next";
import Link from "next/link";
import { Converter } from "@/components/converter/Converter";
import { KEYBOARD_LAYOUT } from "@/lib/mapping/masaram";

export const metadata: Metadata = {
  title: "Masaram Gondi Script Converter",
  description:
    "Hindi, Roman and supported language input to Masaram Gondi script conversion. देवनागरी → मसराम गोंडी यूनिकोड कन्वर्टर (U+11D00–U+11D5F)।",
  alternates: { canonical: "/converter" },
};

type MapRow = { deva: string; gondi: string; cp: string };

function rowsFrom(
  keys: { label: string; value: string; hint?: string }[]
): MapRow[] {
  return keys.map((k) => ({
    deva: k.hint ?? "",
    gondi: k.label.replace("◌", ""),
    cp: `U+${(k.value.codePointAt(0) ?? 0).toString(16).toUpperCase()}`,
  }));
}

const VOWELS = rowsFrom(KEYBOARD_LAYOUT.vowels);
const CONSONANTS = rowsFrom(KEYBOARD_LAYOUT.consonants);
const SIGNS = rowsFrom(KEYBOARD_LAYOUT.signs);
const DIGITS = rowsFrom(KEYBOARD_LAYOUT.digits);
const MATRAS = SIGNS.filter((r) => r.deva.length === 1 && "ािीुूृेैोौंः़ॅ".includes(r.deva));
const SPECIALS = SIGNS.filter((r) => !MATRAS.includes(r));

function MapTable({ title, rows }: { title: string; rows: MapRow[] }) {
  return (
    <div className="rounded-2xl border border-ochre-500/25 bg-cream-50 p-4 shadow-card">
      <h3 className="mb-3 font-deva text-lg font-bold text-terracotta-700">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-base">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.06em] text-terracotta-700">
              <th scope="col" className="border-b border-ink-800/15 px-2 py-1.5 font-semibold">देवनागरी</th>
              <th scope="col" className="border-b border-ink-800/15 px-2 py-1.5 font-semibold">गोंडी</th>
              <th scope="col" className="border-b border-ink-800/15 px-2 py-1.5 font-semibold">कोड</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.gondi}-${r.cp}`} className="odd:bg-white/50">
                <td className="border-b border-ink-800/10 px-2 py-1.5 font-deva">{r.deva}</td>
                <td className="border-b border-ink-800/10 px-2 py-1.5 font-gondi text-2xl text-terracotta-700">
                  {r.gondi}
                </td>
                <td className="border-b border-ink-800/10 px-2 py-1.5 text-xs text-forest-500">{r.cp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ConverterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold-400">
          Munshi Mangal Singh Masaram · 1918 · U+11D00
        </p>
        <h1 className="mt-3 font-display text-3xl text-cream-50 md:text-4xl">
          Masaram Gondi Script Converter
        </h1>
        <p className="mt-2 font-deva text-lg text-cream-100/90">
          हिन्दी / Roman / Gondi → Masaram Gondi Script
        </p>
        <p className="mx-auto mt-2 max-w-2xl font-deva text-sm leading-relaxed text-cream-200/80">
          हिन्दी टाइप करो — ७५ अक्षरों वाली मसराम गोंडी लिपि में तुरंत लिखो। देवनागरी से मसराम
          गोंडी और वापस — सब कुछ यूनिकोड में, इसी वेबसाइट के अंदर।
        </p>
        <p className="mt-3 font-gondi text-3xl text-gold-400 md:text-4xl">
          𑴤𑴫𑴦𑴱𑴤 𑴎𑴽𑵀𑴘𑴳
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

        <h2 id="map-heading" className="mt-8 font-display text-2xl text-cream-50">
          अक्षर मानचित्र <span className="text-base font-normal text-cream-200/70">· Character map</span>
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <MapTable title="स्वर" rows={VOWELS} />
          <MapTable title="मात्राएँ" rows={MATRAS} />
          <MapTable title="चिह्न / संयुक्त" rows={SPECIALS} />
          <MapTable title="अंक" rows={DIGITS} />
        </div>
        <div className="mt-4">
          <MapTable title="व्यंजन" rows={CONSONANTS} />
        </div>
      </section>

      <section className="mt-10 text-center">
        <Link
          href="/keyboard"
          className="inline-flex items-center gap-2 rounded-xl border border-gold-400/40 px-5 py-2.5 text-sm text-gold-300 hover:bg-gold-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
        >
          पूरा मसराम गोंडी कीबोर्ड खोलो →
        </Link>
      </section>
    </div>
  );
}
