import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * Validierung der editierbaren Profilfelder. Die E-Mail ändert man über den
 * separaten Auth-Flow, daher hier bewusst nicht enthalten. Leere optionale
 * Felder werden zu `null` normalisiert.
 */
export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Bitte gib deinen vollständigen Namen an.")
    .max(120, "Der Name ist zu lang."),
  company: z
    .string()
    .trim()
    .max(120, "Der Firmenname ist zu lang.")
    .optional()
    .transform((v) => v || null),
  phone: z
    .string()
    .trim()
    .max(40, "Die Telefonnummer ist zu lang.")
    .optional()
    .transform((v) => v || null),
});

export type ProfileUpdateInput = z.input<typeof profileUpdateSchema>;

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
};

/**
 * Lädt das Profil des eingeloggten Nutzers (RLS-abgesichert: liefert
 * ausschließlich den eigenen Datensatz). Ohne Supabase-Konfiguration, ohne
 * Login oder bei einem Fehler wird `null` zurückgegeben – die UI fällt dann auf
 * eine generische Begrüßung zurück.
 */
export async function getMyProfile(): Promise<Profile | null> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, company, phone")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data as Profile;
  } catch {
    return null;
  }
}

/** Liefert den Vornamen aus dem vollen Namen (für eine persönliche Anrede). */
export function firstNameOf(fullName: string | null | undefined): string | null {
  if (!fullName) return null;
  const first = fullName.trim().split(/\s+/)[0];
  return first || null;
}
