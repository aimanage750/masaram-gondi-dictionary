import { promises as fs } from "fs";
import path from "path";
import type { AuditEvent, DictionaryEntry, GondiSentence } from "@/lib/types";

export interface LocalDB {
  entries: DictionaryEntry[];
  sentences: GondiSentence[];
  contributions: Array<
    DictionaryEntry & {
      contributor_name?: string;
      contributor_email?: string;
      review_status: "pending" | "approved" | "rejected";
    }
  >;
  audit: AuditEvent[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "runtime-db.json");
const TMP_FILE = path.join("/tmp", "gondi-runtime-db.json");

const REPO = process.env.GITHUB_STORE_REPO || "aimanage750/masaram-gondi-dictionary";
const BRANCH = process.env.GITHUB_STORE_BRANCH || "data-store";
const REMOTE_PATH = "runtime-db.json";

type Cache = { db: LocalDB; sha?: string; at: number };
const g = globalThis as unknown as { __gondiDb?: Cache };
const CACHE_MS = 15_000;

function storeToken(): string {
  return (process.env.GITHUB_STORE_TOKEN || "").trim();
}

function onVercel(): boolean {
  return process.env.VERCEL === "1";
}

export function persistHint(): string {
  if (!onVercel()) return "";
  if (storeToken()) return "";
  return "Vercel डिस्क पर सेव टिकता नहीं। Dashboard → Settings → Environment Variables में GITHUB_STORE_TOKEN डालो (GitHub Contents write), फिर Redeploy।";
}

async function readFileSafe(file: string): Promise<LocalDB | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as LocalDB;
    if (!Array.isArray(parsed.entries)) return null;
    return {
      entries: parsed.entries,
      sentences: parsed.sentences ?? [],
      contributions: parsed.contributions ?? [],
      audit: parsed.audit ?? [],
    };
  } catch {
    return null;
  }
}

async function writeFileSafe(file: string, db: LocalDB) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db), "utf8");
  await fs.rename(tmp, file);
}

async function githubGet(): Promise<{ db: LocalDB; sha: string } | null> {
  const token = storeToken();
  if (!token) return null;
  const url = `https://api.github.com/repos/${REPO}/contents/${REMOTE_PATH}?ref=${encodeURIComponent(BRANCH)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "masaram-gondi-dictionary",
    },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub पढ़ा नहीं गया (${res.status})`);
  const body = (await res.json()) as { content?: string; sha?: string; encoding?: string };
  if (!body.content || !body.sha) return null;
  const json = Buffer.from(body.content, "base64").toString("utf8");
  const parsed = JSON.parse(json) as LocalDB;
  return {
    db: {
      entries: parsed.entries ?? [],
      sentences: parsed.sentences ?? [],
      contributions: parsed.contributions ?? [],
      audit: parsed.audit ?? [],
    },
    sha: body.sha,
  };
}

async function githubPut(db: LocalDB, sha?: string, attempt = 0): Promise<boolean> {
  const token = storeToken();
  if (!token) return false;
  const payload: Record<string, string> = {
    message: `admin store ${new Date().toISOString()}`,
    content: Buffer.from(JSON.stringify(db)).toString("base64"),
    branch: BRANCH,
  };
  if (sha) payload.sha = sha;
  const url = `https://api.github.com/repos/${REPO}/contents/${REMOTE_PATH}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "masaram-gondi-dictionary",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if ((res.status === 409 || res.status === 422) && attempt < 1) {
    const latest = await githubGet();
    return githubPut(db, latest?.sha, attempt + 1);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub सेव नहीं हुआ (${res.status}) ${text.slice(0, 180)}`);
  }
  return true;
}

export async function readPersisted(): Promise<LocalDB | null> {
  const now = Date.now();
  if (g.__gondiDb && now - g.__gondiDb.at < CACHE_MS) return g.__gondiDb.db;

  if (storeToken()) {
    const remote = await githubGet();
    if (remote && remote.db.entries.length > 0) {
      g.__gondiDb = { db: remote.db, sha: remote.sha, at: now };
      return remote.db;
    }
  }

  const local = (await readFileSafe(DB_FILE)) || (await readFileSafe(TMP_FILE));
  if (local && local.entries.length > 0) {
    g.__gondiDb = { db: local, at: now };
    return local;
  }
  return null;
}

export async function writePersisted(db: LocalDB) {
  g.__gondiDb = { db, sha: g.__gondiDb?.sha, at: Date.now() };

  if (storeToken()) {
    const ok = await githubPut(db, g.__gondiDb.sha);
    if (ok) {
      const latest = await githubGet();
      if (latest) g.__gondiDb = { db: latest.db, sha: latest.sha, at: Date.now() };
      return;
    }
  }

  try {
    await writeFileSafe(onVercel() ? TMP_FILE : DB_FILE, db);
  } catch (e) {
    if (onVercel()) {
      throw new Error(persistHint() || (e as Error).message);
    }
    throw e;
  }

  if (onVercel() && !storeToken()) {
    throw new Error(persistHint());
  }
}
