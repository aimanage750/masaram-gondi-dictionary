import { cookies } from "next/headers";
import { safeEqual } from "@/lib/security";

export async function assertCsrf(provided?: string | null) {
  const cookie = (await cookies()).get("mgd_csrf")?.value;
  if (!cookie || !provided || !safeEqual(cookie, provided)) {
    throw new Error("सुरक्षा जाँच फेल। पेज रीफ्रेश करके फिर सेव करो।");
  }
}
