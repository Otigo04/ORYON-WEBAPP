"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { suggestDocumentNumber } from "@/lib/documents";
import {
  fleetInvoiceAmount,
  getFleetTier,
  type FleetInterval,
} from "@/lib/tas-fleet";

export type FleetOrderState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const schema = z.object({
  plan: z.enum(["starter", "professional", "enterprise"]),
  interval: z.enum(["monthly", "yearly"]),
  company: z.string().trim().min(2, "Firmenname fehlt.").max(160),
  contact_name: z.string().trim().min(2, "Ansprechpartner fehlt.").max(120),
  street: z.string().trim().min(2, "Straße & Hausnummer fehlen.").max(160),
  postal_code: z.string().trim().min(3, "PLZ fehlt.").max(20),
  city: z.string().trim().min(2, "Ort fehlt.").max(120),
  country: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => v || "Deutschland"),
  vat_id: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => v || null),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => v || null),
});

/**
 * TAS-FLEET-Bestellung eines eingeloggten Kunden.
 *
 * Speichert die Rechnungsanschrift am Profil und legt – über den Service-Role-Key
 * (umgeht RLS, da Kunden weder `invoices` noch `subscriptions` schreiben dürfen) –
 * eine offene Rechnung (Status „sent") sowie ein noch inaktives Abo (Status
 * „incomplete") an. Die `user_id` wird serverseitig aus der Session gesetzt, nie
 * aus dem Formular. Nach erfolgreicher Anlage Weiterleitung zur Rechnung.
 */
export async function createFleetOrder(
  _prev: FleetOrderState,
  formData: FormData,
): Promise<FleetOrderState> {
  const parsed = schema.safeParse({
    plan: formData.get("plan"),
    interval: formData.get("interval"),
    company: formData.get("company"),
    contact_name: formData.get("contact_name"),
    street: formData.get("street"),
    postal_code: formData.get("postal_code"),
    city: formData.get("city"),
    country: formData.get("country") ?? undefined,
    vat_id: formData.get("vat_id") ?? undefined,
    phone: formData.get("phone") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const tier = getFleetTier(data.plan);
  if (!tier) return { ok: false, error: "Unbekannter Tarif." };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Rechnungsanschrift am eigenen Profil ablegen (RLS: eigener Datensatz).
    await supabase
      .from("profiles")
      .update({
        full_name: data.contact_name,
        company: data.company,
        phone: data.phone,
        street: data.street,
        postal_code: data.postal_code,
        city: data.city,
        country: data.country,
        vat_id: data.vat_id,
      })
      .eq("id", user.id);

    const admin = createAdminClient();
    if (!admin) {
      return {
        ok: false,
        error:
          "Zahlungs-Backend ist nicht konfiguriert (SUPABASE_SERVICE_ROLE_KEY fehlt). Bitte kontaktiere uns direkt.",
      };
    }

    const amount = fleetInvoiceAmount(data.plan, data.interval);
    const number = suggestDocumentNumber("RE");
    const periodLabel =
      data.interval === "yearly" ? "Jahreslizenz (12 Monate)" : "Monatslizenz";
    const due = new Date();
    due.setDate(due.getDate() + 7);
    const dueDate = due.toISOString().slice(0, 10);

    const { data: inserted, error: invoiceError } = await admin
      .from("invoices")
      .insert({
        user_id: user.id,
        number,
        title: `TAS-FLEET ${tier.name}`,
        status: "sent",
        due_date: dueDate,
        items: [
          {
            description: `TAS-FLEET ${tier.name} – ${periodLabel}`,
            quantity: 1,
            unit_price: amount,
          },
        ],
        tax_rate: 0, // Kleinunternehmer § 19 UStG: keine MwSt.
        currency: "EUR",
        notes:
          "Vielen Dank für Ihre Bestellung. Bitte überweisen Sie den Gesamtbetrag " +
          "innerhalb von 7 Tagen auf das unten genannte Konto. Nach Zahlungseingang " +
          "richten wir Ihren Zugang innerhalb von 12 Stunden ein und senden Ihnen die " +
          "Zugangsdaten per E-Mail.",
      })
      .select("id")
      .single();

    if (invoiceError || !inserted) {
      return { ok: false, error: "Rechnung konnte nicht erstellt werden." };
    }
    const invoiceId = inserted.id as string;

    // Noch inaktives Abo anlegen/aktualisieren – der Admin schaltet es nach
    // Zahlungseingang manuell auf „active".
    const { error: subError } = await admin.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan: data.plan,
        status: "incomplete",
        billing_interval: data.interval,
        vehicle_limit: tier.vehicleLimit,
      },
      { onConflict: "user_id" },
    );
    if (subError) {
      return { ok: false, error: "Abo konnte nicht vorgemerkt werden." };
    }

    redirect(`/dashboard/rechnungen/${invoiceId}`);
  } catch (err) {
    // redirect() wirft intern (NEXT_REDIRECT) – nicht abfangen, weiterreichen.
    if (err && typeof err === "object" && "digest" in err) throw err;
    return { ok: false, error: "Unerwarteter Fehler bei der Bestellung." };
  }
}
