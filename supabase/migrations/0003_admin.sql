-- Admin-/Superadmin-Erweiterung: Rollen, Projekte mit Live-Fortschritt sowie
-- Dokumente (Rechnungen, Angebote, Konzepte). Folgt dem Sicherheitsmodell der
-- vorherigen Migrationen: RLS ist überall aktiv, Admin-Zugriff läuft über die
-- SECURITY-DEFINER-Funktion `public.is_admin()` (keine RLS-Rekursion).

-- =====================================================================
-- 1. Rolle & Admin-Helfer
-- =====================================================================

-- Rolle am Profil. 'admin' = Superadmin (Agentur-Betreiber).
alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'admin'));

-- Prüft, ob der aktuell eingeloggte Nutzer Admin ist.
-- SECURITY DEFINER + leeres search_path: läuft unabhängig von RLS und kann
-- daher gefahrlos innerhalb von Policies genutzt werden (keine Rekursion).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- Admin darf alle Profile lesen (z. B. um beim Anlegen von Dokumenten den
-- passenden Kunden auszuwählen).
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- =====================================================================
-- 2. Leads: Status & Admin-Antwort
-- =====================================================================

alter table public.leads
  add column if not exists status text not null default 'new'
    check (status in ('new', 'in_progress', 'answered', 'closed'));
alter table public.leads
  add column if not exists admin_note text;

-- Admin sieht und bearbeitet alle Anfragen.
drop policy if exists "leads_admin_all" on public.leads;
create policy "leads_admin_all"
  on public.leads
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- 3. Projekte mit Live-Fortschritt
-- =====================================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Kunde, dem das Projekt gehört. Verweis auf profiles (= auth.users.id),
  -- damit PostgREST den Kundennamen direkt einbetten kann.
  user_id uuid not null references public.profiles (id) on delete cascade,

  title text not null,
  description text,
  status text not null default 'planning'
    check (status in ('planning', 'in_progress', 'review', 'done', 'paused')),
  progress int not null default 0 check (progress between 0 and 100)
);

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists projects_created_at_idx on public.projects (created_at desc);

alter table public.projects enable row level security;

-- Kunde sieht ausschließlich seine eigenen Projekte.
create policy "projects_select_own"
  on public.projects
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Admin hat vollen Zugriff (anlegen, ändern, löschen).
create policy "projects_admin_all"
  on public.projects
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Live-Timeline: einzelne Fortschritts-Einträge zu einem Projekt.
create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  project_id uuid not null references public.projects (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,

  title text not null,
  body text
);

create index if not exists project_updates_project_id_idx
  on public.project_updates (project_id, created_at desc);

alter table public.project_updates enable row level security;

-- Kunde sieht Updates zu seinen eigenen Projekten.
create policy "project_updates_select_own"
  on public.project_updates
  for select
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and p.user_id = (select auth.uid())
    )
  );

-- Admin hat vollen Zugriff.
create policy "project_updates_admin_all"
  on public.project_updates
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Hält projects.updated_at aktuell.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 4. Dokumente: Rechnungen, Angebote, Konzepte
-- =====================================================================

-- Rechnungen
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,

  number text not null,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'cancelled')),
  issue_date date not null default current_date,
  due_date date,

  -- Positionen: [{ description, quantity, unit_price }]
  items jsonb not null default '[]'::jsonb,
  tax_rate numeric not null default 19,
  currency text not null default 'EUR',
  notes text
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);

alter table public.invoices enable row level security;

-- Kunde sieht eigene Rechnungen, aber keine Entwürfe.
create policy "invoices_select_own"
  on public.invoices
  for select
  to authenticated
  using (user_id = (select auth.uid()) and status <> 'draft');

create policy "invoices_admin_all"
  on public.invoices
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists invoices_touch_updated_at on public.invoices;
create trigger invoices_touch_updated_at
  before update on public.invoices
  for each row execute function public.touch_updated_at();

-- Angebote
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,

  number text not null,
  title text not null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  valid_until date,

  items jsonb not null default '[]'::jsonb,
  tax_rate numeric not null default 19,
  currency text not null default 'EUR',
  content text
);

create index if not exists offers_user_id_idx on public.offers (user_id);

alter table public.offers enable row level security;

create policy "offers_select_own"
  on public.offers
  for select
  to authenticated
  using (user_id = (select auth.uid()) and status <> 'draft');

create policy "offers_admin_all"
  on public.offers
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists offers_touch_updated_at on public.offers;
create trigger offers_touch_updated_at
  before update on public.offers
  for each row execute function public.touch_updated_at();

-- Konzepte
create table if not exists public.concepts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,

  title text not null,
  content text,
  status text not null default 'draft'
    check (status in ('draft', 'shared'))
);

create index if not exists concepts_user_id_idx on public.concepts (user_id);

alter table public.concepts enable row level security;

-- Kunde sieht nur geteilte Konzepte.
create policy "concepts_select_own"
  on public.concepts
  for select
  to authenticated
  using (user_id = (select auth.uid()) and status = 'shared');

create policy "concepts_admin_all"
  on public.concepts
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists concepts_touch_updated_at on public.concepts;
create trigger concepts_touch_updated_at
  before update on public.concepts
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 5. Realtime aktivieren (für Live-Updates im Kunden-Dashboard)
-- =====================================================================
-- Fügt die Tabellen zur Realtime-Publication hinzu. `do`-Block schluckt den
-- Fehler, falls eine Tabelle bereits Teil der Publication ist.
do $$
begin
  alter publication supabase_realtime add table public.projects;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.project_updates;
exception when duplicate_object then null;
end $$;
