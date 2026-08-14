import { cookies } from "next/headers";
import { safeEqual } from "@/lib/security";

export function assertCsrf(provided?: string | null) {
  const cookie = cookies().get("mgd_csrf")?.value;
  if (!cookie || !provided || !safeEqual(cookie, provided)) {
    throw new Error("Invalid CSRF token");
  }
}
