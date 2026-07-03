-- Diashow / interaktive Galerie für Referenzprojekte.
--
-- Erweitert `showcase_projects` um eine Bild-Liste (`images`) für mehrere
-- Screenshots je Projekt und legt den öffentlichen Storage-Bucket `showcase`
-- an, in den der Admin direkt aus dem Adminportal hochlädt.
--
-- Sicherheitsmodell wie gehabt: öffentlich lesbar, Schreiben/Löschen nur für
-- Admins über public.is_admin(). `image_url` bleibt als Cover-Bild erhalten
-- (Rückwärtskompatibilität); `images` ergänzt weitere Galeriebilder.

-- =====================================================================
-- 1. Galerie-Spalte
-- =====================================================================

alter table public.showcase_projects
  add column if not exists images text[] not null default '{}';

comment on column public.showcase_projects.images is
  'Öffentliche Storage-URLs weiterer Galeriebilder (Diashow). image_url bleibt das Cover.';

-- =====================================================================
-- 2. Öffentlicher Storage-Bucket `showcase`
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'showcase',
  'showcase',
  true,
  10485760, -- 10 MB pro Datei
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- =====================================================================
-- 3. Storage-RLS auf storage.objects (nur Bucket `showcase`)
-- =====================================================================

-- Öffentliches Lesen der Referenzbilder.
drop policy if exists "showcase_read_public" on storage.objects;
create policy "showcase_read_public"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'showcase');

-- Hochladen nur für Admins.
drop policy if exists "showcase_insert_admin" on storage.objects;
create policy "showcase_insert_admin"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'showcase' and public.is_admin());

-- Aktualisieren nur für Admins.
drop policy if exists "showcase_update_admin" on storage.objects;
create policy "showcase_update_admin"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'showcase' and public.is_admin())
  with check (bucket_id = 'showcase' and public.is_admin());

-- Löschen nur für Admins.
drop policy if exists "showcase_delete_admin" on storage.objects;
create policy "showcase_delete_admin"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'showcase' and public.is_admin());
