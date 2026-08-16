import { z } from "zod";
import { ERROR_TYPES } from "@/lib/types";

const SCRIPT_INJECTION = /<\s*script|javascript:|data:text\/html|onerror\s*=|onload\s*=/i;
const PATH_TRAVERSAL = /(\.\.|[\\/]\.\.|%2e%2e)/i;

export function rejectDangerous(value: string, label: string) {
  if (SCRIPT_INJECTION.test(value)) {
    throw new Error(`${label} contains forbidden content`);
  }
  if (PATH_TRAVERSAL.test(value)) {
    throw new Error(`${label} contains a path traversal sequence`);
  }
}

export const entrySchema = z.object({
  gondi_pronunciation: z
    .string()
    .trim()
    .min(1, "Gondi pronunciation is required")
    .max(200)
    .refine((v) => !SCRIPT_INJECTION.test(v), "Invalid characters"),
  hindi: z.string().trim().min(1).max(200),
  english: z.string().trim().min(1).max(200),
  category: z
    .string()
    .trim()
    .regex(/^[a-z0-9_-]{0,40}$/i, "Invalid category")
    .optional()
    .or(z.literal("")),
  category_hi: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(500).optional(),
  gondi_script: z.string().trim().max(400).optional(),
  roman_gondi: z.string().trim().max(200).optional(),
  roman_hindi: z.string().trim().max(200).optional(),
  status: z.enum(["published", "pending", "rejected", "draft", "archived"]).optional(),
  verified: z.boolean().optional(),
  source: z.string().trim().max(200).optional(),
  source_page: z.string().trim().max(40).optional(),
});

export const sentenceSchema = z.object({
  gondi_pronunciation: z.string().trim().min(1).max(400),
  hindi: z.string().trim().min(1).max(400),
  english: z.string().trim().min(1).max(400),
  source_page: z.string().trim().max(20).optional(),
  csrf: z.string().optional(),
});

const text = (max: number) => z.string().trim().max(max);
const safeUrl = text(500).refine(
  (v) => v === "" || /^https:\/\/[\w.-]+(:\d+)?(\/\S*)?$/i.test(v),
  "URL must start with https://"
);

/** Public word-contribution payload (Phase 4).
 * Minimum requirement: at least one Gondi identifier
 * (Gondi Devanagari OR Roman Gondi OR Masaram Gondi).
 * Everything else is optional. Status/verified fields are deliberately
 * ABSENT — the server forces every submission to "pending". */
export const contributionSchema = z
  .object({
    // Gondi information
    gondi_pronunciation: text(200).optional(),
    roman_gondi: text(200).optional(),
    masaram_gondi: text(200).optional(),
    pronunciation: text(200).optional(),
    gondi_example: text(400).optional(),
    dialect: text(120).optional(),
    // Hindi information
    hindi: text(200).optional(),
    roman_hindi: text(200).optional(),
    hindi_definition: text(500).optional(),
    hindi_example: text(400).optional(),
    hindi_synonyms: text(300).optional(),
    hindi_antonyms: text(300).optional(),
    // English information
    english: text(200).optional(),
    english_definition: text(500).optional(),
    english_example: text(400).optional(),
    english_synonyms: text(300).optional(),
    english_antonyms: text(300).optional(),
    // Source / reference
    source_type: z
      .enum(["", "book", "pdf", "author", "website", "academic", "community", "other"])
      .optional(),
    source_name: text(200).optional(),
    source_author: text(120).optional(),
    source_page: text(40).optional(),
    source_url: safeUrl.optional(),
    notes: text(500).optional(),
    // Contributor (optional, email stays private)
    contributor_name: text(80).optional(),
    contributor_email: z.string().trim().email().max(120).optional().or(z.literal("")),
    // Anti-spam honeypot — must stay empty.
    website: text(200).optional(),
    // Mapping suggestions the contributor accepted (always review-required).
    suggestions_used: z.array(z.string().max(40)).max(6).optional(),
    // Legacy field kept so the existing /report flow keeps working.
    category: text(40).optional(),
    csrf: z.string().min(8).optional(),
  })
  .superRefine((data, ctx) => {
    const hasIdentifier =
      (data.gondi_pronunciation ?? "") !== "" ||
      (data.roman_gondi ?? "") !== "" ||
      (data.masaram_gondi ?? "") !== "";
    if (!hasIdentifier) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "कम से कम एक गोंडी पहचान चाहिए — Gondi Devanagari / Roman Gondi / Masaram Gondi में से कोई एक।",
        path: ["gondi_pronunciation"],
      });
    }
  });

export type ContributionPayload = z.infer<typeof contributionSchema>;

/* ------------------- Phase 5: dictionary error reports ------------------- */

/** Public dictionary-error report payload.
 * Required: at least one error type + a description. Everything else is
 * optional. Status fields are deliberately ABSENT — the server forces
 * every report to "pending" and no report ever modifies the dictionary. */
export const reportSchema = z.object({
  dictionary_entry_id: z
    .string()
    .trim()
    .regex(/^[a-z0-9]{2,24}$/i, "Invalid word id")
    .optional()
    .or(z.literal("")),
  error_types: z.array(z.enum(ERROR_TYPES)).min(1).max(8),
  description: z.string().trim().min(1, "विवरण आवश्यक है").max(1000),
  suggested_correction: text(1000).optional(),
  correct_gondi_devanagari: text(200).optional(),
  correct_roman_gondi: text(200).optional(),
  correct_masaram_gondi: text(200).optional(),
  correct_hindi: text(200).optional(),
  correct_english: text(200).optional(),
  correct_pronunciation: text(200).optional(),
  correct_hindi_definition: text(500).optional(),
  correct_english_definition: text(500).optional(),
  correct_hindi_example: text(400).optional(),
  correct_english_example: text(400).optional(),
  correct_gondi_example: text(400).optional(),
  source_type: z
    .enum(["", "book", "pdf", "website", "academic", "author", "community", "other"])
    .optional(),
  source_name: text(200).optional(),
  source_author: text(120).optional(),
  source_page: text(40).optional(),
  source_url: safeUrl.optional(),
  evidence: text(800).optional(),
  reporter_name: text(80).optional(),
  reporter_email: z.string().trim().email().max(120).optional().or(z.literal("")),
  website: text(200).optional(), // honeypot
  csrf: z.string().min(8).optional(),
});

export type ReportPayload = z.infer<typeof reportSchema>;

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
  category: z.string().trim().max(40).optional(),
  limit: z.coerce.number().int().min(1).max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(128),
  csrf: z.string().min(8).optional(),
});

export const AUDIO_MIME = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
]);

export function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "audio";
  if (PATH_TRAVERSAL.test(base)) throw new Error("Illegal filename");
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

export function assertPayloadSize(raw: string, max = 32_000) {
  if (new TextEncoder().encode(raw).length > max) {
    throw new Error("Payload too large");
  }
}
