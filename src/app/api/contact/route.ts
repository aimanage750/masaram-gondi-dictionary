import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCsrf } from "@/lib/csrf";
import { clientIp, rateLimit } from "@/lib/security";
import { assertPayloadSize, rejectDangerous } from "@/lib/validation";

const contactSchema = z.object({
  name: z.string().trim().min(2, "नाम कम से कम 2 अक्षरों का होना चाहिए।").max(80),
  email: z.string().trim().email("कृपया सही ईमेल दर्ज करें।").max(120),
  subject: z.string().trim().min(2, "विषय आवश्यक है।").max(160),
  message: z.string().trim().min(10, "संदेश कम से कम 10 अक्षरों का होना चाहिए।").max(2000),
  website: z.string().trim().max(200).optional(),
  csrf: z.string().min(8),
});

const SCAN_FIELDS = ["name", "email", "subject", "message"] as const;

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`contact:${ip}`, 5, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "बहुत अधिक संदेश भेजे गए हैं। कृपया कुछ देर बाद फिर प्रयास करें।" }, { status: 429 });

  const raw = await req.text();
  try { assertPayloadSize(raw, 12_000); }
  catch { return NextResponse.json({ error: "संदेश बहुत बड़ा है।" }, { status: 413 }); }

  let body: unknown;
  try { body = JSON.parse(raw || "{}"); }
  catch { return NextResponse.json({ error: "Invalid form" }, { status: 400 }); }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid form" }, { status: 400 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });

  try {
    assertCsrf(data.csrf);
    for (const key of SCAN_FIELDS) rejectDangerous(data[key], key);
  } catch {
    return NextResponse.json({ error: "सुरक्षा जाँच विफल। पेज रीफ्रेश करके फिर प्रयास करें।" }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact email service is not configured");
    return NextResponse.json({ error: "संपर्क सेवा अभी उपलब्ध नहीं है। कृपया बाद में फिर प्रयास करें।" }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `[Masaram Gondi Contact] ${data.subject}`,
        text: [`Name: ${data.name}`, `Email: ${data.email}`, `Subject: ${data.subject}`, "", data.message, "", `Submitted: ${new Date().toISOString()}`, "Source: Masaram Gondi Language Platform"].join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("Contact email provider returned an error", response.status);
      return NextResponse.json({ error: "संदेश भेजने में समस्या हुई। कृपया कुछ देर बाद फिर प्रयास करें।" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "संदेश भेजने में समस्या हुई। कृपया कुछ देर बाद फिर प्रयास करें।" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
