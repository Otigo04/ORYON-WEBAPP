import { createClient } from "@/lib/supabase/server";
import type { LineItem } from "@/lib/documents";

export type OfferStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

export type Offer = {
  id: string;
  created_at: string;
  user_id: string;
  project_id: string | null;
  number: string;
  title: string;
  status: OfferStatus;
  valid_until: string | null;
  items: LineItem[];
  tax_rate: number;
  currency: string;
  content: string | null;
};

export type OfferWithCustomer = Offer & {
  customer: { full_name: string | null; email: string | null } | null;
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

const COLS =
  "id, created_at, user_id, project_id, number, title, status, valid_until, items, tax_rate, currency, content";

/** Angebote des eingeloggten Kunden (RLS: ohne Entwürfe). */
export async function getMyOffers(): Promise<Offer[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("offers")
      .select(COLS)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Offer[];
  } catch {
    return [];
  }
}

export async function getOffer(id: string): Promise<Offer | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("offers")
      .select(COLS)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as Offer;
  } catch {
    return null;
  }
}

/** Alle Angebote mit Kundenangabe (nur Admin). */
export async function getAllOffers(): Promise<OfferWithCustomer[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("offers")
      .select(`${COLS}, customer:profiles!offers_user_id_fkey(full_name, email)`)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as unknown as OfferWithCustomer[];
  } catch {
    return [];
  }
}
