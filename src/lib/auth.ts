import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "user" | "admin";

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Liest die Rolle des aktuell eingeloggten Nutzers aus `profiles`.
 * Gibt `null` zurück, wenn kein Login besteht oder das Backend fehlt.
 * RLS-abgesichert: Nutzer dürfen ihre eigene Profilzeile lesen.
 */
export async function getCurrentRole(): Promise<Role | null> {
  if (!hasSupabaseEnv()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    return (data?.role as Role | undefined) ?? "user";
  } catch {
    return null;
  }
}

/** True, wenn der eingeloggte Nutzer Admin (Superadmin) ist. */
export async function isAdmin(): Promise<boolean> {
  return (await getCurrentRole()) === "admin";
}

/**
 * Serverseitige Zweitprüfung für den Admin-Bereich. Jede Admin-Seite und jede
 * Admin-Server-Action ruft dies auf – unabhängig von der Middleware (defense in
 * depth). Leitet Nicht-Admins um.
 */
export async function requireAdmin() {
  const role = await getCurrentRole();
  if (role !== "admin") {
    redirect(role ? "/dashboard" : "/login");
  }
}
