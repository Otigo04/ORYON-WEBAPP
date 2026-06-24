import { createClient } from "@/lib/supabase/server";
import type { ProjectType } from "@/lib/pricing";

export type LeadStatus = "new" | "in_progress" | "answered" | "closed";

export type AdminLead = {
  id: string;
  created_at: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  project_type: ProjectType;
  design: string;
  features: string[];
  extra_languages: number;
  maintenance: boolean;
  price_min: number;
  price_max: number;
  monthly_min: number;
  monthly_max: number;
  status: LeadStatus;
  admin_note: string | null;
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/** Alle Anfragen aus dem Preisrechner (nur Admin, RLS via is_admin()). */
export async function getAllLeads(): Promise<AdminLead[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, created_at, user_id, name, email, phone, company, message, project_type, design, features, extra_languages, maintenance, price_min, price_max, monthly_min, monthly_max, status, admin_note",
      )
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as AdminLead[];
  } catch {
    return [];
  }
}
