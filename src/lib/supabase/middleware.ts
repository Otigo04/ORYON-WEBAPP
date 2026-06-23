import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Aktualisiert die Supabase-Session bei jedem Request (Token-Refresh) und
 * synchronisiert die Auth-Cookies zwischen Request und Response.
 *
 * Hinweis (MVP): Solange keine Supabase-Umgebungsvariablen gesetzt sind, wird
 * der Request unverändert durchgereicht, damit die App auch ohne Backend lokal
 * lauffähig bleibt. Die Absicherung geschützter Routen (z. B. Redirect von
 * `/dashboard` auf `/login`) wird aktiviert, sobald Auth & Login-Seite stehen.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Ohne konfiguriertes Backend: Request einfach durchreichen.
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // WICHTIG: getUser() erneuert das Token. Niemals Code dazwischen einfügen,
  // sonst können schwer auffindbare Logout-Bugs entstehen.
  await supabase.auth.getUser();

  return supabaseResponse;
}
