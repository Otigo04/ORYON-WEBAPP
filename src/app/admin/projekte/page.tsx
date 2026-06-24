import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge, projectTone } from "@/components/ui/StatusBadge";
import { getAllProjects } from "@/lib/projects";
import { customerLabel } from "@/lib/admin/customers";
import { PROJECT_STATUS_LABELS } from "@/lib/documents";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <>
      <PageHeader
        title="Projekte"
        subtitle="Projekte verwalten und den Fortschritt live für Kunden aktualisieren."
        action={{ href: "/admin/projekte/neu", label: "Neues Projekt" }}
      />

      {projects.length === 0 ? (
        <EmptyState>Noch keine Projekte. Lege das erste Projekt an.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.id} href={`/admin/projekte/${p.id}`}>
              <Card className="h-full transition hover:border-[#09ed2d]/30 hover:bg-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{p.title}</h3>
                    <p className="truncate text-xs text-white/40">
                      {p.customer ? customerLabel(p.customer) : "—"}
                    </p>
                  </div>
                  <StatusBadge label={PROJECT_STATUS_LABELS[p.status]} tone={projectTone(p.status)} />
                </div>
                <ProgressBar value={p.progress} className="mt-4" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
