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

const baseSchema = z.object({
  user_id: z.string().uuid("Bitte einen Kunden auswählen."),
  project_id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().min(2, "Titel fehlt.").max(160),
  content: z.string().max(20000).optional(),
  status: z.enum(["draft", "shared"]),
});

function readForm(formData: FormData) {
  return baseSchema.safeParse({
    user_id: formData.get("user_id"),
    project_id: formData.get("project_id") ?? undefined,
    title: formData.get("title"),
    content: formData.get("content") ?? undefined,
    status: formData.get("status"),
  });
}

export async function createConcept(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("concepts").insert({
      user_id: parsed.data.user_id,
      project_id: parsed.data.project_id || null,
      title: parsed.data.title,
      content: parsed.data.content || null,
      status: parsed.data.status,
    });
    if (error) return { ok: false, error: "Konzept konnte nicht angelegt werden." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath("/admin/konzepte");
  return { ok: true };
}

export async function updateConcept(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, error: "Ungültige Anfrage." };

  const parsed = readForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("concepts")
      .update({
        user_id: parsed.data.user_id,
        project_id: parsed.data.project_id || null,
        title: parsed.data.title,
        content: parsed.data.content || null,
        status: parsed.data.status,
      })
      .eq("id", id);
    if (error) return { ok: false, error: "Speichern fehlgeschlagen." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/konzepte/${id}`);
  revalidatePath("/admin/konzepte");
  return { ok: true };
}
