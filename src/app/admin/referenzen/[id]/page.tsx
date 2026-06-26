import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { ShowcaseProjectForm } from "@/components/admin/ShowcaseProjectForm";
import { getShowcaseProject } from "@/lib/portfolio";
import { deleteShowcaseProject } from "@/lib/actions/admin/showcase";

export default async function EditShowcaseProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getShowcaseProject(id);
  if (!project) notFound();

  return (
    <>
      <PageHeader title={project.title} subtitle="Referenz bearbeiten." />
      <Link href="/admin/referenzen" className="mb-4 inline-block text-sm text-white/50 hover:text-white">
        ← Zurück
      </Link>
      <Card className="max-w-3xl">
        <ShowcaseProjectForm project={project} />
      </Card>

      <form action={deleteShowcaseProject} className="mt-4 max-w-3xl">
        <input type="hidden" name="id" value={project.id} />
        <button
          type="submit"
          className="text-sm text-red-300/80 transition hover:text-red-300"
        >
          Referenz löschen
        </button>
      </form>
    </>
  );
}
