import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, leadTone } from "@/components/ui/StatusBadge";
import { getAllBriefs, BRIEF_STATUS_LABELS } from "@/lib/briefs";
import { formatEuro } from "@/lib/pricing";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminBriefsPage() {
  const briefs = await getAllBriefs();

  return (
    <>
      <PageHeader
        title="Konfigurationen"
        subtitle="Detaillierte Projekt-Anfragen aus dem Konfigurator, mit allen Angaben des Kunden."
      />

      {briefs.length === 0 ? (
        <EmptyState>
          Noch keine detaillierten Konfigurationen. Sobald jemand den Konfigurator absendet,
          erscheint die Anfrage hier.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {briefs.map((b) => (
            <Link key={b.id} href={`/admin/konfigurationen/${b.id}`} className="block">
              <Card className="transition hover:border-[#09ed2d]/40 hover:bg-white/[0.05]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{b.name}</h3>
                      <StatusBadge label={BRIEF_STATUS_LABELS[b.status]} tone={leadTone(b.status)} />
                    </div>
                    <p className="mt-0.5 text-sm text-white/50">
                      {b.company ? `${b.company} · ` : ""}
                      {b.email}
                    </p>
                    <p className="mt-0.5 text-xs text-white/35">
                      {dateFormatter.format(new Date(b.created_at))}
                    </p>
                  </div>
                  <div className="text-right">
                    {typeof b.price_min === "number" && typeof b.price_max === "number" && (
                      <p className="text-lg font-semibold text-[#09ed2d]">
                        {formatEuro(b.price_min)} bis {formatEuro(b.price_max)}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-white/40">Details ansehen →</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
