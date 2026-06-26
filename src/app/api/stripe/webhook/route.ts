import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe-Webhook.
 *
 * Bewusste Ausnahme vom „keine API-Routen"-Grundsatz: Stripe benötigt einen
 * Endpoint mit unverändertem Raw-Body zur Signaturprüfung. Erst nach erfolg-
 * reicher Verifikation werden Zahlungen verbucht – über den Service-Role-Client
 * (umgeht RLS), da hier kein Nutzer-Cookie vorliegt.
 *
 * Einrichtung: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET und
 * SUPABASE_SERVICE_ROLE_KEY setzen; Endpoint-URL in Stripe hinterlegen.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe nicht konfiguriert." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signatur fehlt." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] Signaturprüfung fehlgeschlagen:", err);
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    console.error("[stripe webhook] SUPABASE_SERVICE_ROLE_KEY fehlt – kann nicht verbuchen.");
    return NextResponse.json({ error: "Server nicht konfiguriert." }, { status: 503 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const kind = session.metadata?.kind;
        const documentId = session.metadata?.document_id;
        if (!documentId) break;

        if (kind === "invoice") {
          await admin
            .from("invoices")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              stripe_session_id: session.id,
            })
            .eq("id", documentId);
        } else if (kind === "offer_deposit") {
          await admin
            .from("offers")
            .update({
              deposit_paid_at: new Date().toISOString(),
              stripe_session_id: session.id,
            })
            .eq("id", documentId);
        }
        break;
      }

      // Abo-Lebenszyklus (TAS-Fleet). Aktualisiert vorhandene subscriptions-Zeilen
      // anhand der Stripe-IDs; legt selbst keine neue Zeile an.
      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const periodEnd = (sub as unknown as { current_period_end?: number })
          .current_period_end;
        await admin
          .from("subscriptions")
          .update({
            status: sub.status,
            current_period_end: periodEnd
              ? new Date(periodEnd * 1000).toISOString()
              : null,
            stripe_price_id: sub.items.data[0]?.price.id ?? null,
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      default:
        // Unbehandelte Events bewusst ignorieren.
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] Verarbeitung fehlgeschlagen:", err);
    return NextResponse.json({ error: "Verarbeitungsfehler." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
