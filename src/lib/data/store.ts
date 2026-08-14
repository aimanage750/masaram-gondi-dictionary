import { promises as fs } from "fs";
import path from "path";
import type { AuditEvent, DictionaryEntry } from "@/lib/types";
import { RAW_ENTRIES } from "@/data/raw-entries";
import { enrichRaw } from "@/lib/mapping/enrich";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/service";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "runtime-db.json");

export interface LocalDB {
  entries: DictionaryEntry[];
  contributions: Array<
    DictionaryEntry & {
      contributor_name?: string;
      contributor_email?: string;
      review_status: "pending" | "approved" | "rejected";
    }
  >;
  audit: AuditEvent[];
}

function seedEntries(): DictionaryEntry[] {
  return RAW_ENTRIES.map((r) => enrichRaw(r, { verified: true, status: "published" }));
}

async function readLocal(): Promise<LocalDB> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as LocalDB;
    if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) {
      return { entries: seedEntries(), contributions: [], audit: [] };
    }
    return {
      entries: parsed.entries,
      contributions: parsed.contributions ?? [],
      audit: parsed.audit ?? [],
    };
  } catch {
    return { entries: seedEntries(), contributions: [], audit: [] };
  }
}

async function writeLocal(db: LocalDB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
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

export async function addContribution(
  entry: LocalDB["contributions"][number]
) {
  if (isSupabaseConfigured()) {
    const sb = createServiceClient();
    const { error } = await sb.from("contributions").insert({
      gondi_pronunciation: entry.gondi_pronunciation,
      hindi: entry.hindi,
      english: entry.english,
      category: entry.category,
      notes: entry.notes,
      contributor_name: entry.contributor_name,
      contributor_email: entry.contributor_email,
      status: "pending",
      payload_bytes: JSON.stringify(entry).length,
    });
    if (error) throw error;
    return;
  }
  const db = await readLocal();
  db.contributions.unshift(entry);
  await writeLocal(db);
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

export { seedEntries };
