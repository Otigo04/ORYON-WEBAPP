import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Verify-Route: löst den Token aus einer Supabase-Auth-E-Mail ein.
 *
 * Wird aktuell vom Passwort-Reset genutzt (`type=recovery`) und ist bereits so
 * generisch, dass die spätere Signup-E-Mail-Bestätigung (`type=email`/`signup`)
 * dieselbe Route ohne Änderung mitnutzen kann.
 *
 * Sicherheit: `verifyOtp` setzt bei Erfolg die httpOnly-Session-Cookies. Erst
 * danach besitzt der Nutzer eine gültige Session (z. B. um ein neues Passwort
 * zu setzen). Bei ungültigem/abgelaufenem Link wird auf /login umgeleitet.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // Nur interne Pfade zulassen (kein Open-Redirect).
      const target = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=link_ungueltig", request.url),
  );
}
