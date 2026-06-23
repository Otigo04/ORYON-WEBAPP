import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase-Client für Server Components, Server Actions und Route Handlers.
 *
 * Sicherheit: Der Client liest/schreibt das Session-Cookie über die Next.js
 * `cookies()`-Bridge. Datenzugriffe werden serverseitig durch Supabase
 * Row Level Security (RLS) abgesichert – ein eingeloggter Nutzer sieht damit
 * ausschließlich seine eigenen Datensätze.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` wurde aus einer Server Component aufgerufen.
            // Das kann ignoriert werden, sofern die Middleware die Session
            // ohnehin aktualisiert (siehe src/lib/supabase/middleware.ts).
          }
        },
      },
    },
  );
}
