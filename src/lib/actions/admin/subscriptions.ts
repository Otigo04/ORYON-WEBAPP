"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { getFleetTier } from "@/lib/tas-fleet";

export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const setSchema = z.object({
  user_id: z.string().uuid("Ungültiger Kunde."),
  plan: z.enum(["starter", "professional", "enterprise"]),
  status: z.enum(["incomplete", "trialing", "active", "past_due", "canceled"]),
  billing_interval: z.enum(["monthly", "yearly"]),
  // Leeres Datum erlaubt (= unbefristet bis zur nächsten Änderung).
  current_period_end: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? v : null)),
});

/**
 * Setzt (oder aktualisiert) das Abo eines Kunden manuell, die Admin-Variante
 * zur Freischaltung bzw. zum Testen, solange der Stripe-Checkout (Phase 2) noch
 * nicht live ist.
 *
 * Sicherheit:
 * - `requireAdmin()` als serverseitige Zweitprüfung (defense in depth).
 * - Zod-validiert. Das Flotten-Limit wird serverseitig aus dem Tarif abgeleitet,
 *   nicht vom Client übernommen.
 * - Upsert über die eindeutige `user_id` (ein Abo pro Kunde).
 */
export async function setSubscription(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = setSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Bitte überprüfe die Eingaben.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { user_id, plan, status, billing_interval, current_period_end } = parsed.data;
  const tier = getFleetTier(plan);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id,
        plan,
        status,
        billing_interval,
        current_period_end,
        vehicle_limit: tier?.vehicleLimit ?? null,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      console.error("[setSubscription] upsert failed:", error.message);
      return { ok: false, error: "Abo konnte nicht gespeichert werden." };
    }

    revalidatePath("/admin/abos");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler. Bitte erneut versuchen." };
  }
}

const removeSchema = z.object({ user_id: z.string().uuid() });

/** Entfernt das Abo eines Kunden vollständig (Admin-only). */
export async function removeSubscription(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = removeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "Ungültige Anfrage." };

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("user_id", parsed.data.user_id);

    if (error) {
      console.error("[removeSubscription] delete failed:", error.message);
      return { ok: false, error: "Abo konnte nicht entfernt werden." };
    }

    revalidatePath("/admin/abos");
    return { ok: true };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler. Bitte erneut versuchen." };
  }
}
