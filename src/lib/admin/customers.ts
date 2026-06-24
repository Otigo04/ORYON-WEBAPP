import { createClient } from "@/lib/supabase/server";
import type { Customer } from "@/lib/customer";

export type { Customer } from "@/lib/customer";
export { customerLabel } from "@/lib/customer";

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Alle Kundenprofile (nur Admin – RLS-Policy `profiles_select_admin`).
 * Dient zur Kundenauswahl beim Anlegen von Projekten/Dokumenten.
 */
export async function getCustomers(): Promise<Customer[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, company")
      .eq("role", "user")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Customer[];
  } catch {
    return [];
  }
}
