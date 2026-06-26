-- Öffentliche Aushängeschilder: echte Referenzprojekte und Kundenbewertungen.
-- Bisher fragte `src/lib/portfolio.ts` die Kunden-Tracking-Tabelle `projects`
-- ab (falsche Spalten + RLS nur für Eigentümer/Admin) und `testimonials`
-- existierte gar nicht – beide fielen daher immer auf Dummy-Daten zurück.
--
-- Sicherheitsmodell wie in den vorherigen Migrationen: RLS überall aktiv,
-- öffentlich lesbar sind ausschließlich freigegebene (`published = true`)
-- Einträge; Schreibzugriff nur für Admins über `public.is_admin()`.

-- =====================================================================
-- 1. Referenzprojekte (Portfolio-Grid auf der Landingpage)
-- =====================================================================

create table if not exists public.showcase_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  title text not null,
  category text not null,
  description text not null,
  -- Optionaler Bild-URL (z. B. aus dem Storage-Bucket `showcase`).
  -- Ist keiner gesetzt, rendert die UI einen Verlauf als Fallback.
  image_url text,

  -- Optionaler Link zum Live-Projekt.
  project_url text,

  -- Steuert Reihenfolge und Sichtbarkeit im Grid.
  sort_order int not null default 0,
  published boolean not null default false
);

create index if not exists showcase_projects_sort_idx
  on public.showcase_projects (published, sort_order, created_at desc);

alter table public.showcase_projects enable row level security;

-- Öffentliches Lesen – aber nur freigegebene Einträge.
drop policy if exists "showcase_projects_select_public" on public.showcase_projects;
create policy "showcase_projects_select_public"
  on public.showcase_projects
  for select
  to anon, authenticated
  using (published = true);

-- Admin hat vollen Zugriff (anlegen, ändern, löschen – inkl. Entwürfe).
drop policy if exists "showcase_projects_admin_all" on public.showcase_projects;
create policy "showcase_projects_admin_all"
  on public.showcase_projects
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists showcase_projects_touch_updated_at on public.showcase_projects;
create trigger showcase_projects_touch_updated_at
  before update on public.showcase_projects
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- 2. Kundenbewertungen (Testimonials)
-- =====================================================================

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  author text not null,
  role text not null,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),

  sort_order int not null default 0,
  published boolean not null default false
);

create index if not exists testimonials_sort_idx
  on public.testimonials (published, sort_order, created_at desc);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials_select_public" on public.testimonials;
create policy "testimonials_select_public"
  on public.testimonials
  for select
  to anon, authenticated
  using (published = true);

drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all"
  on public.testimonials
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists testimonials_touch_updated_at on public.testimonials;
create trigger testimonials_touch_updated_at
  before update on public.testimonials
  for each row execute function public.touch_updated_at();
