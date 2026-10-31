import { createClient } from "@/lib/supabase/server";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Cover-Bild; ist keiner gesetzt, rendert die UI einen Verlauf. */
  image_url: string | null;
  /** Weitere Galeriebilder für die Diashow (öffentliche Storage-URLs). */
  images: string[] | null;
};

/**
 * Vollständige Bildliste eines Projekts für die Diashow: Cover (`image_url`)
 * zuerst, danach die weiteren `images` – ohne Duplikate. Leeres Array, wenn
 * kein Bild vorliegt (die UI zeigt dann einen Verlauf-Fallback).
 */
export function projectImages(p: Pick<Project, "image_url" | "images">): string[] {
  const all = [p.image_url, ...(p.images ?? [])].filter(
    (u): u is string => typeof u === "string" && u.length > 0,
  );
  return Array.from(new Set(all));
}

/** Vollständiger Datensatz inkl. Verwaltungsfelder (für das Admin-Panel). */
export type ShowcaseProject = Project & {
  created_at: string;
  project_url: string | null;
  sort_order: number;
  published: boolean;
};

const ADMIN_COLS =
  "id, created_at, title, category, description, image_url, images, project_url, sort_order, published";

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
