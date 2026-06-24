import { deleteProjectUpdate } from "@/lib/actions/admin/projects";
import type { ProjectUpdate } from "@/lib/projects";

const formatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Chronologische Update-Timeline eines Projekts. Wird sowohl im Admin-Bereich
 * (mit Löschen-Button) als auch im Kunden-Dashboard (read-only) genutzt.
 */
export function ProjectTimeline({
  updates,
  projectId,
  allowDelete = false,
}: {
  updates: ProjectUpdate[];
  projectId: string;
  allowDelete?: boolean;
}) {
  if (updates.length === 0) {
    return (
      <p className="text-sm text-white/40">
        Noch keine Updates. Sobald es Neuigkeiten gibt, erscheinen sie hier.
      </p>
    );
  }

  return (
    <ol className="relative flex flex-col gap-5 border-l border-white/10 pl-6">
      {updates.map((u) => (
        <li key={u.id} className="relative">
          <span className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-[#09ed2d] bg-neutral-950" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">{u.title}</p>
              <p className="text-xs text-white/40">{formatter.format(new Date(u.created_at))}</p>
            </div>
            {allowDelete && (
              <form action={deleteProjectUpdate}>
                <input type="hidden" name="id" value={u.id} />
                <input type="hidden" name="project_id" value={projectId} />
                <button
                  type="submit"
                  className="rounded-lg px-2 py-1 text-xs text-white/40 transition hover:bg-red-400/10 hover:text-red-300"
                  aria-label="Update löschen"
                >
                  Löschen
                </button>
              </form>
            )}
          </div>
          {u.body && <p className="mt-1 whitespace-pre-wrap text-sm text-white/70">{u.body}</p>}
        </li>
      ))}
    </ol>
  );
}
