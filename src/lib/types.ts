export type EntryStatus = "published" | "pending" | "rejected" | "draft";

export type UserRole = "public" | "contributor" | "admin";

/** Internal database row — never send this object to the public UI as-is. */
export interface DictionaryEntry {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  roman_hindi: string;
  hindi: string;
  english: string;
  gondi_normalized: string | null;
  category: string;
  category_hi: string;
  notes: string | null;
  source: string;
  source_page: string | null;
  verified: boolean;
  status: EntryStatus;
  audio_path: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

/** The only 4 fields a public user may see. */
export interface PublicEntry {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  hindi: string;
  english: string;
  category?: string;
  category_hi?: string;
  audio_url?: string | null;
}

export interface RawSourceEntry {
  gondi_pronunciation: string;
  hindi: string;
  english: string;
  category: string;
  category_hi: string;
  source_page: string;
  notes?: string;
}

export interface SearchHit {
  entry: PublicEntry;
  score: number;
  matched_on: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  name_hi: string;
  count: number;
}

export interface ContributionInput {
  gondi_pronunciation: string;
  hindi: string;
  english: string;
  category?: string;
  notes?: string;
  contributor_name?: string;
  contributor_email?: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  detail: string;
  created_at: string;
}

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}
