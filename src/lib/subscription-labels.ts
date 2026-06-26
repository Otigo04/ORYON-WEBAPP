/**
 * Client-sichere Abo-Typen und -Beschriftungen.
 *
 * Bewusst OHNE Server-Importe (kein `next/headers`/Supabase-Server-Client),
 * damit auch Client-Komponenten (z. B. SubscriptionForm) diese Werte nutzen
 * können, ohne serverseitigen Code in den Browser-Bundle zu ziehen.
 */

/** Lebenszyklus-Status eines Abos (an Stripe angelehnt). */
export type SubscriptionStatus =
  | "incomplete"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export type BillingInterval = "monthly" | "yearly";

/** Deutsche Beschriftungen der Abo-Status. */
export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  incomplete: "Zahlung ausstehend",
  trialing: "Testphase",
  active: "Aktiv",
  past_due: "Zahlung überfällig",
  canceled: "Gekündigt",
};

export const BILLING_INTERVAL_LABELS: Record<BillingInterval, string> = {
  monthly: "Monatlich",
  yearly: "Jährlich",
};
