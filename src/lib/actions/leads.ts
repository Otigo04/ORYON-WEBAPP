"use server";

import { createClient } from "@/lib/supabase/server";
import { calculatePrice, quoteLeadSchema } from "@/lib/pricing";

export type SaveQuoteState = {
  ok: boolean;
  /** Allgemeine Fehlermeldung (für eine Status-Box im Formular). */
  error?: string;
  /** Feld-spezifische Fehler aus der Zod-Validierung. */
  fieldErrors?: Record<string, string[]>;
  /** True, wenn keine Supabase-Konfiguration vorhanden ist (Demo-Modus). */
  demo?: boolean;
};

/**
 * Speichert eine Preisrechner-Anfrage als Lead in Supabase.
 *
 * Sicherheit:
 * - Alle Eingaben werden serverseitig erneut mit Zod validiert (Client-Validierung
 *   ist nur Komfort, nie Vertrauensbasis).
 * - Der Preis wird hier neu berechnet – manipulierte Client-Werte sind wirkungslos.
 * - `user_id` wird aus der serverseitigen Session abgeleitet (nicht vom Client),
 *   sodass die zeilenbasierte Sicherheit (RLS) Leads korrekt dem Nutzer zuordnet.
 *   Anonyme Anfragen (ohne Login) sind erlaubt (`user_id` = null).
 */
export async function saveQuoteLead(input: unknown): Promise<SaveQuoteState> {
  const parsed = quoteLeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Bitte überprüfe deine Eingaben.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const price = calculatePrice(data);

  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Ohne Konfiguration: nicht hart scheitern, damit die UI lokal testbar bleibt.
  if (!hasSupabaseEnv) {
    return { ok: true, demo: true };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("leads").insert({
      user_id: user?.id ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      message: data.message || null,
      project_type: data.projectType,
      design: data.design,
      features: data.features,
      extra_languages: data.extraLanguages,
      maintenance: data.maintenance,
      price_min: price.oneTimeMin,
      price_max: price.oneTimeMax,
      monthly_min: price.monthlyMin,
      monthly_max: price.monthlyMax,
    });

    if (error) {
      return {
        ok: false,
        error: "Anfrage konnte nicht gespeichert werden. Bitte versuche es erneut.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Unerwarteter Fehler. Bitte versuche es später erneut.",
    };
  }
}
