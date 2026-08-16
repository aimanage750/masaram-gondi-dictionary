import { WordForm } from "@/components/admin/WordForm";

export const metadata = { title: "Admin · Add Word" };

export default function AdminAddWordPage() {
  return <WordForm mode="create" />;
}
