-- Preisrechner-Leads: Anfragen aus dem öffentlichen Preisrechner.
-- Enthält Kontaktdaten, gewählte Optionen und die berechnete Preisspanne.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Optionaler Bezug zum eingeloggten Nutzer (null bei anonymer Anfrage).
  user_id uuid references auth.users (id) on delete set null,

  -- Kontaktdaten
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,

  -- Gewählte Optionen
  project_type text not null,
  design text not null,
  features text[] not null default '{}',
  extra_languages int not null default 0,
  maintenance boolean not null default false,

  -- Serverseitig berechnete Preisspanne (in Euro)
  price_min int not null,
  price_max int not null,
  monthly_min int not null default 0,
  monthly_max int not null default 0
);

create index if not exists leads_user_id_idx on public.leads (user_id);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Row Level Security aktivieren: ohne passende Policy ist kein Zugriff möglich.
alter table public.leads enable row level security;

-- Jeder (anonym oder eingeloggt) darf eine Anfrage absenden.
-- Eingeloggte Nutzer dürfen einen Lead nur sich selbst (oder niemandem) zuordnen.
create policy "leads_insert_anyone"
  on public.leads
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

-- Eingeloggte Nutzer sehen ausschließlich ihre eigenen Leads.
create policy "leads_select_own"
  on public.leads
  for select
  to authenticated
  using (user_id = (select auth.uid()));
