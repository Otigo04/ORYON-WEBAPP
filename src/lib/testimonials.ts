import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  quote: string;
  rating: number;
};

/** Vollständiger Datensatz inkl. Verwaltungsfelder (für das Admin-Panel). */
export type TestimonialRow = Testimonial & {
  created_at: string;
  sort_order: number;
  published: boolean;
};

const ADMIN_COLS = "id, created_at, author, role, quote, rating, sort_order, published";

/** Alle Bewertungen (inkl. Entwürfe) – nur für Admins (RLS). */
export async function getAllTestimonials(): Promise<TestimonialRow[]> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select(ADMIN_COLS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as TestimonialRow[];
  } catch {
    return [];
  }
}

export async function getTestimonial(id: string): Promise<TestimonialRow | null> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select(ADMIN_COLS)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as TestimonialRow;
  } catch {
    return null;
  }
}
