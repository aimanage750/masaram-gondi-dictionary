import type { Metadata } from "next";
import { Mail, MapPin, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us · लेखक परिचय",
  description:
    "Masaram Gondi Language Platform — About Author: Rajendra Saiyyam, Naytola (Dorli), Damoh, Birsa, Balaghat, M.P., India.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">Contact Us</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-forest-600">About Author · लेखक परिचय</h1>

      <div className="mt-6 rounded-3xl border border-earth-500/10 bg-white p-6 text-ink-800 shadow-card md:p-8">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-forest-500 text-cream-50">
            <User size={28} aria-hidden />
          </span>
          <div>
            <p className="font-display text-2xl text-ink-800">Myself Rajendra Saiyyam</p>
            <p className="font-deva text-sm text-ink-700/80">
              Masaram Gondi Language Platform के निर्माता
            </p>
          </div>
        </div>

        <dl className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <dt className="mt-1 shrink-0 text-terracotta-600" aria-label="Email">
              <Mail size={20} aria-hidden />
            </dt>
            <dd>
              <p className="text-xs uppercase tracking-wide text-ink-700/60">Email</p>
              <a
                href="mailto:sevajoharsaiyyam@gmail.com"
                className="break-all font-medium text-terracotta-600 underline-offset-2 hover:underline"
              >
                sevajoharsaiyyam@gmail.com
              </a>
            </dd>
          </div>
          <div className="flex items-start gap-3">
            <dt className="mt-1 shrink-0 text-terracotta-600" aria-label="पता">
              <MapPin size={20} aria-hidden />
            </dt>
            <dd>
              <p className="text-xs uppercase tracking-wide text-ink-700/60">Address / पता</p>
              <p className="font-medium leading-relaxed">
                Naytola (Dorli), Damoh, Birsa,
                <br />
                Balaghat, Madhya Pradesh — India
              </p>
            </dd>
          </div>
        </dl>

        <p className="mt-6 rounded-xl border border-forest-500/25 bg-forest-500/10 px-4 py-3 font-deva text-sm leading-relaxed text-ink-700">
          गोंडी भाषा और मसराम गोंडी लिपि को सुरक्षित रखने के इस प्रयास में आपके सुझाव,
          स्रोत-सामग्री या सहयोग का स्वागत है। ऊपर दिए गए ईमेल पर संपर्क करें।
        </p>
      </div>

      <p className="mt-6 text-center font-deva text-ink-800">
        Created &amp; Maintained by <strong className="text-terracotta-600">Rajendra Saiyyam</strong>
      </p>
    </div>
  );
}
