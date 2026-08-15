"use client";

import { Copy, Download, Share2 } from "lucide-react";

/**
 * Output actions: Copy · Download TXT · Share (Web Share API w/ copy fallback).
 * Full-width stacked rows on mobile, an evenly-spaced row from sm: up.
 * Swap lives in the workspace centre; Smart-Ra lives in Advanced Settings.
 */
export function ConverterControls({
  onCopy,
  onDownload,
  onShare,
  hasOutput,
}: {
  onCopy: () => void;
  onDownload: () => void;
  onShare: () => void;
  hasOutput: boolean;
}) {
  const btn =
    "inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[15px] font-medium transition " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 " +
    "disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto";

  return (
    <div className="mt-5 grid grid-cols-1 gap-2.5 border-t border-earth-500/10 pt-4 sm:flex sm:flex-wrap sm:items-center">
      <button
        type="button"
        onClick={onCopy}
        disabled={!hasOutput}
        className={`${btn} bg-terracotta-500 text-cream-50 shadow hover:bg-terracotta-600`}
      >
        <Copy size={16} aria-hidden /> कॉपी (Copy)
      </button>
      <button
        type="button"
        onClick={onDownload}
        disabled={!hasOutput}
        className={`${btn} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}
      >
        <Download size={16} aria-hidden /> Download TXT
      </button>
      <button
        type="button"
        onClick={onShare}
        disabled={!hasOutput}
        className={`${btn} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}
      >
        <Share2 size={16} aria-hidden /> Share
      </button>
    </div>
  );
}
