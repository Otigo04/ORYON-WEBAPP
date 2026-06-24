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

const respondSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "in_progress", "answered", "closed"]),
  admin_note: z.string().max(5000).optional(),
});

/**
 * Setzt Status & interne Notiz einer Anfrage.
 * Sicherheit: requireAdmin() prüft serverseitig die Rolle; zusätzlich greift
 * die RLS-Policy `leads_admin_all`.
 */
export async function respondToLead(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = respondSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    admin_note: formData.get("admin_note") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("leads")
      .update({
        status: parsed.data.status,
        admin_note: parsed.data.admin_note || null,
      })
      .eq("id", parsed.data.id);

    if (error) return { ok: false, error: "Speichern fehlgeschlagen." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath("/admin/anfragen");
  revalidatePath("/admin");
  return { ok: true };
}
