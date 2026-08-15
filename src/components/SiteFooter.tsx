"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin } from "lucide-react";

const SECTION_LINKS = [
  { href: "/", label: "खोज" },
  { href: "/browse", label: "श्रेणी" },
  { href: "/vakya", label: "वाक्यांश" },
  { href: "/converter", label: "Converter" },
  { href: "/grammar", label: "व्याकरण" },
  { href: "/keyboard", label: "कीबोर्ड" },
];

export function SiteFooter() {
  const path = usePathname();
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  return (
    <footer className="mt-16 border-t border-gold-400/20 bg-forest-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        {/* About the site */}
        <div>
          <h2 className="font-display text-lg text-cream-50">Masaram Gondi</h2>
          <p className="mt-1 font-gondi text-2xl text-gold-400" aria-hidden>
            𑴎𑴉𑴟𑴱𑴝𑴳
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream-200/75">
            मसराम गोंडी लिपि (Unicode U+11D00–U+11D5F) में गोंडी भाषा को सुरक्षित रखने का
            मंच — कोश, कन्वर्टर, व्याकरण और कीबोर्ड।
          </p>
        </div>

        {/* Site links */}
        <nav aria-label="फ़ुटर लिंक">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold-300">
            अनुभाग
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {SECTION_LINKS.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="font-deva text-cream-100/85 underline-offset-4 hover:text-gold-300 hover:underline"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/about"
                className="text-cream-100/85 underline-offset-4 hover:text-gold-300 hover:underline"
              >
                About · इस वेबसाइट के बारे में
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-cream-100/85 underline-offset-4 hover:text-gold-300 hover:underline"
              >
                Contact Us · लेखक परिचय
              </Link>
            </li>
            <li>
              <Link
                href="/contribute"
                className="text-cream-100/85 underline-offset-4 hover:text-gold-300 hover:underline"
              >
                योगदान · Contribute
              </Link>
            </li>
          </ul>
        </nav>

        {/* About the author */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold-300">
            About Author
          </h2>
          <p className="mt-3 font-deva text-base text-cream-50">Rajendra Saiyyam</p>
          <ul className="mt-2 space-y-2 text-sm text-cream-200/80">
            <li>
              <a
                href="mailto:sevajoharsaiyyam@gmail.com"
                className="inline-flex items-start gap-2 break-all underline-offset-4 hover:text-gold-300 hover:underline"
              >
                <Mail size={15} className="mt-0.5 shrink-0" aria-hidden />
                sevajoharsaiyyam@gmail.com
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                Naytola (Dorli), Damoh, Birsa,
                <br />
                Balaghat, M.P. — India
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-400/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm md:flex-row">
          <p>
            Create by <strong className="text-gold-300">Saiyyam Ji</strong> · Masaram Gondi
            Language Platform
          </p>
          <p className="text-cream-200/70">
            स्रोत: गोंडी करीयाट (गोंडी सिखाएं) · Unicode U+11D00–U+11D5F
          </p>
        </div>
      </div>
    </footer>
  );
}
