import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BeamsBackground from "@/components/BeamsBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LiveRefresh } from "@/components/dashboard/LiveRefresh";
import { ProjectTimeline } from "@/components/dashboard/ProjectTimeline";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge, projectTone } from "@/components/ui/StatusBadge";
import { getProjectWithUpdates } from "@/lib/projects";
import { PROJECT_STATUS_LABELS } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Projekt, TAS Webworks",
  robots: { index: false, follow: false },
};

export default async function CustomerProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProjectWithUpdates(id);
  if (!data) notFound();
  const { project, updates } = data;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <BeamsBackground />
      <LiveRefresh />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/25 to-black" />

      <DashboardHeader />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-10">
        <Link href="/dashboard" className="text-sm text-white/50 transition hover:text-white">
          ← Zurück zum Dashboard
        </Link>

        <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
              {project.description && (
                <p className="mt-2 max-w-xl text-sm text-white/60">{project.description}</p>
              )}
            </div>
            <StatusBadge label={PROJECT_STATUS_LABELS[project.status]} tone={projectTone(project.status)} />
          </div>
          <ProgressBar value={project.progress} className="mt-6" />
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Projektverlauf</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <ProjectTimeline updates={updates} projectId={project.id} />
        </section>
      </div>
    </main>
  );
}
