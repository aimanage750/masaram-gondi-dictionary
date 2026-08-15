/** Shared helpers for the converter. */
import type { ConverterDirection } from "@/components/converter/ConverterModeTabs";

/** String → array of Unicode code points (surrogate-safe). */
export function toCodePoints(text: string): number[] {
  return Array.from(text).map((ch) => ch.codePointAt(0) ?? 0);
}

/** Number of Unicode code points (what a user perceives as characters). */
export function codePointLength(text: string): number {
  return Array.from(text).length;
}

/** Word count across scripts (Devanagari, Masaram Gondi, Latin, digits). */
export function wordCount(text: string): number {
  const m = text.trim().match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’.-]*/gu);
  return m ? m.length : 0;
}

/** Count code points belonging to the Masaram Gondi block. */
export function masaramCount(text: string): number {
  let n = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x11d00 && cp <= 0x11d5f) n += 1;
  }
  return n;
}

/** Copy text using the Clipboard API with a textarea fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Download text exactly as displayed (UTF-8, no reformatting). */
export function downloadText(
  text: string,
  filename = "masaram-gondi-conversion.txt"
): boolean {
  try {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
    return true;
  } catch {
    return false;
  }
}

/** Web Share API with graceful copy fallback. Never throws. */
export async function shareText(text: string): Promise<"shared" | "copied" | "failed"> {
  const nav = navigator as Navigator & {
    share?: (data: { text: string }) => Promise<void>;
  };
  if (typeof nav.share === "function") {
    try {
      await nav.share({ text });
      return "shared";
    } catch {
      return "failed"; // user dismissed the sheet
    }
  }
  return (await copyText(text)) ? "copied" : "failed";
}

/** True when the string contains at least one Masaram Gondi code point. */
export function containsMasaram(text: string): boolean {
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x11d00 && cp <= 0x11d5f) return true;
  }
  return false;
}

export type DetectedScript = "deva" | "masaram" | "mixed" | "none";

/**
 * Detect the dominant script of the input so the converter can switch
 * direction automatically: typing Masaram Gondi shows Hindi and typing
 * Hindi/Devanagari shows Masaram Gondi.
 */
export function detectScript(text: string): DetectedScript {
  let deva = 0;
  let masaram = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x0900 && cp <= 0x097f) deva += 1;
    else if (cp >= 0x11d00 && cp <= 0x11d5f) masaram += 1;
  }
  if (deva > 0 && masaram === 0) return "deva";
  if (masaram > 0 && deva === 0) return "masaram";
  if (deva > 0 && masaram > 0) return "mixed";
  return "none";
}

/* ---- Local conversion history (client-only, never sent to server) ---- */

export interface HistoryEntry {
  input: string;
  output: string;
  direction: ConverterDirection;
  at: number;
}

const HISTORY_KEY = "mgd-converter-history-v1";
const HISTORY_MAX = 8;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (e): e is HistoryEntry =>
          !!e &&
          typeof (e as HistoryEntry).input === "string" &&
          typeof (e as HistoryEntry).output === "string"
      )
      .slice(0, HISTORY_MAX);
  } catch {
    return []; // localStorage unavailable → converter still works
  }
}

export function saveHistory(list: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch {
    // storage unavailable (private mode etc.) — ignore silently
  }
}
