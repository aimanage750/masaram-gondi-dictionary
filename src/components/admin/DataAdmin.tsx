"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { CheckCircle2, Database, Download, FileWarning, Loader2, Upload } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { useCsrf } from "./useCsrf";

interface DryRunResult {
  total: number;
  valid: number;
  errors: number;
  warnings: number;
  issues: { row: number; kind: string; message: string }[];
}

/** CSV data management: export any time; import ALWAYS goes through
 * parse → validate → preview → confirm → apply. */
export function DataAdmin({ entryCount }: { entryCount: number }) {
  const csrf = useCsrf();
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<DryRunResult | null>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function dryRun(parsedRows: Record<string, string>[]) {
    const res = await fetch("/api/admin/data/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dryRun: true, rows: parsedRows, csrf }),
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok) setPreview(d);
    else setResult(`Preview failed: ${d?.error ?? "error"}`);
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    setParsing(true);
    setResult(null);
    setPreview(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (res) => {
        setParsing(false);
        const parsedRows = res.data.filter((r) => Object.values(r).some((v) => v?.trim()));
        setRows(parsedRows);
        await dryRun(parsedRows);
      },
      error: () => {
        setParsing(false);
        setResult("Could not parse the CSV file.");
      },
    });
  }

  async function apply() {
    setBusy(true);
    const res = await fetch("/api/admin/data/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dryRun: false, rows, csrf }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    setConfirmOpen(false);
    if (res.ok) {
      setResult(`✓ Import applied — ${d.applied} rows written, ${d.skipped} skipped (duplicates).`);
      setPreview(null);
      setRows([]);
    } else {
      setResult(`Apply failed: ${d?.error ?? "error"}`);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Data / CSV</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          {entryCount} entries in the dictionary. Import never applies directly — always preview first.
        </p>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-english text-base font-bold text-forest-600">
            <Download size={16} aria-hidden /> Export CSV
          </h2>
          <p className="mt-2 text-sm text-ink-700/70">
            Full dictionary backup: all fields, ids, verification and status.
          </p>
          <a
            href="/api/admin/data/export"
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card hover:bg-forest-500"
          >
            <Database size={15} aria-hidden /> Download dictionary.csv
          </a>
        </section>

        <section className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-english text-base font-bold text-forest-600">
            <Upload size={16} aria-hidden /> Import CSV
          </h2>
          <p className="mt-2 text-sm text-ink-700/70">
            Columns: gondi_pronunciation, hindi, english, category, source_page, notes (+ optional id,
            roman_gondi, gondi_script, roman_hindi).
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => onFile(e.target.files?.[0])}
            aria-label="Choose CSV file"
            className="mt-4 block w-full text-sm file:mr-3 file:min-h-[40px] file:rounded-full file:border-0 file:bg-terracotta-500 file:px-5 file:text-sm file:font-semibold file:text-cream-50 hover:file:bg-terracotta-600"
          />
          {parsing && (
            <p className="mt-3 flex items-center gap-2 text-sm text-ink-700/70">
              <Loader2 size={14} aria-hidden className="animate-spin" /> Parsing & validating…
            </p>
          )}
        </section>
      </div>

      {result && (
        <p role="status" className="mt-5 rounded-2xl bg-forest-600/10 p-4 text-sm font-medium text-forest-600">
          {result}
        </p>
      )}

      {preview && (
        <section className="mt-5 rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card">
          <h2 className="font-english text-base font-bold text-forest-600">Preview — no changes applied yet</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-cream-200 px-3 py-1 font-semibold">{preview.total} rows</span>
            <span className="rounded-full bg-forest-600/10 px-3 py-1 font-semibold text-forest-600">
              <CheckCircle2 size={12} aria-hidden className="mr-1 inline" />
              {preview.valid} valid
            </span>
            <span className="rounded-full bg-terracotta-500/10 px-3 py-1 font-semibold text-terracotta-700">
              {preview.errors} errors
            </span>
            <span className="rounded-full bg-ochre-500/15 px-3 py-1 font-semibold text-earth-500">
              <FileWarning size={12} aria-hidden className="mr-1 inline" />
              {preview.warnings} warnings
            </span>
          </div>
          {preview.issues.length > 0 && (
            <ul className="mt-4 max-h-64 space-y-1 overflow-y-auto text-xs">
              {preview.issues.map((iss, i) => (
                <li key={i} className={iss.kind === "error" ? "font-medium text-terracotta-700" : "text-earth-500"}>
                  Row {iss.row}: {iss.message}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            disabled={preview.errors > 0 || preview.valid === 0}
            onClick={() => setConfirmOpen(true)}
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-card hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Import ({preview.valid} rows)
          </button>
          {preview.errors > 0 && (
            <p className="mt-2 text-xs font-medium text-terracotta-700">
              Blocking errors must be fixed in the CSV before applying.
            </p>
          )}
        </section>
      )}

      <ConfirmDialog
        open={confirmOpen}
        busy={busy}
        title="Apply CSV import to the dictionary?"
        confirmLabel="Apply"
        message={
          <>
            <strong>{preview?.valid}</strong> rows will be written to the dictionary (new rows start
            as <strong>pending, unverified</strong>; rows with existing ids update those entries).
            Duplicates without ids are skipped. This action is recorded in the audit log.
          </>
        }
        onConfirm={apply}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
