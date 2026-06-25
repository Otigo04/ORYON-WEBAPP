# TAS-FLEET – Abo, Stripe & Sync zu TAS-FLEET

Dieser Plan beschreibt das Abo-System und was in **Phase 2** (echte Stripe-Anbindung
+ Übernahme des Nutzers in die TAS-FLEET-Datenbank) noch zu tun ist. **Phase 1**
(Datenmodell, Profil-/Abo-Seite, manuelle Admin-Freischaltung) ist bereits gebaut.

## Status quo (Phase 1 – erledigt)

- **DB:** `supabase/migrations/0005_subscriptions.sql` – Tabelle `subscriptions`
  (ein Abo pro Nutzer). RLS: Kunde **liest nur** sein eigenes Abo; **Schreiben**
  nur per Admin (`is_admin()`) oder Service-Role.
- **Kundenportal:** `/dashboard/einstellungen` – Profil bearbeiten + Abo-Status.
- **Admin:** `/admin/abos` – Abos einsehen und manuell setzen (Fallback & Tests).
- **Preise:** zentral in `pricing.config.ts` → Block `tasFleet`.
- **Zugangslogik:** `isSubscriptionUsable()` in `src/lib/subscription.ts` – genau
  diese Regel soll TAS-FLEET später spiegeln.

## Phase 2 – Stripe-Checkout (Self-Service)

1. **Paket & Konfig:** `npm i stripe`. Keys aus `.env.local` (siehe
   `.env.local.example`): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, sowie die
   sechs `STRIPE_PRICE_*`-IDs (Tarif × Intervall).
2. **Checkout-Server-Action** (`src/lib/actions/checkout.ts`): nimmt `plan` +
   `interval`, ermittelt die passende Stripe-Price-ID, erstellt eine
   `checkout.session` (`mode: "subscription"`) mit `client_reference_id = user.id`
   und leitet auf die Stripe-Checkout-URL um. Die Buttons auf
   `/leistungen/tas-fleet` (Komponente `FleetPricing`) rufen diese Action statt
   des externen Links auf.
3. **Webhook-Route** (`src/app/api/stripe/webhook/route.ts`): **bewusste Ausnahme**
   von der „keine `/api/*`"-Regel – Stripe-Webhooks brauchen einen HTTP-Endpoint.
   Signatur mit `STRIPE_WEBHOOK_SECRET` prüfen. Relevante Events:
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.
   - Mit der **Service-Role** (umgeht RLS) das Abo in `subscriptions` upserten
     (Status, Periode, `stripe_*`-IDs, `vehicle_limit` aus dem Tarif).
   - Anschließend das **User-Provisioning** auslösen (siehe unten).

## Phase 2 – Übernahme des Nutzers in die TAS-FLEET-DB

TAS-FLEET ist ein **getrenntes Supabase-Projekt**. Damit sich der Kunde mit
denselben Daten dort einloggen kann, wird er nach erfolgreichem Kauf via
**Push** angelegt (kein Live-Pull):

1. Zweiter Supabase-Client mit `TAS_FLEET_SUPABASE_URL` +
   `TAS_FLEET_SERVICE_ROLE_KEY` (nur serverseitig, `src/lib/fleet/admin-client.ts`).
2. Auth-User in TAS-FLEET anlegen, falls noch nicht vorhanden:
   `admin.createUser({ email, email_confirm: true })`. Da Passwörter gehasht sind,
   **nicht** kopieren – stattdessen `inviteUserByEmail` / Magic-Link, damit der
   Kunde sein TAS-FLEET-Passwort setzt. (Alternative für „identisches Passwort":
   den Nutzer schon bei der Registrierung in beiden Projekten anlegen – erfordert
   Passwort-Sync bei jedem Reset und ist deshalb nachrangig.)
3. Tarif + Limit + `current_period_end` in der TAS-FLEET-DB hinterlegen, damit
   TAS-FLEET den Produktzugang lokal freigibt.

## Phase 2 – Verify-API (optionaler Fallback)

Falls TAS-FLEET den Status zusätzlich live prüfen soll:
`GET /api/fleet/subscription?email=...` mit `Authorization: Bearer
$FLEET_VERIFY_API_TOKEN`. Antwortet mit `{ active, plan, vehicle_limit,
period_end }` (ermittelt per Service-Role + `isSubscriptionUsable`-Logik).

## Sicherheits-Checkliste

- Service-Role-Keys **niemals** an den Client geben (kein `NEXT_PUBLIC_`).
- Webhook **immer** über die Stripe-Signatur verifizieren.
- Abo-Schreibzugriff bleibt server-only; Kunden behalten ausschließlich Leserecht.
- Verify-API nur mit gültigem Token; keine personenbezogenen Daten in Query-Logs.
