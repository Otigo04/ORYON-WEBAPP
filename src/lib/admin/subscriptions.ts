import { createClient } from "@/lib/supabase/server";
import type {
  SubscriptionStatus,
  BillingInterval,
} from "@/lib/subscription";
import type { FleetPlanId } from "@/lib/tas-fleet";

export type CustomerSubscription = {
  plan: FleetPlanId;
  status: SubscriptionStatus;
  billing_interval: BillingInterval;
  current_period_end: string | null;
  vehicle_limit: number | null;
};

export type AdminCustomer = {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  subscription: CustomerSubscription | null;
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Alle Kunden samt (optionalem) TAS-FLEET-Abo, nur für Admins, RLS über
 * `is_admin()`. Das Abo wird per PostgREST-Embed aus `subscriptions` geholt
 * (1:1 über die eindeutige `user_id`).
 */
export async function getAllCustomers(): Promise<AdminCustomer[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, company, subscriptions(plan, status, billing_interval, current_period_end, vehicle_limit)",
      )
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => {
      const subs = (row.subscriptions ?? []) as CustomerSubscription[];
      return {
        id: row.id as string,
        full_name: row.full_name as string | null,
        email: row.email as string | null,
        company: row.company as string | null,
        subscription: subs[0] ?? null,
      };
    });
  } catch {
    return [];
  }
}
