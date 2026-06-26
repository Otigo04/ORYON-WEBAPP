import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { ShowcaseProjectForm } from "@/components/admin/ShowcaseProjectForm";

export default function NewShowcaseProjectPage() {
  return (
    <>
      <PageHeader title="Neue Referenz" />
      <Link href="/admin/referenzen" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück
      </Link>
      <Card className="max-w-3xl">
        <ShowcaseProjectForm />
      </Card>
    </>
  );
}
