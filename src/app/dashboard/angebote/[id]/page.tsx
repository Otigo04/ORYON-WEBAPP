import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/documents/DocumentView";
import { PrintButton } from "@/components/documents/PrintButton";
import { getOffer } from "@/lib/offers";
import { getMyProfile } from "@/lib/profile";
import { OFFER_STATUS_LABELS } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Angebot, TAS Webworks",
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
          logoSrc="/logo/tas_webworks_logo_v2_black.svg"
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

      {/* Kunden-Hinweis (nie im Druck). Angebote besprechen wir per E-Mail. */}
      <div className="no-print mx-auto mt-6 flex max-w-3xl flex-col gap-4 px-6">
        <div className="rounded-2xl border border-[#09ed2d]/25 bg-[#09ed2d]/[0.06] px-5 py-4 text-sm text-white/75">
          Dieses Angebot hast du auch per E-Mail erhalten. Antworte einfach direkt auf die
          Mail, wenn du zusagen möchtest oder etwas angepasst werden soll. Wir melden uns
          persönlich per E-Mail bei dir zurück.
        </div>
      </div>
    </main>
  );
}
