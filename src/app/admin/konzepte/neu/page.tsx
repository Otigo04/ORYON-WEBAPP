import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { ConceptForm } from "@/components/admin/ConceptForm";
import { getCustomers } from "@/lib/admin/customers";

export default async function NewConceptPage() {
  const customers = await getCustomers();
  return (
    <>
      <PageHeader title="Neues Konzept" />
      <Link href="/admin/konzepte" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück
      </Link>
      <Card className="max-w-3xl">
        {customers.length === 0 ? (
          <p className="text-sm text-white/50">Es sind noch keine Kunden registriert.</p>
        ) : (
          <ConceptForm customers={customers} />
        )}
      </Card>
    </>
  );
}
