import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/documents/DocumentView";
import { PrintButton } from "@/components/documents/PrintButton";
import { OfferResponse } from "@/components/dashboard/OfferResponse";
import { PaymentBox } from "@/components/dashboard/PaymentBox";
import { getOffer } from "@/lib/offers";
import { getMyProfile } from "@/lib/profile";
import { OFFER_STATUS_LABELS, computeTotals } from "@/lib/documents";
import { DEPOSIT_RATE, paymentReference } from "@/lib/payment";

export const metadata: Metadata = {
  title: "Angebot – TAS Webworks",
  robots: { index: false, follow: false },
};

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" });

export default async function CustomerOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [offer, profile] = await Promise.all([getOffer(id), getMyProfile()]);
  if (!offer) notFound();

  const meta = [
    { label: "Status", value: OFFER_STATUS_LABELS[offer.status] },
    { label: "Datum", value: df.format(new Date(offer.created_at)) },
    ...(offer.valid_until ? [{ label: "Gültig bis", value: df.format(new Date(offer.valid_until)) }] : []),
  ];

  const gross = computeTotals(offer.items, offer.tax_rate).gross;
  const deposit = Math.round(gross * DEPOSIT_RATE * 100) / 100;

  return (
    <main className="min-h-screen bg-neutral-950 py-8 text-white print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-sm text-white/50 transition hover:text-white">
          ← Zurück
        </Link>
        <PrintButton />
      </div>

      <div className="px-6 print:px-0">
        <DocumentView
          kind="Angebot"
          number={offer.number}
          title={offer.title}
          meta={meta}
          items={offer.items}
          taxRate={offer.tax_rate}
          currency={offer.currency}
          intro={offer.content}
          customer={
            profile
              ? { full_name: profile.full_name, email: profile.email, company: profile.company }
              : null
          }
        />
      </div>

      {/* Kunden-Aktionen – nie im Druck */}
      <div className="no-print mx-auto mt-6 flex max-w-3xl flex-col gap-4 px-6">
        {offer.status === "sent" && <OfferResponse offerId={offer.id} />}

        {offer.status === "accepted" && (
          <>
            <div className="rounded-2xl border border-[#09ed2d]/30 bg-[#09ed2d]/10 px-5 py-4 text-sm text-[#09ed2d]">
              ✓ Angebot angenommen
              {offer.responded_at && (
                <span className="text-[#09ed2d]/70">
                  {" "}
                  am {df.format(new Date(offer.responded_at))}
                </span>
              )}
              . Vielen Dank! Mit der Anzahlung starten wir dein Projekt.
            </div>
            <PaymentBox
              amount={deposit}
              currency={offer.currency}
              reference={paymentReference(offer.number)}
              heading="Anzahlung (50 %) zum Projektstart"
              subline={`Restbetrag bei Fertigstellung · Gesamt ${new Intl.NumberFormat("de-DE", { style: "currency", currency: offer.currency }).format(gross)}`}
            />
          </>
        )}

        {offer.status === "declined" && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/60">
            Du hast dieses Angebot abgelehnt
            {offer.responded_at && <> am {df.format(new Date(offer.responded_at))}</>}. Melde dich
            gern, wenn wir etwas anpassen sollen – wir erstellen dir dann ein neues Angebot.
          </div>
        )}

        {offer.customer_comment && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-white/40">Dein Kommentar</p>
            <p className="mt-1 text-sm text-white/75">{offer.customer_comment}</p>
          </div>
        )}
      </div>
    </main>
  );
}
