import type { Metadata } from "next";
import { listSentences } from "@/lib/data/store";
import { toPublicSentence } from "@/lib/mapping/enrich";
import { GondiScript } from "@/components/GondiScript";
import { SpeakButton } from "@/components/SpeakButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "वाक्यांश",
  description: "Masaram Gondi sentences with Gondi Pronunciation, Hindi and English.",
};

export default async function VakyaPage() {
  const rows = (await listSentences(false)).map(toPublicSentence);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-gold-300">Sentences</p>
      <h1 className="font-display text-3xl text-cream-50">वाक्यांश</h1>
      <p className="mt-2 font-deva text-lg text-cream-100/90">गोंडी वाक्य · हिन्दी · English</p>
      <p className="mt-1 text-sm text-cream-200/70">
        केवल किताब से सुने और लिखे गए वाक्य। अनुमान से कुछ नहीं जोड़ा जाता।
      </p>

      {rows.length === 0 ? (
        <div className="gond-frame mt-8 rounded-2xl bg-cream-50 p-6">
          <p className="font-gondi text-3xl text-forest-600">𑴎𑴉𑴟𑴱𑴝𑴳</p>
          <p className="mt-3 font-deva text-xl text-ink-800">वाक्य जल्द यहाँ आएंगे।</p>
          <p className="mt-2 font-deva text-ink-700">
            किताब सुनकर और देखकर वाक्यांश अपलोड होंगे। तब हर वाक्य चार फ़ील्ड में दिखेगा:
          </p>
          <ol className="mt-4 space-y-2 font-deva text-ink-800">
            <li>1. Masaram Gondi</li>
            <li>2. Gondi Pronunciation</li>
            <li>3. हिन्दी</li>
            <li>4. English</li>
          </ol>
          <p className="mt-4 text-sm text-ink-700/70">
            अपलोड Admin → वाक्यांश से होगा। पेज तैयार है — सूची खाली रखना सही है।
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((s) => (
            <li key={s.id} className="gond-frame rounded-2xl bg-cream-50 p-5">
              <p className="text-xs uppercase tracking-wide text-forest-500">Masaram Gondi</p>
              <GondiScript text={s.gondi_script} className="mt-1 block text-3xl text-forest-600" />
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-ink-700/60">Gondi Pronunciation</dt>
                  <dd className="flex flex-wrap items-center gap-2 font-deva text-xl">
                    {s.gondi_pronunciation}
                    <SpeakButton text={s.gondi_pronunciation} />
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-700/60">Hindi</dt>
                  <dd className="font-deva text-lg">{s.hindi}</dd>
                </div>
                <div>
                  <dt className="text-ink-700/60">English</dt>
                  <dd className="text-lg">{s.english}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
