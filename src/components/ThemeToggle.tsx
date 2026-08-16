"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

const OPTIONS: { id: ThemeChoice; label: string; title: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Light", title: "Light theme · लाइट थीम", Icon: Sun },
  { id: "dark", label: "Dark", title: "Dark theme · डार्क थीम", Icon: Moon },
  { id: "system", label: "System", title: "Follow system theme · सिस्टम थीम", Icon: Monitor },
];

function applyTheme(choice: ThemeChoice) {
  const dark =
    choice === "dark" ||
    (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/** Compact Light / Dark / System switcher for the public header.
 * The pre-paint script in the root layout already applied the saved theme,
 * so this component only syncs state + listens for system changes. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: ThemeChoice =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setChoice(initial);
    applyTheme(initial);
    setMounted(true);

    // System mode reacts live to OS/browser preference changes.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) ?? "system") as ThemeChoice;
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const select = useCallback((next: ThemeChoice) => {
    setChoice(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — theme still applies for this visit */
    }
    applyTheme(next);
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Theme · थीम चुनें"
      className={`inline-flex items-center gap-0.5 rounded-full border border-earth-500/20 bg-white p-0.5 shadow-card ${className}`}
    >
      {OPTIONS.map(({ id, label, title, Icon }) => {
        const active = mounted && choice === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={title}
            title={title}
            onClick={() => select(id)}
            className={`inline-flex min-h-[32px] items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta-500 ${
              active
                ? "bg-forest-600 text-cream-50 shadow-card"
                : "text-ink-700 hover:bg-cream-200 hover:text-ink-800"
            }`}
          >
            <Icon size={13} aria-hidden />
            <span className="hidden md:inline">{label}</span>
            {active && <span className="sr-only"> (selected)</span>}
          </button>
        );
      })}
    </div>
  );
}
