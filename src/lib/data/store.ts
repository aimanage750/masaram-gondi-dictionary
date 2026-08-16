import type {
  DictionaryEntry,
  DictionaryReport,
  GondiSentence,
  ReportStatus,
  SourceItem,
} from "@/lib/types";
import { RAW_ENTRIES } from "@/data/raw-entries";
import { enrichRaw } from "@/lib/mapping/enrich";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/service";
import { type LocalDB, readPersisted, writePersisted } from "@/lib/data/persist";

export type { LocalDB };

function seedEntries(): DictionaryEntry[] {
  return RAW_ENTRIES.map((r) => enrichRaw(r, { verified: true, status: "published" }));
}

async function readLocal(): Promise<LocalDB> {
  const persisted = await readPersisted();
  if (persisted && persisted.entries.length > 0) return persisted;
  return {
    entries: seedEntries(),
    sentences: persisted?.sentences ?? [],
    contributions: [],
    reports: [],
    sources: [],
    audit: [],
  };
}

async function writeLocal(db: LocalDB) {
  await writePersisted(db);
}

export async function listEntries(opts?: {
  includeUnpublished?: boolean;
  category?: string;
}): Promise<DictionaryEntry[]> {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    let q = sb.from("entries").select("*");
    if (!opts?.includeUnpublished) q = q.eq("status", "published");
    if (opts?.category) q = q.eq("category", opts.category);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as DictionaryEntry[];
  }
  const db = await readLocal();
  return db.entries.filter((e) => {
    if (!opts?.includeUnpublished && e.status !== "published") return false;
    if (opts?.category && e.category !== opts.category) return false;
    return true;
  });
}

export async function getEntry(id: string, includeUnpublished = false) {
  const all = await listEntries({ includeUnpublished });
  return all.find((e) => e.id === id) ?? null;
}

export async function upsertEntry(entry: DictionaryEntry, actor: string) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb.from("entries").upsert(entry);
    if (error) throw error;
    await writeAudit(actor, "upsert", "entry", entry.id, entry.gondi_pronunciation);
    return entry;
  }
  const db = await readLocal();
  const i = db.entries.findIndex((e) => e.id === entry.id);
  if (i >= 0) db.entries[i] = { ...entry, updated_at: new Date().toISOString() };
  else db.entries.push(entry);
  db.audit.unshift({
    id: `aud_${Date.now()}`,
    actor,
    action: i >= 0 ? "update" : "create",
    entity_type: "entry",
    entity_id: entry.id,
    detail: entry.gondi_pronunciation,
    created_at: new Date().toISOString(),
  });
  await writeLocal(db);
  return entry;
}

export async function deleteEntry(id: string, actor: string) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb.from("entries").delete().eq("id", id);
    if (error) throw error;
    await writeAudit(actor, "delete", "entry", id, "");
    return;
  }
  const db = await readLocal();
  db.entries = db.entries.filter((e) => e.id !== id);
  db.audit.unshift({
    id: `aud_${Date.now()}`,
    actor,
    action: "delete",
    entity_type: "entry",
    entity_id: id,
    detail: "",
    created_at: new Date().toISOString(),
  });
  await writeLocal(db);
}

export async function addContribution(entry: LocalDB["contributions"][number]) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const payloadBytes = JSON.stringify(entry).length;
    // Rich `details` column exists only after migration 0008; fall back to
    // the core columns so unmigrated databases keep accepting contributions.
    const core = {
      gondi_pronunciation: entry.gondi_pronunciation,
      hindi: entry.hindi,
      english: entry.english,
      category: entry.category,
      notes: entry.notes,
      contributor_name: entry.contributor_name,
      contributor_email: entry.contributor_email,
      status: "pending",
      payload_bytes: payloadBytes,
    };
    const rich = await sb.from("contributions").insert({
      ...core,
      details: entry.details ?? null,
    });
    if (rich.error) {
      const fallback = await sb.from("contributions").insert(core);
      if (fallback.error) throw fallback.error;
    }
    return;
  }
  const db = await readLocal();
  db.contributions.unshift(entry);
  await writeLocal(db);
}

