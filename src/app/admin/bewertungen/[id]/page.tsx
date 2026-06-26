import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getTestimonial } from "@/lib/testimonials";
import { deleteTestimonial } from "@/lib/actions/admin/showcase";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) notFound();

  return (
    <>
      <PageHeader title={testimonial.author} subtitle="Bewertung bearbeiten." />
      <Link href="/admin/bewertungen" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück
      </Link>
      <Card className="max-w-3xl">
        <TestimonialForm testimonial={testimonial} />
      </Card>

      <form action={deleteTestimonial} className="mt-4 max-w-3xl">
        <input type="hidden" name="id" value={testimonial.id} />
        <button
          type="submit"
          className="text-sm text-red-300/80 transition hover:text-red-300"
        >
          Bewertung löschen
        </button>
      </form>
    </>
  );
}
