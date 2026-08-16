import { NextRequest, NextResponse } from "next/server";
import { reportSchema, assertPayloadSize, rejectDangerous } from "@/lib/validation";
import { assertCsrf } from "@/lib/csrf";
import { clientIp, rateLimit, randomToken } from "@/lib/security";
import { addReport, getEntry } from "@/lib/data/store";
import type { DictionaryReport } from "@/lib/types";

/** Free-text fields scanned for injection patterns. */
const SCAN_FIELDS = [
  "description",
  "suggested_correction",
  "correct_gondi_devanagari",
  "correct_roman_gondi",
  "correct_masaram_gondi",
  "correct_hindi",
  "correct_english",
  "correct_pronunciation",
  "correct_hindi_definition",
  "correct_english_definition",
  "correct_hindi_example",
  "correct_english_example",
  "correct_gondi_example",
  "source_name",
  "source_author",
  "source_page",
  "source_url",
  "evidence",
  "reporter_name",
] as const;

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`report:${ip}`, 10, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many reports" }, { status: 429 });

  const raw = await req.text();
  try {
    assertPayloadSize(raw, 16_384);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid form" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot: pretend success, store nothing.
  if ((data.website ?? "") !== "") {
    return NextResponse.json({ ok: true });
  }

  try {
    assertCsrf(data.csrf);
    for (const key of SCAN_FIELDS) {
      const value = data[key];
      if (value) rejectDangerous(value, key);
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }

  // Verify the reported word against the database — never trust a
  // client-supplied id or client-supplied "current" values. The snapshot
  // below is taken from the stored entry only.
  let snapshot = {
    id: null as string | null,
    gondi: null as string | null,
    roman_gondi: null as string | null,
    masaram: null as string | null,
    hindi: null as string | null,
    english: null as string | null,
  };
  if (data.dictionary_entry_id) {
    const entry = await getEntry(data.dictionary_entry_id);
    if (!entry) {
      return NextResponse.json({ error: "Word not found in the dictionary" }, { status: 400 });
    }
    snapshot = {
      id: entry.id,
      gondi: entry.gondi_pronunciation,
      roman_gondi: entry.roman_gondi,
      masaram: entry.gondi_script,
      hindi: entry.hindi,
      english: entry.english,
    };
  }

  const now = new Date().toISOString();
  const report: DictionaryReport = {
    id: `rep_${Date.now().toString(36)}_${randomToken(6)}`,
    dictionary_entry_id: snapshot.id,
    reported_gondi_devanagari: snapshot.gondi,
    reported_roman_gondi: snapshot.roman_gondi,
    reported_masaram_gondi: snapshot.masaram,
    reported_hindi: snapshot.hindi,
    reported_english: snapshot.english,
    error_types: data.error_types,
    description: data.description,
    suggested_correction: data.suggested_correction || null,
    correct_gondi_devanagari: data.correct_gondi_devanagari || null,
    correct_roman_gondi: data.correct_roman_gondi || null,
    correct_masaram_gondi: data.correct_masaram_gondi || null,
    correct_hindi: data.correct_hindi || null,
    correct_english: data.correct_english || null,
    correct_pronunciation: data.correct_pronunciation || null,
    correct_hindi_definition: data.correct_hindi_definition || null,
    correct_english_definition: data.correct_english_definition || null,
    correct_hindi_example: data.correct_hindi_example || null,
    correct_english_example: data.correct_english_example || null,
    correct_gondi_example: data.correct_gondi_example || null,
    source_type: data.source_type || null,
    source_name: data.source_name || null,
    source_author: data.source_author || null,
    source_page: data.source_page || null,
    source_url: data.source_url || null,
    evidence: data.evidence || null,
    reporter_name: data.reporter_name || null,
    reporter_email: data.reporter_email || null,
    status: "pending", // always forced — client cannot influence this
    created_at: now,
    updated_at: now,
  };

  try {
    await addReport(report);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Your report could not be submitted." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
