"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Home,
  Languages,
  Menu,
  MessageSquareText,
  PenLine,
  Users,
  X,
} from "lucide-react";
import { TreeLogo } from "@/components/brand/TreeLogo";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Dictionary", icon: BookOpen },
  { href: "/translator", label: "Translator", icon: Languages },
  { href: "/grammar", label: "Grammar", icon: GraduationCap },
  { href: "/vakya", label: "Sentences", icon: MessageSquareText },
  { href: "/script", label: "Script", icon: PenLine },
  { href: "/about", label: "About Us", icon: Users },
];

const MORE = [
  { href: "/converter", label: "Converter", hint: "देवनागरी ⇄ मसराम गोंडी" },
  { href: "/keyboard", label: "कीबोर्ड", hint: "Masaram keyboard" },
  { href: "/contribute", label: "योगदान", hint: "शब्द सुझाएँ" },
  { href: "/contact", label: "Contact Us", hint: "लेखक परिचय" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  function active(href: string) {
    if (href === "/") return path === "/";
    return path.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-earth-500/15 bg-cream-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          <TreeLogo className="h-11 w-11 md:h-12 md:w-12" />
          <span className="min-w-0">
            <span className="block truncate font-english text-lg font-bold leading-tight tracking-tight text-forest-600 md:text-xl">
              Masaram Gondi
            </span>
            <span className="block font-english text-sm font-semibold leading-tight text-terracotta-500 md:text-base">
              Script Dictionary
            </span>
            <span className="hidden font-english text-[11px] tracking-wide text-ink-700/70 sm:block">
              Preserving Our Language • Our Identity
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const on = active(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  on
                    ? "bg-terracotta-500 text-cream-50 shadow-card"
                    : "text-ink-800 hover:bg-cream-200 hover:text-forest-600"
                }`}
              >
                <Icon size={15} aria-hidden />
                {n.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="ml-2 rounded-full border border-forest-600/25 px-3.5 py-1.5 text-sm font-medium text-forest-600 transition hover:bg-forest-600 hover:text-cream-50"
          >
            Admin
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-xl p-2 text-forest-600 hover:bg-cream-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "मेनू बंद करें" : "मेनू खोलें"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-earth-500/10 bg-cream-100 px-4 pb-4 pt-2 lg:hidden"
        >
          <div className="grid grid-cols-2 gap-1.5">
            {NAV.map((n) => {
              const on = active(n.href);
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={on ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    on ? "bg-terracotta-500 text-cream-50" : "bg-cream-200/70 text-ink-800"
                  }`}
                >
                  <Icon size={15} aria-hidden />
                  {n.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-2 space-y-1">
            {MORE.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between rounded-xl px-3 py-2.5 hover:bg-cream-200"
              >
                <span className="font-deva text-sm font-medium text-ink-800">{n.label}</span>
                <span className="text-xs text-ink-700/60">{n.hint}</span>
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-forest-600 hover:bg-cream-200"
            >
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
