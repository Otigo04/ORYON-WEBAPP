-- Erweiterung: Kunden-Reaktion auf Angebote (annehmen/ablehnen + Kommentar)
-- sowie der detaillierte Projekt-Konfigurator (briefs) inkl. geräteübergreifendem
-- Entwurf (brief_drafts). Folgt dem bestehenden Sicherheitsmodell: RLS überall an,
-- Admin-Zugriff via public.is_admin(), heikle Statuswechsel über eine
-- SECURITY-DEFINER-Funktion (spaltensicher).

-- =====================================================================
-- 1. Angebote: Kunden-Antwort
-- =====================================================================

alter table public.offers
  add column if not exists customer_comment text;
alter table public.offers
  add column if not exists responded_at timestamptz;

-- Kunde nimmt ein Angebot an oder lehnt es ab – inkl. optionalem Kommentar.
--
-- Sicherheit: SECURITY DEFINER statt einer breiten UPDATE-Policy. Eine UPDATE-
-- Policy könnte Spalten nicht einschränken; ein Kunde könnte so z. B. Positionen
-- oder Beträge manipulieren. Diese Funktion ändert ausschließlich
-- status/customer_comment/responded_at und nur, wenn das Angebot dem Aufrufer
-- gehört und aktuell 'sent' ist.
create or replace function public.respond_to_offer(
  p_offer_id uuid,
  p_decision text,
  p_comment text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_decision not in ('accepted', 'declined') then
    raise exception 'Ungültige Entscheidung: %', p_decision;
  end if;

  update public.offers
     set status = p_decision,
         customer_comment = nullif(btrim(coalesce(p_comment, '')), ''),
         responded_at = now()
   where id = p_offer_id
     and user_id = (select auth.uid())
     and status = 'sent';

  if not found then
    raise exception 'Angebot nicht gefunden oder nicht mehr offen.';
  end if;
end;
$$;

grant execute on function public.respond_to_offer(uuid, text, text) to authenticated;

-- =====================================================================
-- 2. Detaillierte Projekt-Konfiguration (Brief / Anfrage)
-- =====================================================================

create table if not exists public.briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Optionaler Bezug zum eingeloggten Nutzer (null bei anonymer Anfrage).
  user_id uuid references auth.users (id) on delete set null,
  -- Optionaler Bezug zu einem Preisrechner-Lead, aus dem heraus konfiguriert wurde.
  lead_id uuid references public.leads (id) on delete set null,

  -- Kontaktdaten
  name text not null,
  email text not null,
  phone text,
  company text,

  -- Vollständige, strukturierte Antworten des Konfigurators (alle Schritte).
  data jsonb not null default '{}'::jsonb,

  -- Schnellüberblick fürs Admin-Panel (Kopie aus dem Preisrechner).
  project_type text,
  price_min int,
  price_max int,

  status text not null default 'new'
    check (status in ('new', 'in_progress', 'answered', 'closed')),
  admin_note text
);

create index if not exists briefs_user_id_idx on public.briefs (user_id);
create index if not exists briefs_created_at_idx on public.briefs (created_at desc);

alter table public.briefs enable row level security;

-- Jeder (anonym oder eingeloggt) darf eine Konfiguration absenden.
drop policy if exists "briefs_insert_anyone" on public.briefs;
create policy "briefs_insert_anyone"
  on public.briefs
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

-- Eingeloggte Nutzer sehen ausschließlich ihre eigenen Konfigurationen.
drop policy if exists "briefs_select_own" on public.briefs;
create policy "briefs_select_own"
  on public.briefs
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Admin sieht und bearbeitet alle Konfigurationen.
drop policy if exists "briefs_admin_all" on public.briefs;
create policy "briefs_admin_all"
  on public.briefs
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- 3. Konfigurator-Entwurf (geräteübergreifend, je eingeloggtem Nutzer einer)
-- =====================================================================

create table if not exists public.brief_drafts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now(),
  data jsonb not null default '{}'::jsonb
);

alter table public.brief_drafts enable row level security;

-- Nutzer verwaltet ausschließlich seinen eigenen Entwurf.
drop policy if exists "brief_drafts_own" on public.brief_drafts;
create policy "brief_drafts_own"
  on public.brief_drafts
  for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