export async function addReport(report: DictionaryReport) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const payloadBytes = JSON.stringify(report).length;
    const core = {
      dictionary_entry_id: report.dictionary_entry_id,
      reported_gondi_devanagari: report.reported_gondi_devanagari,
      reported_roman_gondi: report.reported_roman_gondi,
      reported_masaram_gondi: report.reported_masaram_gondi,
      reported_hindi: report.reported_hindi,
      reported_english: report.reported_english,
      error_types: report.error_types,
      description: report.description,
      suggested_correction: report.suggested_correction,
      source_type: report.source_type,
      source_name: report.source_name,
      source_author: report.source_author,
      source_page: report.source_page,
      source_url: report.source_url,
      evidence: report.evidence,
      reporter_name: report.reporter_name,
      reporter_email: report.reporter_email,
      status: "pending",
      payload_bytes: payloadBytes,
    };
    // Rich `corrections` column exists only after migration 0009; fall back
    // to core columns so unmigrated databases keep accepting reports.
    const rich = await sb.from("dictionary_reports").insert({
      ...core,
      corrections: {
        correct_gondi_devanagari: report.correct_gondi_devanagari,
        correct_roman_gondi: report.correct_roman_gondi,
        correct_masaram_gondi: report.correct_masaram_gondi,
        correct_hindi: report.correct_hindi,
        correct_english: report.correct_english,
        correct_pronunciation: report.correct_pronunciation,
        correct_hindi_definition: report.correct_hindi_definition,
        correct_english_definition: report.correct_english_definition,
        correct_hindi_example: report.correct_hindi_example,
        correct_english_example: report.correct_english_example,
        correct_gondi_example: report.correct_gondi_example,
      },
    });
    if (rich.error) {
      const fallback = await sb.from("dictionary_reports").insert(core);
      if (fallback.error) throw fallback.error;
    }
    return;
  }
  const db = await readLocal();
  db.reports.unshift(report);
  await writeLocal(db);
}

/** Number of not-yet-rejected reports for one entry — powers the
 * "this may already have been reported" notice. Never exposes reporter data. */
export async function countOpenReports(dictionaryEntryId: string): Promise<number> {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { count, error } = await sb
      .from("dictionary_reports")
      .select("*", { count: "exact", head: true })
      .eq("dictionary_entry_id", dictionaryEntryId)
      .in("status", ["pending", "investigating"]);
    if (error) throw error;
    return count ?? 0;
  }
  const db = await readLocal();
  return db.reports.filter(
    (r) =>
      r.dictionary_entry_id === dictionaryEntryId &&
      (r.status === "pending" || r.status === "investigating")
  ).length;
}

export async function listContributions() {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("contributions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
  const db = await readLocal();
  return db.contributions;
}

export async function reviewContribution(
  id: string,
  decision: "approved" | "rejected",
  actor: string
) {
  const db = await readLocal();
  const c = db.contributions.find((x) => x.id === id);
  if (!c) throw new Error("Contribution not found");
  c.review_status = decision;
  c.status = decision === "approved" ? "published" : "rejected";
  if (decision === "approved") {
    c.verified = false;
    db.entries.push({ ...c, status: "published" });
  }
  db.audit.unshift({
    id: `aud_${Date.now()}`,
    actor,
    action: decision,
    entity_type: "contribution",
    entity_id: id,
    detail: c.gondi_pronunciation,
    created_at: new Date().toISOString(),
  });
  await writeLocal(db);
}

export async function listAudit() {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { data } = await sb
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  }
  const db = await readLocal();
  return db.audit;
}

async function writeAudit(
  actor: string,
  action: string,
  entity_type: string,
  entity_id: string,
  detail: string
) {
  const sb = createServiceClient();
  await sb.from("audit_log").insert({
    actor_email: actor,
    action,
    entity_type,
    entity_id,
    detail,
  });
}

export async function listSentences(includeUnpublished = false): Promise<GondiSentence[]> {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    let q = sb.from("sentences").select("*").order("created_at", { ascending: false });
    if (!includeUnpublished) q = q.eq("status", "published");
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as GondiSentence[];
  }
  const db = await readLocal();
  return (db.sentences ?? []).filter((s) => includeUnpublished || s.status === "published");
}

