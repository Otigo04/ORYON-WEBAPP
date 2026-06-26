import { createClient } from "@/lib/supabase/server";
import type { FleetPlanId } from "@/lib/tas-fleet";
import type { SubscriptionStatus, BillingInterval } from "@/lib/subscription-labels";

// Client-sichere Typen & Labels liegen in `subscription-labels.ts` und werden
// hier zur Abwärtskompatibilität re-exportiert.
export type { SubscriptionStatus, BillingInterval } from "@/lib/subscription-labels";
export {
  SUBSCRIPTION_STATUS_LABELS,
  BILLING_INTERVAL_LABELS,
} from "@/lib/subscription-labels";

export type Subscription = {
  id: string;
  user_id: string;
  plan: FleetPlanId;
  status: SubscriptionStatus;
  billing_interval: BillingInterval;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  vehicle_limit: number | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  created_at: string;
  updated_at: string;
};

/** Spalten, die das Kundenportal liest (Stripe-IDs bleiben außen vor). */
const PUBLIC_COLUMNS =
  "id, user_id, plan, status, billing_interval, current_period_start, current_period_end, cancel_at_period_end, vehicle_limit, created_at, updated_at";

/**
 * Gilt das Abo aktuell als nutzbar? Aktiv oder in Testphase – und (falls ein
 * Ablaufdatum gesetzt ist) noch nicht abgelaufen. Genau diese Logik darf später
 * auch TAS-FLEET spiegeln, um den Produktzugang freizugeben.
 */
export function isSubscriptionUsable(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (sub.status !== "active" && sub.status !== "trialing") return false;
  if (sub.current_period_end && new Date(sub.current_period_end) < new Date()) {
    return false;
  }
  return true;
}

/**
 * Lädt das Abo des eingeloggten Nutzers (RLS-abgesichert: nur der eigene
 * Datensatz). Liefert `null`, wenn kein Abo existiert, keine Supabase-Konfig
 * vorhanden ist oder kein Nutzer eingeloggt ist.
 */
export async function getMySubscription(): Promise<Subscription | null> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!hasSupabaseEnv) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("subscriptions")
      .select(PUBLIC_COLUMNS)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) return null;
    return data as Subscription;
  } catch {
    return null;
  }
}
