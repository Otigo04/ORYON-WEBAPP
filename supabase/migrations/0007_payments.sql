-- Zahlungs-Tracking für Stripe-Checkout.
--
-- Ergänzt Rechnungen und Angebote um die Felder, die der Stripe-Webhook
-- nach erfolgreicher Zahlung schreibt. `stripe_session_id` dient zugleich der
-- Idempotenz (ein Checkout-Event wird nur einmal verarbeitet).
--
-- Geschrieben wird ausschließlich durch den Webhook über den Service-Role-Key
-- (umgeht RLS). Kunden lesen die Felder über ihre bestehenden SELECT-Policies.

-- Rechnungen: Zeitpunkt der Online-Zahlung + Session-ID.
alter table public.invoices
  add column if not exists paid_at timestamptz,
  add column if not exists stripe_session_id text;

-- Angebote: Anzahlung online bezahlt + Session-ID.
alter table public.offers
  add column if not exists deposit_paid_at timestamptz,
  add column if not exists stripe_session_id text;
