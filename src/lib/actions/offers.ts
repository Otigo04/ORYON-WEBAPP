"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const respondSchema = z.object({
  offerId: z.string().uuid("Ungültige Angebots-ID."),
  decision: z.enum(["accepted", "declined"]),
  comment: z.string().max(2000).optional(),
});

export type RespondOfferState = {
  ok: boolean;
  error?: string;
};

/**
 * Kunde nimmt ein Angebot an oder lehnt es ab (mit optionalem Kommentar).
 *
 * Sicherheit:
 * - Eingaben werden serverseitig mit Zod validiert.
 * - Der eigentliche Statuswechsel läuft über die SECURITY-DEFINER-Funktion
 *   `respond_to_offer` in Postgres. Diese prüft selbst, dass das Angebot dem
 *   eingeloggten Nutzer gehört und noch 'sent' ist, und ändert ausschließlich
 *   status/customer_comment/responded_at, Beträge/Positionen sind unantastbar.
 */
export async function respondToOffer(input: unknown): Promise<RespondOfferState> {
  const parsed = respondSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Bitte überprüfe deine Eingabe." };
  }

  const { offerId, decision, comment } = parsed.data;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "Bitte melde dich an." };
    }

    const { error } = await supabase.rpc("respond_to_offer", {
      p_offer_id: offerId,
      p_decision: decision,
      p_comment: comment ?? null,
    });

    if (error) {
      return {
        ok: false,
        error: "Aktion fehlgeschlagen. Das Angebot ist evtl. nicht mehr offen.",
      };
    }

    revalidatePath(`/dashboard/angebote/${offerId}`);
    revalidatePath("/dashboard");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler. Bitte versuche es erneut." };
  }
}
