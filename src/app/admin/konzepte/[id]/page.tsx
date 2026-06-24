import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { ConceptForm } from "@/components/admin/ConceptForm";
import { getConcept } from "@/lib/concepts";
import { getCustomers } from "@/lib/admin/customers";

export default async function EditConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [concept, customers] = await Promise.all([getConcept(id), getCustomers()]);
  if (!concept) notFound();

  return (
    <>
      <PageHeader title={concept.title} subtitle="Konzept bearbeiten." />
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/konzepte" className="text-sm text-white/50 hover:text-white">
          ← Zurück
        </Link>
        <Link href={`/dashboard/konzepte/${concept.id}`} className="text-sm text-[#09ed2d] hover:underline">
          Kundenansicht →
        </Link>
      </div>
      <Card className="max-w-3xl">
        <ConceptForm concept={concept} customers={customers} />
      </Card>
    </>
  );
}
