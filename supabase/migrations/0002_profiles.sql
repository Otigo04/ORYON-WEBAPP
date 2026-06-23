-- Nutzerprofile: zusätzliche Stammdaten zu jedem Auth-Konto.
-- Wird automatisch per Trigger bei der Registrierung angelegt (siehe unten).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  full_name text,
  email text,
  company text
);

-- Row Level Security aktivieren: ohne passende Policy ist kein Zugriff möglich.
alter table public.profiles enable row level security;

-- Nutzer dürfen ausschließlich ihr eigenes Profil lesen.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- Nutzer dürfen ausschließlich ihr eigenes Profil aktualisieren.
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Nutzer dürfen nur ein Profil mit ihrer eigenen ID anlegen.
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = (select auth.uid()));

-- Trigger-Funktion: legt bei jeder neuen Registrierung automatisch ein Profil an.
-- SECURITY DEFINER, damit das Insert serverseitig (unabhängig von RLS) erfolgt.
-- Leeres search_path verhindert Schema-Hijacking; daher voll qualifizierte Namen.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger nach Anlegen eines Auth-Nutzers.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
