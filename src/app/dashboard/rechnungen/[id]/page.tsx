import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/documents/DocumentView";
import { PrintButton } from "@/components/documents/PrintButton";
import { getInvoice } from "@/lib/invoices";
import { getMyProfile } from "@/lib/profile";
import { INVOICE_STATUS_LABELS } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Rechnung, TAS Webworks",
  robots: { index: false, follow: false },
};

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" });

export default async function CustomerInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, profile] = await Promise.all([getInvoice(id), getMyProfile()]);
  if (!invoice) notFound();

  const meta = [
    { label: "Status", value: INVOICE_STATUS_LABELS[invoice.status] },
    { label: "Rechnungsdatum", value: df.format(new Date(invoice.issue_date)) },
    ...(invoice.due_date ? [{ label: "Fällig bis", value: df.format(new Date(invoice.due_date)) }] : []),
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
          kind="Rechnung"
          logoSrc="/logo/tas_webworks_logo_v2_black.svg"
          number={invoice.number}
          title={invoice.title}
          meta={meta}
          items={invoice.items}
          taxRate={invoice.tax_rate}
          currency={invoice.currency}
          customer={
            profile
              ? {
                  full_name: profile.full_name,
                  email: profile.email,
                  company: profile.company,
                  street: profile.street,
                  postal_code: profile.postal_code,
                  city: profile.city,
                  country: profile.country,
                  vat_id: profile.vat_id,
                }
              : null
          }
          notes={invoice.notes}
          payment={invoice.status === "sent" ? { reference: invoice.number } : null}
        />
      </div>

      {invoice.status === "sent" && (
        <div className="no-print mx-auto mt-6 max-w-3xl px-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/70">
            Die Zahlungsdetails findest du auf der Rechnung. Bei Fragen erreichst du uns
            jederzeit per E-Mail.
          </div>
        </div>
      )}
    </main>
  );
}
