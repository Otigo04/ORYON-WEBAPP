"use server";

import { redirect } from "next/navigation";
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

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
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
