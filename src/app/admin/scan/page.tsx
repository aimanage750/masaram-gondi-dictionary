"use client";

import { useEffect, useState } from "react";
import { Camera, Plus, Trash2, Save, Sparkles } from "lucide-react";
import { CATEGORY_META } from "@/data/raw-entries";
import { DraftRow, emptyRow, parseOcrToRows } from "@/lib/ocr/parse-table";
import { devanagariToMasaram } from "@/lib/mapping/masaram";

export default function ScanPage() {
  const [csrf, setCsrf] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [ocr, setOcr] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [category, setCategory] = useState("body");
  const [page, setPage] = useState("");
  const [rows, setRows] = useState<DraftRow[]>([emptyRow("body")]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setErr(null);
    setMsg(null);
    const url = URL.createObjectURL(file);
    setPhoto(url);
  }

  async function runOcr() {
    if (!photo) {
      setErr("पहले किताब के पन्ने की फोटो लें।");
      return;
    }
    setBusy(true);
    setProgress("OCR शुरू…");
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const result = await Tesseract.recognize(photo, "hin+eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(`पढ़ रहा है… ${Math.round((m.progress || 0) * 100)}%`);
          }
        },
      });
      const text = result.data.text || "";
      setOcr(text);
      const parsed = parseOcrToRows(text, category, page);
      setRows(parsed.length ? parsed : [emptyRow(category)]);
      setMsg(
        parsed.length
          ? `OCR ने ${parsed.length} पंक्तियाँ सुझाईं। हर गोंडी शब्द किताब से मिलाकर सुधारें — गलत मत सेव करें।`
          : "OCR साफ टेबल नहीं पढ़ सका। फोटो देखकर नीचे खुद पंक्तियाँ भरें।"
      );
    } catch (e) {
      setErr((e as Error).message || "OCR असफल");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function update(i: number, patch: Partial<DraftRow>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function save() {
    const ready = rows.filter(
      (r) => r.keep && r.gondi_pronunciation.trim() && r.hindi.trim() && r.english.trim()
    );
    if (!ready.length) {
      setErr("कम से कम एक पूरी पंक्ति चाहिए: गोंडी + हिन्दी + English");
      return;
    }
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/entries/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        csrf,
        rows: ready.map((r) => ({
          gondi_pronunciation: r.gondi_pronunciation.trim(),
          hindi: r.hindi.trim(),
          english: r.english.trim(),
          category: r.category || category,
          source_page: r.source_page || page,
        })),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) setErr(data.error ?? "सेव नहीं हुआ");
    else setMsg(`${data.saved} शब्द सेव हुए। साइट पर सर्च करके देखें।`);
  }

  function downloadCsv() {
    const ready = rows.filter((r) => r.gondi_pronunciation.trim());
    const header = "gondi_pronunciation,hindi,english,category,source_page";
    const body = ready
      .map((r) =>
        [r.gondi_pronunciation, r.hindi, r.english, r.category || category, r.source_page || page]
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([`${header}\n${body}\n`], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gondi-scan-${page || "page"}.csv`;
    a.click();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl">किताब स्कैन</h1>
      <p className="mt-2 font-deva text-ink-700">
        गोंडी करीयाट का पन्ना फोटो करो। OCR सुझाव देगा — <strong>गोंडी शब्द किताब जैसा ही रखो</strong>,
        अनुमान से नया शब्द मत बनाओ।
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          श्रेणी
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          >
            {CATEGORY_META.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name_hi} · {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          पन्ना नंबर (किताब)
          <input
            value={page}
            onChange={(e) => setPage(e.target.value)}
            placeholder="जैसे 4"
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-terracotta-500/40 bg-white px-4 py-8 text-center">
        <Camera />
        <span className="font-deva font-medium">पन्ने की फोटो लें / गैलरी से चुनें</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>

      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="Book page" className="mt-3 max-h-80 w-full rounded-xl object-contain bg-cream-200" />
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || !photo}
          onClick={runOcr}
          className="inline-flex items-center gap-1 rounded-xl bg-forest-500 px-4 py-2 text-cream-50 disabled:opacity-50"
        >
          <Sparkles size={16} /> OCR चलाएँ
        </button>
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, emptyRow(category)])}
          className="inline-flex items-center gap-1 rounded-xl border px-4 py-2"
        >
          <Plus size={16} /> खाली पंक्ति
        </button>
      </div>
      {progress && <p className="mt-2 text-sm text-forest-600">{progress}</p>}
      {ocr && (
        <details className="mt-3 rounded-xl bg-cream-200 p-3 text-xs">
          <summary>OCR कच्चा टेक्स्ट</summary>
          <pre className="mt-2 whitespace-pre-wrap font-deva">{ocr}</pre>
        </details>
      )}

      <div className="mt-6 space-y-3">
        {rows.map((r, i) => (
          <div key={r.key} className="gond-frame rounded-2xl bg-white p-3">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={r.keep} onChange={(e) => update(i, { keep: e.target.checked })} />
              सेव करो
            </label>
            <label className="mt-2 block text-xs">
              Gondi Pronunciation (किताब जैसा)
              <input
                value={r.gondi_pronunciation}
                onChange={(e) => update(i, { gondi_pronunciation: e.target.value })}
                className="mt-1 w-full rounded-lg border px-2 py-2 font-deva text-lg"
              />
            </label>
            {r.gondi_pronunciation && (
              <p className="font-gondi mt-1 text-2xl text-forest-600">
                {devanagariToMasaram(r.gondi_pronunciation)}
              </p>
            )}
            <label className="mt-2 block text-xs">
              Hindi
              <input
                value={r.hindi}
                onChange={(e) => update(i, { hindi: e.target.value })}
                className="mt-1 w-full rounded-lg border px-2 py-2 font-deva"
              />
            </label>
            <label className="mt-2 block text-xs">
              English
              <input
                value={r.english}
                onChange={(e) => update(i, { english: e.target.value })}
                className="mt-1 w-full rounded-lg border px-2 py-2"
              />
            </label>
            <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="mt-2 text-terracotta-600">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {err && <p className="mt-4 text-sm text-terracotta-600">{err}</p>}
      {msg && <p className="mt-4 text-sm text-forest-600">{msg}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={save}
          className="inline-flex items-center gap-1 rounded-xl bg-terracotta-500 px-5 py-2.5 text-cream-50"
        >
          <Save size={16} /> जाँचे हुए शब्द सेव करें
        </button>
        <button type="button" onClick={downloadCsv} className="rounded-xl border px-4 py-2">
          CSV डाउनलोड
        </button>
      </div>
    </div>
  );
}
