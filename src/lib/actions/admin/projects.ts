"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const projectStatus = z.enum([
  "planning",
  "in_progress",
  "review",
  "done",
  "paused",
]);

const createSchema = z.object({
  user_id: z.string().uuid("Bitte einen Kunden auswählen."),
  title: z.string().min(2, "Titel fehlt.").max(160),
  description: z.string().max(5000).optional(),
  status: projectStatus.default("planning"),
  progress: z.coerce.number().min(0).max(100).default(0),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, "Titel fehlt.").max(160),
  description: z.string().max(5000).optional(),
  status: projectStatus,
  progress: z.coerce.number().min(0).max(100),
});

const updateEntrySchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(2, "Titel fehlt.").max(160),
  body: z.string().max(5000).optional(),
});

/** Legt ein neues Projekt für einen Kunden an. */
export async function createProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createSchema.safeParse({
    user_id: formData.get("user_id"),
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    status: formData.get("status") ?? undefined,
    progress: formData.get("progress") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").insert({
      user_id: parsed.data.user_id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      status: parsed.data.status,
      progress: parsed.data.progress,
    });
    if (error) return { ok: false, error: "Projekt konnte nicht angelegt werden." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath("/admin/projekte");
  return { ok: true };
}

/** Aktualisiert Stammdaten, Status und Fortschritt eines Projekts. */
export async function updateProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    status: formData.get("status"),
    progress: formData.get("progress"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .update({
        title: parsed.data.title,
        description: parsed.data.description || null,
        status: parsed.data.status,
        progress: parsed.data.progress,
      })
      .eq("id", parsed.data.id);
    if (error) return { ok: false, error: "Speichern fehlgeschlagen." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/projekte/${parsed.data.id}`);
  revalidatePath("/admin/projekte");
  return { ok: true };
}

/** Fügt einen Eintrag zur Live-Timeline eines Projekts hinzu. */
export async function addProjectUpdate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateEntrySchema.safeParse({
    project_id: formData.get("project_id"),
    title: formData.get("title"),
    body: formData.get("body") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("project_updates").insert({
      project_id: parsed.data.project_id,
      author_id: user?.id ?? null,
      title: parsed.data.title,
      body: parsed.data.body || null,
    });
    if (error) return { ok: false, error: "Update konnte nicht gespeichert werden." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/projekte/${parsed.data.project_id}`);
  return { ok: true };
}

/** Löscht einen Timeline-Eintrag. */
export async function deleteProjectUpdate(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  const projectId = formData.get("project_id");
  if (typeof id !== "string") return;

  try {
    const supabase = await createClient();
    await supabase.from("project_updates").delete().eq("id", id);
  } catch {
    // bewusst still – UI revalidiert ohnehin
  }

  if (typeof projectId === "string") {
    revalidatePath(`/admin/projekte/${projectId}`);
  }
}
