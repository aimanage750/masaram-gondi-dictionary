export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl">About this dictionary</h1>
      <div className="prose mt-6 max-w-none space-y-4 font-deva text-ink-800">
        <p>
          यह कोश <strong>Masaram Gondi</strong> लिपि (Unicode U+11D00–U+11D5F) में गोंडी शब्दों को
          सुरक्षित रखने के लिए बनाया गया है।
        </p>
        <p>
          प्राथमिक स्रोत अपलोड की गई पुस्तक <em>गोंडी करीयाट (गोंडी सिखाएं)</em> है। स्रोत में जो
          गोंडी उच्चारण छपा है, वही रखा गया है — अनुमान से नया गोंडी शब्द नहीं बनाया गया।
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>सार्वजनिक परिणाम में केवल 4 क्षेत्र: Masaram Gondi, Gondi Pronunciation, Hindi, English</li>
          <li>Roman Gondi / Roman Hindi केवल आंतरिक खोज के लिए</li>
          <li>खोज हर रूप में काम करती है — तल्ला, Talla, सिर, Head, 𑴛𑴧𑵅𑴧𑴱</li>
        </ul>
        <p>
          Created by <strong>Saiyyam Ji</strong>.
        </p>
      </div>
    </div>
  );
}
