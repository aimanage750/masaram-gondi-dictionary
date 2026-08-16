"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

/** Accessible confirmation dialog for destructive / publish actions. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center p-4"
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 bg-ink-900/50"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-earth-500/10 bg-white p-6 shadow-lift">
        <p className="flex items-center gap-2 font-english text-base font-bold text-ink-800">
          <AlertTriangle size={18} aria-hidden className="text-ochre-500" />
          {title}
        </p>
        <div className="mt-3 text-sm leading-relaxed text-ink-700/90">{message}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-[42px] items-center rounded-full border border-earth-500/25 px-5 py-2 text-sm font-semibold text-ink-700 hover:bg-cream-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2 text-sm font-semibold text-cream-50 shadow-card hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 disabled:opacity-60"
          >
            {busy && <Loader2 size={14} aria-hidden className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