export async function upsertSentence(sentence: GondiSentence, actor: string) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb.from("sentences").upsert(sentence);
    if (error) throw error;
    await writeAudit(actor, sentence.id ? "update" : "create", "sentence", sentence.id, sentence.gondi_pronunciation.slice(0, 80));
    return sentence;
  }
  const db = await readLocal();
  db.sentences = db.sentences ?? [];
  const i = db.sentences.findIndex((s) => s.id === sentence.id);
  if (i >= 0) db.sentences[i] = { ...sentence, updated_at: new Date().toISOString() };
  else db.sentences.push(sentence);
  db.audit.unshift({
    id: `aud_${Date.now()}`,
    actor,
    action: i >= 0 ? "update" : "create",
    entity_type: "sentence",
    entity_id: sentence.id,
    detail: sentence.gondi_pronunciation.slice(0, 80),
    created_at: new Date().toISOString(),
  });
  await writeLocal(db);
  return sentence;
}

export async function deleteSentence(id: string, actor: string) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb.from("sentences").delete().eq("id", id);
    if (error) throw error;
    await writeAudit(actor, "delete", "sentence", id, "");
    return;
  }
  const db = await readLocal();
  db.sentences = (db.sentences ?? []).filter((s) => s.id !== id);
  db.audit.unshift({
    id: `aud_${Date.now()}`,
    actor,
    action: "delete",
    entity_type: "sentence",
    entity_id: id,
    detail: "",
    created_at: new Date().toISOString(),
  });
  await writeLocal(db);
}

/* ===================== Phase 9: admin management ===================== */

async function auditLocal(
  actor: string,
  action: string,
  entity_type: string,
  entity_id: string | null,
  detail: string
) {
  const db = await readLocal();
  db.audit.unshift({
    id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    actor,
    action,
    entity_type,
    entity_id,
    detail,
    created_at: new Date().toISOString(),
  });
  await writeLocal(db);
}

/** Record an admin action on every configured backend. */
export async function auditEvent(
  actor: string,
  action: string,
  entity_type: string,
  entity_id: string | null,
  detail: string
) {
  if (isSupabaseConfigured()) {
    await writeAudit(actor, action, entity_type, entity_id ?? "", detail);
    return;
  }
  await auditLocal(actor, action, entity_type, entity_id, detail);
}

export async function listReports(): Promise<DictionaryReport[]> {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("dictionary_reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as DictionaryReport[]).map((r) => ({
      ...r,
      id: String(r.id),
      error_types: r.error_types ?? [],
    }));
  }
  const db = await readLocal();
  return db.reports;
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  actor: string
) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb
      .from("dictionary_reports")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  } else {
    const db = await readLocal();
    const r = db.reports.find((x) => x.id === id);
    if (!r) throw new Error("Report not found");
    r.status = status;
    r.updated_at = new Date().toISOString();
    await writeLocal(db);
  }
  await auditEvent(actor, `REPORT_${status.toUpperCase()}`, "report", id, "");
}

/* ------------------------------ sources ------------------------------ */

export async function listSources(): Promise<SourceItem[]> {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { data, error } = await sb
      .from("sources")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as SourceItem[]).map((s) => ({ ...s, id: String(s.id) }));
  }
  const db = await readLocal();
  return db.sources;
}

export async function addSource(item: SourceItem, actor: string) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb.from("sources").insert({
      type: item.type,
      name: item.name,
      author: item.author,
      page: item.page,
      url: item.url,
      notes: item.notes,
      verified: item.verified,
    });
    if (error) throw error;
  } else {
    const db = await readLocal();
    db.sources.unshift(item);
    await writeLocal(db);
  }
  await auditEvent(actor, "SOURCE_CREATED", "source", item.id, item.name);
}

export async function updateSource(
  id: string,
  patch: Partial<Omit<SourceItem, "id" | "created_at">>,
  actor: string
) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb
      .from("sources")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  } else {
    const db = await readLocal();
    const s = db.sources.find((x) => x.id === id);
    if (!s) throw new Error("Source not found");
    Object.assign(s, patch, { updated_at: new Date().toISOString() });
    await writeLocal(db);
  }
  await auditEvent(actor, patch.verified === true ? "SOURCE_VERIFIED" : "SOURCE_UPDATED", "source", id, "");
}

