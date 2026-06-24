import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentView } from "@/components/documents/DocumentView";
import { PrintButton } from "@/components/documents/PrintButton";
import { PaymentBox } from "@/components/dashboard/PaymentBox";
import { getInvoice } from "@/lib/invoices";
import { getMyProfile } from "@/lib/profile";
import { INVOICE_STATUS_LABELS, computeTotals } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Rechnung – TAS Webworks",
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
          number={invoice.number}
          title={invoice.title}
          meta={meta}
          items={invoice.items}
          taxRate={invoice.tax_rate}
          currency={invoice.currency}
          customer={
            profile
              ? { full_name: profile.full_name, email: profile.email, company: profile.company }
              : null
          }
          notes={invoice.notes}
        />
      </div>

      {invoice.status === "sent" && (
        <div className="no-print mx-auto mt-6 max-w-3xl px-6">
          <PaymentBox
            amount={computeTotals(invoice.items, invoice.tax_rate).gross}
            currency={invoice.currency}
            reference={`Rechnung ${invoice.number}`}
            heading="Offener Betrag"
            subline={invoice.due_date ? `Fällig bis ${df.format(new Date(invoice.due_date))}` : undefined}
          />
        </div>
      )}
    </main>
  );
}
