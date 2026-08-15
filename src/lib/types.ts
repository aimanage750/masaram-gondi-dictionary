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

/** Rich public-contribution payload (Phase 4). Every field is optional —
 * only at least one Gondi identifier is required. Contributor email is
 * private and must never be rendered on public pages. */
export interface ContributionDetails {
  gondi_devanagari?: string;
  roman_gondi?: string;
  masaram_gondi?: string;
  pronunciation?: string;
  gondi_example?: string;
  dialect?: string;
  hindi?: string;
  roman_hindi?: string;
  hindi_definition?: string;
  hindi_example?: string;
  hindi_synonyms?: string;
  hindi_antonyms?: string;
  english?: string;
  english_definition?: string;
  english_example?: string;
  english_synonyms?: string;
  english_antonyms?: string;
  source_type?: string;
  source_name?: string;
  source_author?: string;
  source_page?: string;
  source_url?: string;
  additional_notes?: string;
  /** Machine-derived suggestions the contributor accepted, always marked
   * "Suggested — Review Required" (e.g. masaram-from-devanagari). */
  suggestions_used?: string[];
}

/** A stored contribution. Core stays DictionaryEntry-shaped so the existing
 * admin review/approve flow keeps working; the rich payload lives in
 * `details`. Contributions are ALWAYS stored with status "pending" —
 * the server forces this regardless of client input. */
export interface Contribution extends DictionaryEntry {
  contributor_name?: string;
  contributor_email?: string;
  review_status: "pending" | "approved" | "rejected";
  details?: ContributionDetails;
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

/** A full Gondi sentence. Public UI shows only the 4 standard fields. */
export interface GondiSentence {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  roman_hindi: string;
  hindi: string;
  english: string;
  source: string;
  source_page: string | null;
  verified: boolean;
  status: EntryStatus;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface PublicSentence {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  hindi: string;
  english: string;
}
