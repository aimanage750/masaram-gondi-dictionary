import { Clock3 } from "lucide-react";

/** Badge shown wherever content awaits source verification. */
export function PendingBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ochre-500/15 px-2.5 py-0.5 text-xs font-medium text-ochre-600">
      <Clock3 size={12} aria-hidden />
      स्रोत की पुष्टि बाकी
    </span>
  );
}

/** Full-width notice for pending sections. */
export function PendingNote() {
  return (
    <p className="mt-3 rounded-xl border border-ochre-500/30 bg-ochre-500/10 px-3 py-2 text-sm text-ink-700">
      यह सामग्री स्रोत (पुस्तक / शब्दकोश) से पुष्ट होने पर पूरी की जाएगी। गोंडी शब्द या
      नियम अनुमान से नहीं जोड़े जाते।
    </p>
  );
}
