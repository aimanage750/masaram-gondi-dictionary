"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Plus, Trash2 } from "lucide-react";
import type { GondiSentence } from "@/lib/types";
import { devanagariToMasaram } from "@/lib/mapping/masaram";

export function VakyaAdmin({ initial }: { initial: GondiSentence[] }) {
  const router = useRouter();
  const [csrf, setCsrf] = useState("");
  const [gondi, setGondi] = useState("");
  const [hindi, setHindi] = useState("");
  const [english, setEnglish] = useState("");
  const [page, setPage] = useState("");
  const [preview, setPreview] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  async function onPdf(file: File | undefined) {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      const max = Math.min(doc.numPages, 8);
      const urls: string[] = [];
      for (let i = 1; i <= max; i++) {
        const pg = await doc.getPage(i);
        const vp = pg.getViewport({ scale: 1.15 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        await pg.render({ canvasContext: ctx, viewport: vp }).promise;
        urls.push(canvas.toDataURL("image/jpeg", 0.72));
      }
      setPreview(urls);
      setMsg(`${doc.numPages} पन्ने। पहले ${max} दिख रहे हैं — देखकर नीचे वाक्य लिखो।`);
    } catch (e) {
      setErr((e as Error).message || "PDF नहीं खुला। फोटो भी लगा सकते हो।");
    } finally {
      setBusy(false);
    }
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setPreview([URL.createObjectURL(file)]);
  }

  async function save() {
    setErr(null);
    setMsg(null);
    setBusy(true);
    const res = await fetch("/api/sentences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        csrf,
        gondi_pronunciation: gondi,
        hindi,
        english,
        source_page: page,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) setErr(data.error ?? "सेव नहीं हुआ");
    else {
      setGondi("");
      setHindi("");
      setEnglish("");
      setMsg("वाक्य सेव हो गया। /vakya पर दिखेगा।");
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("यह वाक्य हटाएँ?")) return;
    await fetch(`/api/sentences/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csrf }),
    });
    router.refresh();
  }

  return (
    <div className="mt-6 max-w-2xl">
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-forest-500 px-4 py-2 text-cream-50">
          <FileUp size={16} /> PDF अपलोड
          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onPdf(e.target.files?.[0])} />
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2">
          पन्ने की फोटो
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
        </label>
      </div>
      {busy && <p className="mt-2 text-sm text-forest-600">काम हो रहा है…</p>}

      {preview.length > 0 && (
        <div className="mt-4 max-h-80 space-y-2 overflow-auto rounded-xl bg-cream-200 p-2">
          {preview.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src.slice(0, 24) + i} src={src} alt={`page ${i + 1}`} className="w-full rounded-lg" />
          ))}
        </div>
      )}

      <div className="gond-frame mt-6 space-y-3 rounded-2xl bg-white p-4">
        <label className="block text-sm">
          गोंडी वाक्य (किताब जैसा उच्चारण)
          <textarea
            value={gondi}
            onChange={(e) => setGondi(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border px-3 py-2 font-deva text-lg"
          />
        </label>
        {gondi && <p className="font-gondi text-2xl text-forest-600">{devanagariToMasaram(gondi)}</p>}
        <label className="block text-sm">
          हिन्दी वाक्य
          <textarea value={hindi} onChange={(e) => setHindi(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2 font-deva" />
        </label>
        <label className="block text-sm">
          English sentence
          <textarea value={english} onChange={(e) => setEnglish(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>
        <label className="block text-sm">
          पन्ना
          <input value={page} onChange={(e) => setPage(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>
        {err && <p className="text-sm text-terracotta-600">{err}</p>}
        {msg && <p className="text-sm text-forest-600">{msg}</p>}
        <button type="button" disabled={busy} onClick={save} className="inline-flex items-center gap-1 rounded-xl bg-terracotta-500 px-4 py-2 text-cream-50">
          <Plus size={16} /> वाक्य सेव करें
        </button>
      </div>

      <h2 className="mt-10 font-display text-xl">सेव किए वाक्य ({initial.length})</h2>
      <ul className="mt-3 space-y-2">
        {initial.map((s) => (
          <li key={s.id} className="rounded-xl bg-white p-3">
            <p className="font-deva">{s.gondi_pronunciation}</p>
            <p className="text-sm text-ink-700/70">
              {s.hindi} · {s.english}
            </p>
            <button type="button" onClick={() => remove(s.id)} className="mt-1 text-terracotta-600">
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
