import { redirect } from "next/navigation";

/** Spec route alias — the dashboard lives at /admin. */
export default function DashboardAlias() {
  redirect("/admin");
}
