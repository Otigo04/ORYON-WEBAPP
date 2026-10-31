import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-Client für Client Components ("use client").
 * Nutzt ausschließlich öffentliche (NEXT_PUBLIC_) Keys, niemals den Service-Role-Key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
