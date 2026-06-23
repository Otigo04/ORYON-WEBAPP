import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
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
      .select("id, full_name, email, company")
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
