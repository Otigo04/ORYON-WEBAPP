import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <>
      <PageHeader title="Neue Bewertung" />
      <Link href="/admin/bewertungen" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück
      </Link>
      <Card className="max-w-3xl">
        <TestimonialForm />
      </Card>
    </>
  );
}
