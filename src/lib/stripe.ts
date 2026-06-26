import Stripe from "stripe";

/**
 * Lazy initialisierter Stripe-Client (serverseitig).
 *
 * Gibt `null` zurück, wenn kein `STRIPE_SECRET_KEY` gesetzt ist – so bleibt die
 * App ohne Stripe-Konfiguration lauffähig (Online-Zahlung einfach deaktiviert).
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) {
    // Ohne explizite apiVersion nutzt der SDK die im Paket gepinnte Version.
    cached = new Stripe(key);
  }
  return cached;
}
