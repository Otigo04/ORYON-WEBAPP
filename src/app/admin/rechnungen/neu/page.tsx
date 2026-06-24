import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { getCustomers } from "@/lib/admin/customers";

export default async function NewInvoicePage() {
  const customers = await getCustomers();
  return (
    <>
      <PageHeader title="Neue Rechnung" />
      <Link href="/admin/rechnungen" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück
      </Link>
      <Card className="max-w-3xl">
        {customers.length === 0 ? (
          <p className="text-sm text-white/50">Es sind noch keine Kunden registriert.</p>
        ) : (
          <InvoiceForm customers={customers} />
        )}
      </Card>
    </>
  );
}
