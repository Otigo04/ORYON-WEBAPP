import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectUpdateForm } from "@/components/admin/ProjectUpdateForm";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import { getProjectWithUpdates } from "@/lib/projects";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProjectWithUpdates(id);
  if (!data) notFound();

  const { project, updates } = data;

  return (
    <>
      <PageHeader title={project.title} subtitle="Projektdetails, Fortschritt und Live-Timeline." />
      <Link href="/admin/projekte" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück zu den Projekten
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Projekt bearbeiten</h2>
          <ProjectForm project={project} />
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Update posten</h2>
          <ProjectUpdateForm projectId={project.id} />
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-5 text-lg font-semibold">Timeline</h2>
        <ProjectTimeline updates={updates} projectId={project.id} allowDelete />
      </Card>
    </>
  );
}
