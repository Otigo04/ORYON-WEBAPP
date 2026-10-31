import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { OfferForm } from "@/components/admin/OfferForm";
import { getCustomers } from "@/lib/admin/customers";
import { getAllBriefs } from "@/lib/briefs";

export default async function NewOfferPage() {
  const [customers, briefs] = await Promise.all([getCustomers(), getAllBriefs()]);
  return (
    <>
      <PageHeader title="Neues Angebot" />
      <Link href="/admin/angebote" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück
      </Link>
      <Card className="max-w-3xl">
        {customers.length === 0 ? (
          <p className="text-sm text-white/50">Es sind noch keine Kunden registriert.</p>
        ) : (
          <OfferForm customers={customers} briefs={briefs} />
        )}
      </Card>
    </>
  );
}
