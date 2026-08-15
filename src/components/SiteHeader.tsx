"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

/** Tabs shown on every screen size (mobile shows only these three). */
const CORE_TABS = [
  { href: "/", label: "खोज", hint: "शब्द" },
  { href: "/browse", label: "श्रेणी", hint: "विषय" },
  { href: "/vakya", label: "वाक्यांश", hint: "वाक्य" },
];

/** Extra tabs shown inline on desktop/tablet only. */
const DESKTOP_TABS = [
  { href: "/converter", label: "Converter", hint: "लिपि" },
  { href: "/grammar", label: "व्याकरण", hint: "grammar" },
];

/** Items inside the mobile hamburger menu. */
const MENU = [
  { href: "/converter", label: "Converter", hint: "देवनागरी → मसराम गोंडी" },
  { href: "/grammar", label: "व्याकरण", hint: "Grammar" },
  { href: "/keyboard", label: "कीबोर्ड", hint: "Masaram keyboard" },
  { href: "/contribute", label: "योगदान", hint: "शब्द सुझाएँ" },
  { href: "/about", label: "परिचय", hint: "About" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  function tabActive(href: string) {
    return path === href || (href !== "/" && path.startsWith(href));
  }

  function tabClass(on: boolean) {
    return on
      ? "bg-gradient-to-b from-terracotta-400 to-terracotta-500 text-cream-50 shadow-[0_8px_18px_rgba(196,92,38,0.35)]"
      : "bg-forest-800/70 text-cream-100/85 hover:bg-forest-600/70 hover:text-cream-50";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gold-400/20 bg-forest-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-terracotta-500 font-gondi text-lg text-cream-50 shadow-inset">
            𑴎
          </span>
          <span>
            <span className="block font-display text-lg leading-none text-cream-50">
              Masaram Gondi
            </span>
            <span className="font-deva text-sm text-gold-300">गोंडी भाषा मंच</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="hidden rounded-full border border-gold-400/40 px-3 py-1.5 text-sm text-gold-300 hover:bg-gold-400/10 md:inline"
          >
            Admin
          </Link>
          <button
            className="rounded-lg p-2 text-cream-50 hover:bg-forest-600/60 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "मेनू बंद करें" : "मेनू खोलें"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile: three core tabs + hamburger for the rest */}
      <nav
        className="mx-auto grid max-w-6xl grid-cols-3 gap-1 px-3 pb-2 md:hidden"
        aria-label="मुख्य टैब"
      >
        {CORE_TABS.map((n) => {
          const on = tabActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-xl px-2 py-2 text-center transition ${tabClass(on)}`}
              aria-current={on ? "page" : undefined}
            >
              <span className="block font-deva text-base leading-none">{n.label}</span>
              <span className={`mt-1 block text-[11px] ${on ? "text-cream-100/85" : "text-cream-200/55"}`}>
                {n.hint}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop / tablet: all five main tabs in one row */}
      <nav
        className="mx-auto hidden max-w-6xl grid-cols-5 gap-1 px-3 pb-2 md:grid"
        aria-label="मुख्य टैब"
      >
        {[...CORE_TABS, ...DESKTOP_TABS].map((n) => {
          const on = tabActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-xl px-2 py-2 text-center transition ${tabClass(on)}`}
              aria-current={on ? "page" : undefined}
            >
              <span className="block font-deva text-base leading-none">{n.label}</span>
              <span className={`mt-1 block text-[11px] ${on ? "text-cream-100/85" : "text-cream-200/55"}`}>
                {n.hint}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile menu */}
      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-gold-400/15 px-4 py-3 md:hidden"
          aria-label="अतिरिक्त मेनू"
        >
          {MENU.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 hover:bg-forest-600/60 ${
                tabActive(n.href) ? "text-gold-300" : "text-cream-100"
              }`}
              aria-current={tabActive(n.href) ? "page" : undefined}
            >
              <span className="block font-deva text-base leading-tight">{n.label}</span>
              <span className="block text-xs text-cream-200/55">{n.hint}</span>
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-lg px-3 py-2.5 text-gold-300 hover:bg-forest-600/60"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
