import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Aktualisiert die Supabase-Session bei jedem Request (Token-Refresh) und
 * synchronisiert die Auth-Cookies zwischen Request und Response.
 *
 * Hinweis (MVP): Solange keine Supabase-Umgebungsvariablen gesetzt sind, wird
 * der Request unverändert durchgereicht, damit die App auch ohne Backend lokal
 * lauffähig bleibt. Bei konfiguriertem Backend werden geschützte Routen
 * abgesichert: nicht eingeloggte Nutzer werden von `/dashboard` auf `/login`
 * umgeleitet, eingeloggte von `/login` bzw. `/register` auf `/dashboard`.
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/dashboard");
  const isAuthPage = path === "/login" || path === "/register";

  // Geschützte Route ohne Login → zur Anmeldung.
  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    const redirect = NextResponse.redirect(redirectUrl);
    // Aktualisierte Auth-Cookies auf die Redirect-Antwort übertragen.
    supabaseResponse.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  // Bereits eingeloggt, aber auf Login/Register → ins Dashboard.
  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    const redirect = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return supabaseResponse;
}
