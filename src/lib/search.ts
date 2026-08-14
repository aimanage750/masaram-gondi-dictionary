import type { DictionaryEntry, PublicEntry, SearchHit } from "@/lib/types";
import { isMasaramGondi } from "@/lib/mapping/masaram";
import { normalizeSearch } from "@/lib/mapping/romanize";
import { toPublic } from "@/lib/mapping/enrich";

const SEARCH_FIELDS: { key: keyof DictionaryEntry; label: string }[] = [
  { key: "gondi_script", label: "gondi_script" },
  { key: "gondi_pronunciation", label: "gondi_pronunciation" },
  { key: "roman_gondi", label: "roman_gondi" },
  { key: "roman_hindi", label: "roman_hindi" },
  { key: "hindi", label: "hindi" },
  { key: "english", label: "english" },
];

export function searchEntries(
  entries: DictionaryEntry[],
  query: string,
  opts?: { limit?: number; category?: string }
): SearchHit[] {
  const q = query.normalize("NFC").trim();
  if (!q) return [];
  const nq = normalizeSearch(q);
  const masaram = isMasaramGondi(q);
  const limit = opts?.limit ?? 40;

  const pool = opts?.category
    ? entries.filter((e) => e.category === opts.category && e.status === "published")
    : entries.filter((e) => e.status === "published");

  const hits: SearchHit[] = [];

  for (const entry of pool) {
    let best = 0;
    let matched = "";

    for (const { key, label } of SEARCH_FIELDS) {
      const raw = String(entry[key] ?? "");
      if (!raw) continue;
      const val = normalizeSearch(raw);
      const score = scoreMatch(nq, val, masaram && key === "gondi_script");
      if (score > best) {
        best = score;
        matched = label;
      }
    }

    // Also match multi-word english / hindi tokens
    if (best < 80) {
      const tokens = `${entry.english} ${entry.hindi} ${entry.roman_gondi} ${entry.roman_hindi}`
        .split(/[\s,/()-]+/)
        .map(normalizeSearch)
        .filter(Boolean);
      for (const t of tokens) {
        const score = scoreMatch(nq, t, false);
        if (score > best) {
          best = score;
          matched = "token";
        }
      }
    }

    if (best > 0) {
      hits.push({ entry: toPublic(entry), score: best, matched_on: matched });
    }
  }

  hits.sort((a, b) => b.score - a.score || a.entry.hindi.localeCompare(b.entry.hindi, "hi"));
  return hits.slice(0, limit);
}

function scoreMatch(q: string, val: string, unicodeExactBoost: boolean): number {
  if (!q || !val) return 0;
  if (val === q) return unicodeExactBoost ? 120 : 100;
  if (val.startsWith(q)) return 80;
  if (q.startsWith(val) && val.length >= 2) return 60;
  if (val.includes(q)) return 45;
  // fuzzy: allow 1-char slip for latin queries >= 4
  if (/^[a-z0-9]+$/.test(q) && q.length >= 4 && levenshtein(q, val) === 1) return 35;
  return 0;
}

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 99;
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function findById(entries: DictionaryEntry[], id: string): PublicEntry | null {
  const e = entries.find((x) => x.id === id && x.status === "published");
  return e ? toPublic(e) : null;
}
