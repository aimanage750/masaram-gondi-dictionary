import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { reviewContribution } from "@/lib/data/store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  try {
    await assertCsrf(body.csrf);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
  if (body.decision !== "approved" && body.decision !== "rejected") {
    return NextResponse.json({ error: "Bad decision" }, { status: 400 });
  }
  await reviewContribution(id, body.decision, user.email);
  return NextResponse.json({ ok: true });
}
