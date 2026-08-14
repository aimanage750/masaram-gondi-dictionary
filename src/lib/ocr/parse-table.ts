export type DraftRow = {
  key: string;
  gondi_pronunciation: string;
  hindi: string;
  english: string;
  category: string;
  source_page: string;
  keep: boolean;
};

const DEV = /[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*/g;
const LAT = /[A-Za-z][A-Za-z .'\-]{1,40}/g;

export function parseOcrToRows(text: string, category = "general", page = ""): DraftRow[] {
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/[|│]/g, " ").replace(/\s+/g, " ").trim())
    .filter((l) => l.length >= 3)
    .filter((l) => !/^(गोंडी|हिन्दी|हिंदी|अंग्रेजी|तक्ता)/.test(l));

  const rows: DraftRow[] = [];
  let n = 0;
  for (const line of lines) {
    const deva = line.match(DEV) ?? [];
    const lat = (line.match(LAT) ?? []).map((s) => s.trim()).filter((s) => s.length > 1);
    if (deva.length >= 2 && lat.length >= 1) {
      rows.push(makeRow(++n, deva[0] ?? "", deva.slice(1).join(" "), lat[0] ?? "", category, page));
      if (deva.length >= 4 && lat.length >= 2) {
        rows.push(makeRow(++n, deva[2] ?? "", deva.slice(3).join(" "), lat[1] ?? "", category, page));
      }
      continue;
    }
    if (deva.length === 1 && lat.length >= 1) {
      rows.push(makeRow(++n, deva[0] ?? "", "", lat[0] ?? "", category, page));
    }
  }
  return rows;
}

function makeRow(
  n: number,
  gondi: string,
  hindi: string,
  english: string,
  category: string,
  page: string
): DraftRow {
  return {
    key: `r${n}-${Date.now()}`,
    gondi_pronunciation: gondi.trim(),
    hindi: hindi.trim(),
    english: title(english),
    category,
    source_page: page,
    keep: Boolean(gondi.trim() && (hindi.trim() || english.trim())),
  };
}

function title(s: string) {
  const t = s.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function emptyRow(category = "general"): DraftRow {
  return {
    key: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    gondi_pronunciation: "",
    hindi: "",
    english: "",
    category,
    source_page: "",
    keep: true,
  };
}
