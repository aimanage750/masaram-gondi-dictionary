import type { Metadata } from "next";
import { Mail, MapPin, User } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us · संपर्क करें | Masaram Gondi Language Platform",
  description:
    "Masaram Gondi Language Platform से सुझाव, सहयोग, भाषा-सामग्री या तकनीकी समस्या के लिए संपर्क करें।",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">Contact Us</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-forest-600 md:text-4xl">संपर्क करें · Contact Us</h1>
      <p className="mt-3 max-w-2xl font-deva leading-relaxed text-ink-700">
        Masaram Gondi Language Platform से संबंधित सुझाव, सहयोग, भाषा-सामग्री, तकनीकी समस्या या अन्य जानकारी के लिए हमसे संपर्क करें।
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <ContactForm />

        <aside className="rounded-3xl border border-earth-500/10 bg-white p-6 text-ink-800 shadow-card md:p-8">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-forest-500 text-cream-50">
              <User size={28} aria-hidden />
            </span>
            <div>
              <p className="font-display text-2xl">Rajendra Saiyyam</p>
              <p className="font-deva text-sm text-ink-700/80">Masaram Gondi Language Platform के निर्माता</p>
            </div>
          </div>

          <dl className="mt-6 space-y-5">
            <div className="flex items-start gap-3">
              <dt className="mt-1 shrink-0 text-terracotta-600"><Mail size={20} aria-hidden /><span className="sr-only">Email</span></dt>
              <dd>
                <p className="text-xs uppercase tracking-wide text-ink-700/60">Email</p>
                <a href="mailto:sevajoharsaiyyam@gmail.com" className="break-all font-medium text-terracotta-600 underline-offset-2 hover:underline">sevajoharsaiyyam@gmail.com</a>
              </dd>
            </div>
            <div className="flex items-start gap-3">
              <dt className="mt-1 shrink-0 text-terracotta-600"><MapPin size={20} aria-hidden /><span className="sr-only">पता</span></dt>
              <dd>
                <p className="text-xs uppercase tracking-wide text-ink-700/60">Address / पता</p>
                <p className="font-medium leading-relaxed">Nayatola (Dorli), Damoh, Birsa,<br />Balaghat, Madhya Pradesh — India</p>
              </dd>
            </div>
          </dl>

          <p className="mt-6 rounded-xl border border-forest-500/25 bg-forest-500/10 px-4 py-3 font-deva text-sm leading-relaxed text-ink-700">
            गोंडी भाषा और मसराम गोंडी लिपि को सुरक्षित रखने के इस प्रयास में आपके सुझाव, स्रोत-सामग्री या सहयोग का स्वागत है।
          </p>
        </aside>
      </div>

      <p className="mt-6 text-center font-deva text-ink-800">
        Created &amp; Maintained by <strong className="text-terracotta-600">Rajendra Saiyyam</strong>
      </p>
    </div>
  );
}
