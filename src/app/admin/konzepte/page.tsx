import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, conceptTone } from "@/components/ui/StatusBadge";
import { getAllConcepts } from "@/lib/concepts";
import { customerLabel } from "@/lib/admin/customers";
import { CONCEPT_STATUS_LABELS } from "@/lib/documents";

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" });

export default async function AdminConceptsPage() {
  const concepts = await getAllConcepts();

  return (
    <>
      <PageHeader
        title="Konzepte"
        subtitle="Konzepte erstellen und mit Kunden teilen."
        action={{ href: "/admin/konzepte/neu", label: "Neues Konzept" }}
      />

      {concepts.length === 0 ? (
        <EmptyState>Noch keine Konzepte. Lege das erste Konzept an.</EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-white/10">
            {concepts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/konzepte/${c.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.title}</p>
                    <p className="truncate text-xs text-white/40">
                      {c.customer ? customerLabel(c.customer) : "—"} · {df.format(new Date(c.created_at))}
                    </p>
                  </div>
                  <StatusBadge label={CONCEPT_STATUS_LABELS[c.status]} tone={conceptTone(c.status)} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
