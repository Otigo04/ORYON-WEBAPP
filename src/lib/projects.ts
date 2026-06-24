import { createClient } from "@/lib/supabase/server";

export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "review"
  | "done"
  | "paused";

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
};

export type ProjectUpdate = {
  id: string;
  created_at: string;
  project_id: string;
  title: string;
  body: string | null;
};

/** Projekt inkl. zugehöriger Kundenanzeige (Name/E-Mail) für die Admin-Liste. */
export type ProjectWithCustomer = Project & {
  customer: { full_name: string | null; email: string | null } | null;
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

const PROJECT_COLS =
  "id, created_at, updated_at, user_id, title, description, status, progress";

// ---- Kundensicht (RLS: nur eigene) -------------------------------------

/** Projekte des eingeloggten Kunden. */
export async function getMyProjects(): Promise<Project[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLS)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Project[];
  } catch {
    return [];
  }
}

/** Einzelnes Projekt inkl. Update-Timeline (RLS-abgesichert). */
export async function getProjectWithUpdates(
  id: string,
): Promise<{ project: Project; updates: ProjectUpdate[] } | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const { data: project, error } = await supabase
      .from("projects")
      .select(PROJECT_COLS)
      .eq("id", id)
      .maybeSingle();

    if (error || !project) return null;

    const { data: updates } = await supabase
      .from("project_updates")
      .select("id, created_at, project_id, title, body")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    return {
      project: project as Project,
      updates: (updates ?? []) as ProjectUpdate[],
    };
  } catch {
    return null;
  }
}

// ---- Adminsicht (RLS: is_admin -> alle) --------------------------------

/** Alle Projekte mit Kundenangabe (nur Admin). */
export async function getAllProjects(): Promise<ProjectWithCustomer[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(`${PROJECT_COLS}, customer:profiles!projects_user_id_fkey(full_name, email)`)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as unknown as ProjectWithCustomer[];
  } catch {
    return [];
  }
}
