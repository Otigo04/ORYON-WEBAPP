import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { getAllShowcaseProjects } from "@/lib/portfolio";

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" });

export default async function AdminShowcaseProjectsPage() {
  const projects = await getAllShowcaseProjects();

  return (
    <>
      <PageHeader
        title="Referenzen"
        subtitle="Echte Projekte für das Portfolio auf der Startseite pflegen."
        action={{ href: "/admin/referenzen/neu", label: "Neue Referenz" }}
      />

      {projects.length === 0 ? (
        <EmptyState>
          Noch keine Referenzen. Lege die erste an, solange keine veröffentlicht ist, zeigt die
          Startseite Beispiel-Projekte.
        </EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-white/10">
            {projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/referenzen/${p.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="truncate text-xs text-white/40">
                      {p.category} · {df.format(new Date(p.created_at))}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.published
                        ? "bg-[#09ed2d]/15 text-[#09ed2d]"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {p.published ? "Veröffentlicht" : "Entwurf"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
