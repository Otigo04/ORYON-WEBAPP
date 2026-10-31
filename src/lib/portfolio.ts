import { createClient } from "@/lib/supabase/server";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Optionaler Bild-URL; ist keiner gesetzt, rendert die UI einen Verlauf. */
  image_url: string | null;
};

/** Vollständiger Datensatz inkl. Verwaltungsfelder (für das Admin-Panel). */
export type ShowcaseProject = Project & {
  created_at: string;
  project_url: string | null;
  sort_order: number;
  published: boolean;
};

const ADMIN_COLS =
  "id, created_at, title, category, description, image_url, project_url, sort_order, published";

/** Alle Referenzprojekte (inkl. Entwürfe) – nur für Admins (RLS). */
export async function getAllShowcaseProjects(): Promise<ShowcaseProject[]> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("showcase_projects")
      .select(ADMIN_COLS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as ShowcaseProject[];
  } catch {
    return [];
  }
}

export async function getShowcaseProject(id: string): Promise<ShowcaseProject | null> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("showcase_projects")
      .select(ADMIN_COLS)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as ShowcaseProject;
  } catch {
    return null;
  }
}
