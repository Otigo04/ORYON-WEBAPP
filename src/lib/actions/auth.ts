"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

/**
 * Auth-Server-Actions (Login & Registrierung) über Supabase Auth.
 *
 * Sicherheit:
 * - Alle Eingaben werden serverseitig mit Zod validiert.
 * - Passwörter werden ausschließlich an Supabase übergeben (gehasht gespeichert),
 *   niemals selbst geloggt oder gespeichert.
 * - Die Session wird als httpOnly-Cookie über die SSR-Bridge gesetzt; die
 *   Middleware (proxy.ts) hält sie aktuell.
 */

export type AuthState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const loginSchema = z.object({
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an."),
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});

const registerSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen an.").max(80),
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an."),
  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
    .max(72, "Das Passwort darf höchstens 72 Zeichen lang sein."),
});

const requestResetSchema = z.object({
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an."),
});

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
      .max(72, "Das Passwort darf höchstens 72 Zeichen lang sein."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirm"],
  });

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/**
 * Ermittelt den Origin der aktuellen Anfrage (z. B. http://localhost:3000 oder
 * https://www.tas-webworks.de), damit E-Mail-Links lokal wie in Produktion
 * korrekt funktionieren. Fällt auf die konfigurierte Site-URL zurück.
 */
async function getRequestOrigin() {
  const hdrs = await headers();
  const host = hdrs.get("host");
  if (!host) return siteConfig.url;
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signInAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (!hasSupabaseEnv()) {
    return { error: "Anmeldung ist derzeit nicht verfügbar. Bitte versuche es später erneut." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) {
      return { error: "E-Mail-Adresse oder Passwort ist nicht korrekt." };
    }
  } catch {
    return { error: "Unerwarteter Fehler bei der Anmeldung. Bitte versuche es erneut." };
  }

  // Erfolgreich: außerhalb des try/catch umleiten (redirect wirft intern).
  redirect("/dashboard");
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (!hasSupabaseEnv()) {
    return { error: "Registrierung ist derzeit nicht verfügbar. Bitte versuche es später erneut." };
  }

  const { name, email, password } = parsed.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${siteConfig.url}/dashboard`,
      },
    });

    if (error) {
      return { error: "Registrierung fehlgeschlagen. Existiert bereits ein Konto mit dieser E-Mail?" };
    }

    // Wenn E-Mail-Bestätigung aktiv ist, gibt es noch keine Session.
    if (!data.session) {
      return {
        success:
          "Fast geschafft! Wir haben dir eine E-Mail zur Bestätigung deines Kontos geschickt.",
      };
    }
  } catch {
    return { error: "Unerwarteter Fehler bei der Registrierung. Bitte versuche es erneut." };
  }

  // Session direkt vorhanden (E-Mail-Bestätigung deaktiviert): ins Dashboard.
  redirect("/dashboard");
}

/**
 * Meldet den Nutzer ab (löscht die Supabase-Session bzw. Auth-Cookies) und
 * leitet zur Anmeldeseite weiter. Als Server-Action direkt in einem <form>
 * im Dashboard verwendbar.
 */
export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

/**
 * Fordert eine Passwort-Zurücksetzen-E-Mail an.
 *
 * Sicherheit: Es wird IMMER eine generische Erfolgsmeldung zurückgegeben -
 * unabhängig davon, ob die E-Mail registriert ist. So lässt sich nicht
 * herausfinden, welche Adressen ein Konto besitzen (kein User-Enumeration).
 */
export async function requestPasswordResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = requestResetSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const successMessage =
    "Falls ein Konto mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen geschickt.";

  if (!hasSupabaseEnv()) {
    return { success: successMessage };
  }

  try {
    const origin = await getRequestOrigin();
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${origin}/auth/confirm?next=/passwort-zuruecksetzen`,
    });
  } catch {
    // Bewusst still: keine Rückmeldung über Existenz/Fehler nach außen.
  }

  return { success: successMessage };
}

/**
 * Setzt ein neues Passwort für den aktuell (per Recovery-Link) eingeloggten
 * Nutzer. Die Session entsteht zuvor durch die Verify-Route (/auth/confirm),
 * die den Token aus der E-Mail einlöst.
 */
export async function updatePasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (!hasSupabaseEnv()) {
    return { error: "Diese Funktion ist derzeit nicht verfügbar. Bitte versuche es später erneut." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        error:
          "Der Link ist abgelaufen oder ungültig. Bitte fordere einen neuen Link an.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    if (error) {
      return { error: "Passwort konnte nicht gespeichert werden. Bitte versuche es erneut." };
    }
  } catch {
    return { error: "Unerwarteter Fehler. Bitte versuche es erneut." };
  }

  redirect("/dashboard");
}
