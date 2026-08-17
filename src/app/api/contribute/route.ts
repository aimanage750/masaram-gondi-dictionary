import { NextRequest, NextResponse } from "next/server";
import {
  contributionSchema,
  assertPayloadSize,
  rejectDangerous,
} from "@/lib/validation";
import { assertCsrf } from "@/lib/csrf";
import { clientIp, rateLimit } from "@/lib/security";
import { addContribution } from "@/lib/data/store";
import { enrichRaw, makeId } from "@/lib/mapping/enrich";
import type { Contribution, ContributionDetails } from "@/lib/types";

/** Free-text fields that get scanned for injection patterns. */
const SCAN_FIELDS = [
  "gondi_pronunciation",
  "roman_gondi",
  "masaram_gondi",
  "pronunciation",
  "gondi_example",
  "dialect",
  "hindi",
  "roman_hindi",
  "hindi_definition",
  "hindi_example",
  "hindi_synonyms",
  "hindi_antonyms",
  "english",
  "english_definition",
  "english_example",
  "english_synonyms",
  "english_antonyms",
  "source_name",
  "source_author",
  "source_page",
  "source_url",
  "notes",
  "contributor_name",
] as const;

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`contrib:${ip}`, 10, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many contributions" }, { status: 429 });

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
  const parsed = contributionSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? "Invalid form" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if ((data.website ?? "") !== "") {
    return NextResponse.json({ ok: true });
  }

  try {
    await assertCsrf(data.csrf);
    for (const key of SCAN_FIELDS) {
      const value = data[key];
      if (value) rejectDangerous(value, key);
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }

  const gondi = data.gondi_pronunciation ?? "";
  const hindi = data.hindi ?? "";
  const english = data.english ?? "";

  const details: ContributionDetails = {
    gondi_devanagari: gondi || undefined,
    roman_gondi: data.roman_gondi || undefined,
    masaram_gondi: data.masaram_gondi || undefined,
    pronunciation: data.pronunciation || undefined,
    gondi_example: data.gondi_example || undefined,
    dialect: data.dialect || undefined,
    hindi: hindi || undefined,
    roman_hindi: data.roman_hindi || undefined,
    hindi_definition: data.hindi_definition || undefined,
    hindi_example: data.hindi_example || undefined,
    hindi_synonyms: data.hindi_synonyms || undefined,
    hindi_antonyms: data.hindi_antonyms || undefined,
    english: english || undefined,
    english_definition: data.english_definition || undefined,
    english_example: data.english_example || undefined,
    english_synonyms: data.english_synonyms || undefined,
    english_antonyms: data.english_antonyms || undefined,
    source_type: data.source_type || undefined,
    source_name: data.source_name || undefined,
    source_author: data.source_author || undefined,
    source_page: data.source_page || undefined,
    source_url: data.source_url || undefined,
    additional_notes: data.notes || undefined,
    suggestions_used: data.suggestions_used?.length ? data.suggestions_used : undefined,
  };

  // Entry-shaped core (existing admin review flow). Server forces pending:
  // any client-supplied status/verified never reaches this point.
  // Contributor-supplied Masaram Unicode is preserved exactly as submitted.
  const contribution: Contribution = {
    ...enrichRaw(
      {
        gondi_pronunciation: gondi,
        hindi,
        english,
        category: data.category || "general",
        category_hi: "",
        source_page: data.source_page || "contribution",
        notes: data.notes,
      },
      {
        id: makeId(gondi || data.roman_gondi || data.masaram_gondi || "contribution", `${hindi}:${Date.now()}`),
        gondi_script: data.masaram_gondi || undefined,
        roman_gondi: data.roman_gondi || undefined,
        roman_hindi: data.roman_hindi || undefined,
        verified: false,
        status: "pending",
        source: data.source_name ? `user-contribution: ${data.source_name}`.slice(0, 200) : "user-contribution",
      }
    ),
    contributor_name: data.contributor_name || undefined,
    contributor_email: data.contributor_email || undefined,
    review_status: "pending",
    details,
  };

  try {
    await addContribution(contribution);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Your contribution was not submitted." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
