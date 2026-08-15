/** Shared helpers for the converter. */

/** String → array of Unicode code points (surrogate-safe). */
export function toCodePoints(text: string): number[] {
  return Array.from(text).map((ch) => ch.codePointAt(0) ?? 0);
}

/** Number of Unicode code points (what a user perceives as characters). */
export function codePointLength(text: string): number {
  return Array.from(text).length;
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

/** True when the string contains at least one Masaram Gondi code point. */
export function containsMasaram(text: string): boolean {
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp >= 0x11d00 && cp <= 0x11d5f) return true;
  }
  return false;
}