/* ---------------- contribution publish / merge ----------------------- */

/** Approve + publish a contribution as a public dictionary entry.
 * Returns the created/updated entry id. Never automatic — admin-confirmed. */
export async function publishContribution(
  contributionId: string,
  actor: string,
  opts?: { verified?: boolean }
): Promise<string> {
  if (isSupabaseConfigured()) {
    throw new Error("Publish workflow requires the local/GitHub data store");
  }
  const db = await readLocal();
  const c = db.contributions.find((x) => x.id === contributionId);
  if (!c) throw new Error("Contribution not found");
  if (!c.gondi_pronunciation || !c.hindi || !c.english) {
    throw new Error("Contribution is missing the core Gondi/Hindi/English fields");
  }
  const existing = db.entries.find(
    (e) => e.gondi_pronunciation === c.gondi_pronunciation && e.hindi === c.hindi
  );
  const now = new Date().toISOString();
  if (existing) {
    // Same word already published — do not create a duplicate.
    existing.updated_at = now;
    c.review_status = "approved";
    c.status = "published";
    c.updated_at = now;
  } else {
    // Explicit field list — contribution-only data (contributor identity,
    // review status, details) never leaks into the public dictionary entry.
    const entry: DictionaryEntry = {
      id: c.id,
      gondi_script: c.gondi_script,
      gondi_pronunciation: c.gondi_pronunciation,
      roman_gondi: c.roman_gondi,
      roman_hindi: c.roman_hindi,
      hindi: c.hindi,
      english: c.english,
      gondi_normalized: c.gondi_normalized,
      category: c.category,
      category_hi: c.category_hi,
      notes: c.notes,
      source: c.source,
      source_page: c.source_page,
      verified: opts?.verified ?? false,
      status: "published",
      audio_path: c.audio_path,
      created_at: c.created_at ?? now,
      updated_at: now,
      created_by: actor,
    };
    db.entries.push(entry);
    c.review_status = "approved";
    c.status = "published";
    c.updated_at = now;
  }
  db.audit.unshift({
    id: `aud_${Date.now()}`,
    actor,
    action: "CONTRIBUTION_PUBLISHED",
    entity_type: "contribution",
    entity_id: contributionId,
    detail: c.gondi_pronunciation,
    created_at: now,
  });
  await writeLocal(db);
  return existing?.id ?? c.id;
}

/** Merge selected contribution fields into an existing entry (no duplicate
 * created). `fields` lists which contribution values overwrite the entry. */
export async function mergeContribution(
  contributionId: string,
  targetEntryId: string,
  fields: string[],
  actor: string
): Promise<void> {
  if (isSupabaseConfigured()) {
    throw new Error("Merge workflow requires the local/GitHub data store");
  }
  const db = await readLocal();
  const c = db.contributions.find((x) => x.id === contributionId);
  const e = db.entries.find((x) => x.id === targetEntryId);
  if (!c || !e) throw new Error("Contribution or entry not found");
  const d = c.details ?? {};
  const map: Record<string, () => void> = {
    hindi: () => (e.hindi = d.hindi ?? c.hindi),
    english: () => (e.english = d.english ?? c.english),
    roman_gondi: () => (e.roman_gondi = d.roman_gondi ?? e.roman_gondi),
    roman_hindi: () => (e.roman_hindi = d.roman_hindi ?? e.roman_hindi),
    masaram_gondi: () => (e.gondi_script = d.masaram_gondi ?? e.gondi_script),
    source: () => (e.source = d.source_name ? `${d.source_name}` : e.source),
    notes: () => (e.notes = d.additional_notes ?? e.notes),
  };
  for (const f of fields) map[f]?.();
  e.updated_at = new Date().toISOString();
  c.review_status = "approved";
  c.status = "rejected"; // consumed by merge, not published separately
  c.updated_at = e.updated_at;
  db.audit.unshift({
    id: `aud_${Date.now()}`,
    actor,
    action: "CONTRIBUTION_MERGED",
    entity_type: "entry",
    entity_id: targetEntryId,
    detail: `${c.gondi_pronunciation} ← ${fields.join(",")}`,
    created_at: e.updated_at,
  });
  await writeLocal(db);
}

export { seedEntries };
