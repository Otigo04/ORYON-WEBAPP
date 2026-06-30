import { createClient } from "@/lib/supabase/server";
import { PRICING, type ProjectType } from "@/lib/pricing";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  project_type: ProjectType;
  price_min: number;
  price_max: number;
  monthly_min: number;
  monthly_max: number;
};

/**
 * Lädt die Leads des eingeloggten Nutzers (RLS-abgesichert: liefert ausschließlich
 * eigene Datensätze). Ohne Supabase-Konfiguration oder ohne Login wird eine leere
 * Liste zurückgegeben, die Dashboard-UI zeigt dann ihren Leerzustand.
 */
export async function getMyLeads(): Promise<Lead[]> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("leads")
      .select("id, created_at, name, email, project_type, price_min, price_max, monthly_min, monthly_max")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data) return [];
    return data as Lead[];
  } catch {
    return [];
  }
}

/** Menschlich lesbares Label einer Projektart (für die Lead-Anzeige). */
export function projectTypeLabel(type: ProjectType): string {
  return PRICING.projectTypes[type]?.label ?? type;
}
