import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, invoiceTone } from "@/components/ui/StatusBadge";
import { getAllInvoices } from "@/lib/invoices";
import { customerLabel } from "@/lib/admin/customers";
import { computeTotals, formatMoney, INVOICE_STATUS_LABELS } from "@/lib/documents";

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" });

export default async function AdminInvoicesPage() {
  const invoices = await getAllInvoices();

  return (
    <>
      <PageHeader
        title="Rechnungen"
        subtitle="Rechnungen erstellen und verwalten."
        action={{ href: "/admin/rechnungen/neu", label: "Neue Rechnung" }}
      />

      {invoices.length === 0 ? (
        <EmptyState>Noch keine Rechnungen. Lege die erste Rechnung an.</EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-white/10">
            {invoices.map((inv) => {
              const total = computeTotals(inv.items, inv.tax_rate).gross;
              return (
                <li key={inv.id}>
                  <Link
                    href={`/admin/rechnungen/${inv.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        <span className="text-white/40">{inv.number}</span> · {inv.title}
                      </p>
                      <p className="truncate text-xs text-white/40">
                        {inv.customer ? customerLabel(inv.customer) : "—"} · {df.format(new Date(inv.issue_date))}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatMoney(total, inv.currency)}</span>
                      <StatusBadge label={INVOICE_STATUS_LABELS[inv.status]} tone={invoiceTone(inv.status)} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}
