import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/documents/DocumentView";
import { PrintButton } from "@/components/documents/PrintButton";
import { getOffer } from "@/lib/offers";
import { getMyProfile } from "@/lib/profile";
import { OFFER_STATUS_LABELS } from "@/lib/documents";

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
    </main>
  );
}
