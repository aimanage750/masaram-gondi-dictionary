export type EntryStatus = "published" | "pending" | "rejected" | "draft" | "archived";

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

/* ------------------------- Phase 5: error reports ------------------------- */

export type ReportStatus =
  | "pending"
  | "investigating"
  | "corrected"
  | "rejected"
  | "duplicate"
  | "resolved";

/** Allowed error-type codes for dictionary reports. */
export const ERROR_TYPES = [
  "gondi_word",
  "roman_gondi",
  "masaram_gondi",
  "hindi_word",
  "english_word",
  "hindi_meaning",
  "english_meaning",
  "pronunciation",
  "hindi_example",
  "english_example",
  "gondi_example",
  "source",
  "typo",
  "duplicate",
  "other",
] as const;

export type ErrorType = (typeof ERROR_TYPES)[number];

/** A public error report against the dictionary. Reports NEVER modify the
 * dictionary — every field a user supplies is a suggestion ("USER
 * SUGGESTION"), stored for future admin/author review. The `reported_*`
 * fields are a server-side snapshot of the REAL entry at report time.
 * Reporter name/email are private and must never be rendered publicly. */
export interface DictionaryReport {
  id: string;
  dictionary_entry_id: string | null;
  // Snapshot of the entry as stored in the database (audit trail).
  reported_gondi_devanagari: string | null;
  reported_roman_gondi: string | null;
  reported_masaram_gondi: string | null;
  reported_hindi: string | null;
  reported_english: string | null;
  error_types: ErrorType[];
  description: string;
  suggested_correction: string | null;
  // User suggestions — never applied automatically.
  correct_gondi_devanagari: string | null;
  correct_roman_gondi: string | null;
  correct_masaram_gondi: string | null;
  correct_hindi: string | null;
  correct_english: string | null;
  correct_pronunciation: string | null;
  correct_hindi_definition: string | null;
  correct_english_definition: string | null;
  correct_hindi_example: string | null;
  correct_english_example: string | null;
  correct_gondi_example: string | null;
  source_type: string | null;
  source_name: string | null;
  source_author: string | null;
  source_page: string | null;
  source_url: string | null;
  evidence: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
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

/* --------------------- Phase 9: secure admin panel --------------------- */

export type AdminRole = "super_admin" | "editor" | "reviewer";

/** Authenticated + authorized admin (Google OAuth allowlist). Legacy local
 * sessions map to super_admin for backwards compatibility. */
export interface AdminUser {
  email: string;
  name?: string;
  picture?: string;
  role: AdminRole;
  /** true when authenticated via the legacy local password session */
  legacy?: boolean;
}

/** A managed source/reference record (books, PDFs, websites, authors). */
export interface SourceItem {
  id: string;
  type: "book" | "pdf" | "author" | "website" | "academic" | "community" | "other";
  name: string;
  author?: string | null;
  page?: string | null;
  url?: string | null;
  notes?: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
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
