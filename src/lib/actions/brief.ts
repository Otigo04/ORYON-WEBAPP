"use server";

import { createClient } from "@/lib/supabase/server";
import { briefSubmitSchema } from "@/lib/brief";

export type SaveBriefState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  /** True, wenn keine Supabase-Konfiguration vorhanden ist (Demo-Modus). */
  demo?: boolean;
};

/**
 * Speichert eine detaillierte Projekt-Konfiguration als `brief` in Supabase.
 *
 * Sicherheit:
 * - Vollständige serverseitige Zod-Validierung (Client-Validierung ist nur
 *   Komfort).
 * - `user_id` wird aus der Session abgeleitet, nicht vom Client – RLS ordnet die
 *   Anfrage korrekt zu. Anonyme Anfragen (ohne Login) sind erlaubt.
 * - Räumt nach erfolgreichem Absenden den geräteübergreifenden Entwurf des
 *   Nutzers auf (brief_drafts).
 */
export async function saveBrief(input: unknown): Promise<SaveBriefState> {
  const parsed = briefSubmitSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Bitte überprüfe deine Eingaben.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { contact, data, summary } = parsed.data;

  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!hasSupabaseEnv) {
    return { ok: true, demo: true };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("briefs").insert({
      user_id: user?.id ?? null,
      name: contact.name,
      email: contact.email,
      phone: contact.phone || null,
      company: contact.company || null,
      data: { ...data, _summary: summary },
      project_type: summary.projectType ?? null,
      price_min: summary.priceMin ?? null,
      price_max: summary.priceMax ?? null,
    });

    if (error) {
      // Häufigste Ursache hier: Migration 0004 (Tabelle `briefs`) ist noch nicht
      // auf die Supabase-Datenbank angewendet. Den echten Fehler serverseitig
      // loggen, damit das schnell auffällt.
      console.error("[saveBrief] insert failed:", error.message, error.details ?? "");
      return {
        ok: false,
        error: "Konfiguration konnte nicht gespeichert werden. Bitte versuche es erneut.",
      };
    }

    // Entwurf aufräumen (nur eingeloggt relevant; Fehler ignorieren).
    if (user) {
      await supabase.from("brief_drafts").delete().eq("user_id", user.id);
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler. Bitte versuche es später erneut." };
  }
}
