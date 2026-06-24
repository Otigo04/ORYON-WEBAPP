import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { OfferForm } from "@/components/admin/OfferForm";
import { getOffer } from "@/lib/offers";
import { getCustomers } from "@/lib/admin/customers";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [offer, customers] = await Promise.all([getOffer(id), getCustomers()]);
  if (!offer) notFound();

  return (
    <>
      <PageHeader title={`Angebot ${offer.number}`} subtitle="Angebot bearbeiten." />
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/angebote" className="text-sm text-white/50 hover:text-white">
          ← Zurück
        </Link>
        <Link href={`/dashboard/angebote/${offer.id}`} className="text-sm text-[#09ed2d] hover:underline">
          Kundenansicht / Druck →
        </Link>
      </div>
      <Card className="max-w-3xl">
        <OfferForm offer={offer} customers={customers} />
      </Card>
    </>
  );
}
