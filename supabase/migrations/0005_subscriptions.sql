-- TAS-FLEET-Abonnements: hält pro Kunde fest, welcher Tarif gebucht ist und ob
-- er aktiv ist. Quelle der Wahrheit für den Produktzugang zu TAS-FLEET.
--
-- Sicherheitsmodell (analog zu 0002–0004):
--  * RLS ist aktiv. Der Kunde darf sein eigenes Abo NUR LESEN.
--  * Schreiben (Status auf 'active' setzen) erfolgt ausschließlich serverseitig –
--    entweder durch den Stripe-Webhook (Service-Role, umgeht RLS) oder durch
--    einen Admin (Policy via public.is_admin()). So kann sich niemand selbst
--    freischalten.

-- =====================================================================
-- 1. Profil-Erweiterung: Telefon (für die Profileinstellungen)
-- =====================================================================
alter table public.profiles
  add column if not exists phone text;

-- =====================================================================
-- 2. Abonnements
-- =====================================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Genau ein Abo pro Nutzer (unique). Verweis auf profiles (= auth.users.id).
  user_id uuid not null unique references public.profiles (id) on delete cascade,

  -- Gebuchter Tarif.
  plan text not null
    check (plan in ('starter', 'professional', 'enterprise')),

  -- Lebenszyklus des Abos (an Stripe-Status angelehnt).
  status text not null default 'incomplete'
    check (status in ('incomplete', 'trialing', 'active', 'past_due', 'canceled')),

  -- Abrechnungsintervall.
  billing_interval text not null default 'monthly'
    check (billing_interval in ('monthly', 'yearly')),

  -- Laufende Periode: Ende = Verlängerungs- bzw. Ablaufdatum.
  current_period_start timestamptz,
  current_period_end timestamptz,
  -- True, wenn das Abo zum Periodenende endet (gekündigt, läuft aber noch).
  cancel_at_period_end boolean not null default false,

  -- Durchsetzbares Flotten-Limit (NULL = unbegrenzt, z. B. Enterprise).
  vehicle_limit int,

  -- Stripe-Verknüpfung (in Phase 2 vom Webhook gefüllt).
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

alter table public.subscriptions enable row level security;

-- Kunde sieht ausschließlich sein eigenes Abo (nur lesen).
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Admin hat vollen Zugriff (anlegen/ändern – z. B. manuelle Freischaltung).
drop policy if exists "subscriptions_admin_all" on public.subscriptions;
create policy "subscriptions_admin_all"
  on public.subscriptions
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Bewusst KEINE insert/update-Policy für normale Nutzer: Schreibzugriff läuft
-- nur über Admin (oben) oder die Service-Role des Stripe-Webhooks (umgeht RLS).

-- Hält updated_at aktuell (Funktion stammt aus Migration 0003).
drop trigger if exists subscriptions_touch_updated_at on public.subscriptions;
create trigger subscriptions_touch_updated_at
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- Realtime, damit das Kundenportal eine Freischaltung sofort anzeigt.
do $$
begin
  alter publication supabase_realtime add table public.subscriptions;
exception when duplicate_object then null;
end $$;
