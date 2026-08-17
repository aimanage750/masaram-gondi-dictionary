import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { can } from "@/lib/admin-auth/roles";
import { assertCsrf } from "@/lib/csrf";
import {
  auditEvent,
  mergeContribution,
  publishContribution,
  reviewContribution,
} from "@/lib/data/store";

const bodySchema = z.object({
  action: z.enum(["publish", "reject", "merge"]),
  target_entry_id: z.string().regex(/^[a-z0-9]{2,24}$/i).optional(),
  fields: z.array(z.enum(["hindi", "english", "roman_gondi", "roman_hindi", "masaram_gondi", "source", "notes"])).max(10).optional(),
  verified: z.boolean().optional(),
  csrf: z.string().min(8),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAdminUser();
  if (!user || !can(user.role, "review")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  try {
    await assertCsrf(parsed.data.csrf);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const { action } = parsed.data;

  // Publishing creates/updates live dictionary data — highest privilege only.
  if ((action === "publish" || action === "merge") && !can(user.role, "publish")) {
    return NextResponse.json({ error: "Publishing requires super admin" }, { status: 403 });
  }

  try {
    if (action === "reject") {
      await reviewContribution(id, "rejected", user.email);
      return NextResponse.json({ ok: true });
    }
    if (action === "publish") {
      const entryId = await publishContribution(id, user.email, {
        verified: parsed.data.verified ?? false,
      });
      return NextResponse.json({ ok: true, entry_id: entryId });
    }
    // merge
    if (!parsed.data.target_entry_id || !parsed.data.fields?.length) {
      return NextResponse.json({ error: "Merge needs target entry and fields" }, { status: 400 });
    }
    await mergeContribution(id, parsed.data.target_entry_id, parsed.data.fields, user.email);
    await auditEvent(user.email, "CONTRIBUTION_MERGED", "contribution", id, parsed.data.fields.join(","));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
