import Link from "next/link";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge, leadTone } from "@/components/ui/StatusBadge";
import { getAllLeads } from "@/lib/admin/leads";
import { getAllProjects } from "@/lib/projects";
import { getAllInvoices } from "@/lib/invoices";
import { LEAD_STATUS_LABELS } from "@/lib/documents";
import { projectTypeLabel } from "@/lib/leads";
import { formatEuro } from "@/lib/pricing";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminOverviewPage() {
  const [leads, projects, invoices] = await Promise.all([
    getAllLeads(),
    getAllProjects(),
    getAllInvoices(),
  ]);

  const openLeads = leads.filter((l) => l.status === "new" || l.status === "in_progress");
  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "review" || p.status === "planning",
  );
  const unpaidInvoices = invoices.filter((i) => i.status === "sent");

  const stats = [
    { label: "Offene Anfragen", value: openLeads.length, href: "/admin/anfragen" },
    { label: "Aktive Projekte", value: activeProjects.length, href: "/admin/projekte" },
    { label: "Offene Rechnungen", value: unpaidInvoices.length, href: "/admin/rechnungen" },
  ];

  return (
    <>
      <PageHeader
        title="Übersicht"
        subtitle="Dein zentrales Cockpit, Anfragen, Projekte und Rechnungen auf einen Blick."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:border-[#09ed2d]/30 hover:bg-white/[0.05]">
              <p className="text-sm text-white/50">{s.label}</p>
              <p className="mt-2 text-4xl font-semibold">{s.value}</p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Neueste Anfragen</h2>
          <Link href="/admin/anfragen" className="text-sm text-[#09ed2d] hover:underline">
            Alle ansehen →
          </Link>
        </div>

        <Card className="p-0">
          {leads.length === 0 ? (
            <p className="p-6 text-sm text-white/50">Noch keine Anfragen eingegangen.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {leads.slice(0, 6).map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/anfragen#lead-${lead.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{lead.name}</p>
                      <p className="truncate text-xs text-white/40">
                        {projectTypeLabel(lead.project_type)} · {dateFormatter.format(new Date(lead.created_at))}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#09ed2d]">
                        {formatEuro(lead.price_min)} bis {formatEuro(lead.price_max)}
                      </span>
                      <StatusBadge label={LEAD_STATUS_LABELS[lead.status]} tone={leadTone(lead.status)} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </>
  );
}
