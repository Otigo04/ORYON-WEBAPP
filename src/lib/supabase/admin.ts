import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase-Client mit Service-Role-Key – umgeht RLS.
 *
 * NUR serverseitig und nur dort verwenden, wo der Aufrufer bereits anderweitig
 * autorisiert ist (z. B. im Stripe-Webhook, dessen Signatur geprüft wurde).
 * Niemals an den Client ausliefern.
 *
 * Gibt `null` zurück, wenn `SUPABASE_SERVICE_ROLE_KEY` fehlt.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
