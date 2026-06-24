import { createClient } from "@/lib/supabase/server";

export type ConceptStatus = "draft" | "shared";

export type Concept = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_id: string | null;
  title: string;
  content: string | null;
  status: ConceptStatus;
};

export type ConceptWithCustomer = Concept & {
  customer: { full_name: string | null; email: string | null } | null;
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

const COLS =
  "id, created_at, updated_at, user_id, project_id, title, content, status";

/** Konzepte des eingeloggten Kunden (RLS: nur geteilte). */
export async function getMyConcepts(): Promise<Concept[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("concepts")
      .select(COLS)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Concept[];
  } catch {
    return [];
  }
}

export async function getConcept(id: string): Promise<Concept | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("concepts")
      .select(COLS)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as Concept;
  } catch {
    return null;
  }
}

/** Alle Konzepte mit Kundenangabe (nur Admin). */
export async function getAllConcepts(): Promise<ConceptWithCustomer[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("concepts")
      .select(`${COLS}, customer:profiles!concepts_user_id_fkey(full_name, email)`)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as unknown as ConceptWithCustomer[];
  } catch {
    return [];
  }
}
