import type { Metadata } from "next";
import { AdminLoginClient } from "@/components/admin/AdminLoginClient";
import { devLoginEnabled, googleOAuthConfigured } from "@/lib/admin-auth/env";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <AdminLoginClient devMode={devLoginEnabled()} googleConfigured={googleOAuthConfigured()} />
  );
}
