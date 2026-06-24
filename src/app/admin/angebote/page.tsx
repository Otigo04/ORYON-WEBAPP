import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, offerTone } from "@/components/ui/StatusBadge";
import { getAllOffers } from "@/lib/offers";
import { customerLabel } from "@/lib/admin/customers";
import { computeTotals, formatMoney, OFFER_STATUS_LABELS } from "@/lib/documents";

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" });

export default async function AdminOffersPage() {
  const offers = await getAllOffers();

  return (
    <>
      <PageHeader
        title="Angebote"
        subtitle="Angebote erstellen und nachverfolgen."
        action={{ href: "/admin/angebote/neu", label: "Neues Angebot" }}
      />

      {offers.length === 0 ? (
        <EmptyState>Noch keine Angebote. Lege das erste Angebot an.</EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-white/10">
            {offers.map((o) => {
              const total = computeTotals(o.items, o.tax_rate).gross;
              return (
                <li key={o.id}>
                  <Link
                    href={`/admin/angebote/${o.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        <span className="text-white/40">{o.number}</span> · {o.title}
                      </p>
                      <p className="truncate text-xs text-white/40">
                        {o.customer ? customerLabel(o.customer) : "—"} · {df.format(new Date(o.created_at))}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatMoney(total, o.currency)}</span>
                      <StatusBadge label={OFFER_STATUS_LABELS[o.status]} tone={offerTone(o.status)} />
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
