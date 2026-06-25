"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/profile";

export type UpdateProfileState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  /** True, wenn keine Supabase-Konfiguration vorhanden ist (Demo-Modus). */
  demo?: boolean;
} | null;

/**
 * Aktualisiert das Profil des eingeloggten Nutzers (für `useActionState`).
 *
 * Sicherheit:
 * - Vollständige serverseitige Zod-Validierung.
 * - Der zu ändernde Datensatz wird über die Session-`user.id` bestimmt, nicht
 *   über Client-Input. Die RLS-Policy `profiles_update_own` stellt zusätzlich
 *   sicher, dass nur das eigene Profil geschrieben werden kann.
 */
export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const parsed = profileUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Bitte überprüfe deine Eingaben.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return { ok: true, demo: true };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Bitte melde dich erneut an." };

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        company: parsed.data.company,
        phone: parsed.data.phone,
      })
      .eq("id", user.id);

    if (error) {
      console.error("[updateProfile] update failed:", error.message);
      return { ok: false, error: "Profil konnte nicht gespeichert werden. Bitte versuche es erneut." };
    }

    revalidatePath("/dashboard/einstellungen");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler. Bitte versuche es später erneut." };
  }
}
