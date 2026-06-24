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
      {(offer.status === "accepted" || offer.status === "declined" || offer.customer_comment) && (
        <Card
          className={`mb-4 max-w-3xl ${
            offer.status === "accepted"
              ? "border-[#09ed2d]/30 bg-[#09ed2d]/[0.06]"
              : offer.status === "declined"
                ? "border-red-400/30 bg-red-400/[0.06]"
                : ""
          }`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Kundenreaktion
          </h2>
          <p className="mt-2 text-sm text-white/85">
            {offer.status === "accepted" && "✓ Kunde hat das Angebot angenommen."}
            {offer.status === "declined" && "✗ Kunde hat das Angebot abgelehnt."}
            {offer.status !== "accepted" &&
              offer.status !== "declined" &&
              "Noch keine Entscheidung."}
            {offer.responded_at && (
              <span className="text-white/45">
                {" "}
                ({new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(
                  new Date(offer.responded_at),
                )}
                )
              </span>
            )}
          </p>
          {offer.customer_comment && (
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
              &bdquo;{offer.customer_comment}&ldquo;
            </div>
          )}
        </Card>
      )}

      <Card className="max-w-3xl">
        <OfferForm offer={offer} customers={customers} />
      </Card>
    </>
  );
}
