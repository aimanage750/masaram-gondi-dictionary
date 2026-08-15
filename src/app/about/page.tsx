import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "इस वेबसाइट के बारे में · About",
  description:
    "Masaram Gondi Language Platform के बारे में — कोश, कन्वर्टर, व्याकरण और कीबोर्ड। स्रोत: गोंडी करीयाट (गोंडी सिखाएं)।",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">About</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-forest-600">इस वेबसाइट के बारे में</h1>
      <p className="mt-2 font-gondi text-3xl text-terracotta-500" aria-hidden>
        𑴎𑴉𑴟𑴱𑴝𑴳 𑴧𑴺𑴛𑴱
      </p>

      <div className="mt-6 space-y-4 rounded-3xl border border-earth-500/10 bg-white p-6 text-ink-800 shadow-card md:p-8">
        <p className="font-deva leading-relaxed">
          यह वेबसाइट <strong>Masaram Gondi Language Platform</strong> है — मसराम गोंडी लिपि
          (Unicode U+11D00–U+11D5F) में गोंडी भाषा को सुरक्षित रखने, सीखने और लिखने का एक
          साझा मंच। मुंशी मंगल सिंह मसराम द्वारा 1918 में बनाई गई इस लिपि में ७५ अक्षर हैं।
        </p>

        <section aria-labelledby="about-sections">
          <h2 id="about-sections" className="mt-4 font-display text-xl text-forest-600">
            मंच के अनुभाग
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 font-deva">
            <li>
              <Link href="/" className="text-terracotta-600 underline underline-offset-2">खोज</Link> — गोंडी
              शब्दकोश: गोंडी उच्चारण, हिन्दी, English और मसराम गोंडी — हर रूप में खोज।
            </li>
            <li>
              <Link href="/browse" className="text-terracotta-600 underline underline-offset-2">श्रेणी</Link> —
              विषय के अनुसार शब्द।
            </li>
            <li>
              <Link href="/vakya" className="text-terracotta-600 underline underline-offset-2">वाक्यांश</Link> —
              गोंडी वाक्य (हिन्दी · English सहित)।
            </li>
            <li>
              <Link href="/converter" className="text-terracotta-600 underline underline-offset-2">Converter</Link> —
              देवनागरी → मसराम गोंडी यूनिकोड कन्वर्टर (और वापस)।
            </li>
            <li>
              <Link href="/grammar" className="text-terracotta-600 underline underline-offset-2">व्याकरण</Link> —
              संज्ञा से वाक्य तक व्याकरण पाठ।
            </li>
            <li>
              <Link href="/keyboard" className="text-terracotta-600 underline underline-offset-2">कीबोर्ड</Link> —
              मसराम गोंडी अक्षर लिखने का कीबोर्ड।
            </li>
            <li>
              <Link href="/contribute" className="text-terracotta-600 underline underline-offset-2">योगदान</Link> —
              स्रोत-सहित नया शब्द सुझाएँ।
            </li>
          </ul>
        </section>

        <section aria-labelledby="about-source">
          <h2 id="about-source" className="mt-4 font-display text-xl text-forest-600">
            स्रोत और नीति
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 font-deva">
            <li>
              प्राथमिक स्रोत अपलोड की गई पुस्तक <em>गोंडी करीयाट (गोंडी सिखाएं)</em> है। स्रोत
              में जो गोंडी उच्चारण छपा है, वही रखा गया है — अनुमान से नया गोंडी शब्द नहीं
              बनाया गया।
            </li>
            <li>सार्वजनिक परिणाम में केवल 4 क्षेत्र: Masaram Gondi, Gondi Pronunciation, हिन्दी, English।</li>
            <li>Roman Gondi / Roman Hindi केवल आंतरिक खोज के लिए हैं।</li>
            <li>खोज हर रूप में काम करती है — तल्ला, Talla, सिर, Head, 𑴛𑴧𑵅𑴧𑴱।</li>
            <li>
              कन्वर्टर का लिपि-मानचित्र (mapping v1.1) देवनागरी ⇄ मसराम गोंडी का १:१
              ध्वनि-मानचित्र है — विराम, हलंता, रेफ़ और र-कार सहित।
            </li>
          </ul>
        </section>

        <section aria-labelledby="about-culture">
          <h2 id="about-culture" className="mt-4 font-display text-xl text-forest-600">
            Culture &amp; Knowledge · संस्कृति और ज्ञान
          </h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 font-deva">
            <li>
              गोंडी भाषा द्रविड़ भाषा-परिवार से है और गोंडवाना क्षेत्र (मध्य भारत) की आदिवासी
              भाषा है — बोलियों समेत।
            </li>
            <li>
              मसराम गोंडी लिपि का सृजन <strong>मुंशी मंगल सिंह मसराम</strong> ने 1918 में किया;
              इसमें ७५ अक्षर हैं और यह Unicode U+11D00–U+11D5F में दर्ज है।
            </li>
            <li>
              गोंड चित्रकला, पेड़-वन-पर्वत की उपासना और सामुदायिक जीवन इस संस्कृति की पहचान
              है — यही भावना इस वेबसाइट के डिज़ाइन में है।
            </li>
          </ul>
          <p className="mt-2 text-xs text-ink-700/60">
            ये सामान्य, सुविदित तथ्य हैं; विस्तृत सामग्री स्रोत मिलने पर जोड़ी जाएगी।
          </p>
        </section>

        <p className="mt-4 border-t border-terracotta-500/15 pt-4 font-deva">
          Created &amp; Maintained by <strong>Rajendra Saiyyam</strong> ·{" "}
          <Link href="/contact" className="text-terracotta-600 underline underline-offset-2">
            Contact Us / लेखक परिचय
          </Link>
        </p>
      </div>
    </div>
  );
}
