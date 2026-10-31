import { createClient } from "@/lib/supabase/server";
import type { BriefData, BriefSummary } from "@/lib/brief";

export type BriefStatus = "new" | "in_progress" | "answered" | "closed";

export type Brief = {
  id: string;
  created_at: string;
  user_id: string | null;
  lead_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  data: BriefData & { _summary?: BriefSummary };
  project_type: string | null;
  price_min: number | null;
  price_max: number | null;
  status: BriefStatus;
  admin_note: string | null;
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

const COLS =
  "id, created_at, user_id, lead_id, name, email, phone, company, data, project_type, price_min, price_max, status, admin_note";

/** Alle detaillierten Konfigurationen (nur Admin, RLS-abgesichert). */
export async function getAllBriefs(): Promise<Brief[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("briefs")
      .select(COLS)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as Brief[];
  } catch {
    return [];
  }
}

/**
 * Die detaillierten Konfigurationen des aktuell eingeloggten Nutzers.
 * RLS (`briefs_select_own`) liefert ohnehin nur eigene Zeilen; der zusätzliche
 * user_id-Filter macht die Absicht explizit und schließt anonyme Briefs aus.
 */
export async function getMyBriefs(): Promise<Brief[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("briefs")
      .select(COLS)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as Brief[];
  } catch {
    return [];
  }
}

export async function getBrief(id: string): Promise<Brief | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("briefs")
      .select(COLS)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as Brief;
  } catch {
    return null;
  }
}

export const BRIEF_STATUS_LABELS: Record<BriefStatus, string> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  answered: "Beantwortet",
  closed: "Geschlossen",
};
