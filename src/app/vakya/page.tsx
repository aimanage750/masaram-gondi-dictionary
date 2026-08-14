import { listSentences } from "@/lib/data/store";
import { toPublicSentence } from "@/lib/mapping/enrich";
import { GondiScript } from "@/components/GondiScript";
import { SpeakButton } from "@/components/SpeakButton";

export const dynamic = "force-dynamic";

export default async function VakyaPage() {
  const rows = (await listSentences(false)).map(toPublicSentence);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-terracotta-600">Sentences</p>
      <h1 className="font-display text-3xl text-ink-800">वाक्यांश</h1>
      <p className="mt-2 font-deva text-ink-700">
        गोंडी वाक्य · हिन्दी · English. केवल किताब से लिए गए वाक्य।
      </p>

      {rows.length === 0 ? (
        <div className="gond-frame mt-8 rounded-2xl bg-cream-50 p-6">
          <p className="font-deva text-lg">अभी कोई वाक्यांश प्रकाशित नहीं है।</p>
          <p className="mt-2 text-sm text-ink-700/70">
            एडमिन किताब/PDF से वाक्य जोड़ने के बाद यहाँ दिखेंगे। गोंडी वाक्य अनुमान से नहीं बनाए जाते।
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
