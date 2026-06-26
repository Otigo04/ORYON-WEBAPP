"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { siteConfig } from "@/lib/site";
import { computeTotals, type LineItem } from "@/lib/documents";
import { DEPOSIT_RATE } from "@/lib/payment";

export type CheckoutState = {
  ok: boolean;
  url?: string;
  error?: string;
};

type CheckoutInput =
  | { kind: "invoice"; id: string }
  | { kind: "offer_deposit"; id: string };

async function getRequestOrigin() {
  const hdrs = await headers();
  const host = hdrs.get("host");
  if (!host) return siteConfig.url;
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/**
 * Erstellt eine Stripe-Checkout-Session für eine Rechnung oder eine Angebots-
 * Anzahlung und gibt die Weiterleitungs-URL zurück.
 *
 * Sicherheit:
 * - Der Betrag wird IMMER serverseitig aus dem Dokument berechnet, nie vom
 *   Client übernommen.
 * - Das Dokument wird über den RLS-gebundenen Client geladen – ein Nutzer kann
 *   also nur für eigene Dokumente bezahlen.
 * - Die Dokument-ID landet in den Session-Metadaten; der Webhook verbucht erst
 *   nach Stripe-bestätigter Zahlung.
 */
export async function createCheckoutSession(
  input: CheckoutInput,
): Promise<CheckoutState> {
  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, error: "Online-Zahlung ist derzeit nicht verfügbar." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Bitte zuerst anmelden." };

    const table = input.kind === "invoice" ? "invoices" : "offers";
    const { data: doc, error } = await supabase
      .from(table)
      .select("id, number, title, items, tax_rate, currency, user_id")
      .eq("id", input.id)
      .maybeSingle();

    if (error || !doc) return { ok: false, error: "Dokument nicht gefunden." };

    const gross = computeTotals(doc.items as LineItem[], doc.tax_rate).gross;
    const amount =
      input.kind === "offer_deposit"
        ? Math.round(gross * DEPOSIT_RATE * 100) / 100
        : gross;

    if (amount <= 0) return { ok: false, error: "Kein offener Betrag." };

    const origin = await getRequestOrigin();
    const path = input.kind === "invoice" ? "rechnungen" : "angebote";
    const label =
      input.kind === "invoice"
        ? `Rechnung ${doc.number}`
        : `Anzahlung Angebot ${doc.number}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: (doc.currency as string).toLowerCase(),
            unit_amount: Math.round(amount * 100),
            product_data: { name: `${label} – ${doc.title}` },
          },
        },
      ],
      metadata: {
        kind: input.kind,
        document_id: doc.id,
        user_id: user.id,
      },
      success_url: `${origin}/dashboard/${path}/${doc.id}?paid=1`,
      cancel_url: `${origin}/dashboard/${path}/${doc.id}`,
    });

    if (!session.url) return { ok: false, error: "Checkout konnte nicht gestartet werden." };
    return { ok: true, url: session.url };
  } catch (err) {
    console.error("[createCheckoutSession]", err);
    return { ok: false, error: "Unerwarteter Fehler beim Start der Zahlung." };
  }
}
