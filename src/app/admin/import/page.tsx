"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ImportPage() {
  const [csrf, setCsrf] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setErr(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("csrf", csrf);
    const res = await fetch("/api/import", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) setErr(data.error ?? "Import failed");
    else setResult(`Imported ${data.imported}, skipped ${data.skipped}. ${data.message ?? ""}`);
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl">CSV bulk import</h1>
      <p className="mt-2 text-sm text-ink-700/70">
        Columns: <code>gondi_pronunciation,hindi,english,category,source_page</code>. Max 400 KB.
        Gondi pronunciation is stored exactly as given.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {err && <p className="text-sm text-terracotta-600">{err}</p>}
        {result && <p className="text-sm text-forest-600">{result}</p>}
        <button className="rounded-xl bg-terracotta-500 px-4 py-2 text-cream-50">Import</button>
      </form>
    </div>
  );
}
