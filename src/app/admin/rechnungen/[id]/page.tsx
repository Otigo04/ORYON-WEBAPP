import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { getInvoice } from "@/lib/invoices";
import { getCustomers } from "@/lib/admin/customers";
import { getAllBriefs } from "@/lib/briefs";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, customers, briefs] = await Promise.all([getInvoice(id), getCustomers(), getAllBriefs()]);
  if (!invoice) notFound();

  return (
    <>
      <PageHeader title={`Rechnung ${invoice.number}`} subtitle="Rechnung bearbeiten." />
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/rechnungen" className="text-sm text-white/50 hover:text-white">
          ← Zurück
        </Link>
        <Link href={`/dashboard/rechnungen/${invoice.id}`} className="text-sm text-[#09ed2d] hover:underline">
          Als PDF herunterladen →
        </Link>
      </div>
      <Card className="max-w-3xl">
        <InvoiceForm invoice={invoice} customers={customers} briefs={briefs} />
      </Card>
    </>
  );
}
