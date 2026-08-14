import { z } from "zod";

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
  status: z.enum(["published", "pending", "rejected", "draft"]).optional(),
  verified: z.boolean().optional(),
});

export const contributionSchema = z.object({
  gondi_pronunciation: z.string().trim().min(1).max(200),
  hindi: z.string().trim().min(1).max(200),
  english: z.string().trim().min(1).max(200),
  category: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(500).optional(),
  contributor_name: z.string().trim().max(80).optional(),
  contributor_email: z.string().trim().email().max(120).optional().or(z.literal("")),
  csrf: z.string().min(8).optional(),
});

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
