-- Rechnungsanschrift für TAS-FLEET-Bestellungen (Überweisungs-Flow).
--
-- Wenn ein eingeloggter Kunde einen TAS-FLEET-Tarif bucht, gibt er seine
-- Firmen-/Rechnungsdaten ein. Diese liegen am Profil, damit sie für die
-- Rechnung (DocumentView) und spätere Bestellungen wiederverwendbar sind.
--
-- Die eigentliche Rechnung + das (noch inaktive) Abo werden serverseitig über
-- den Service-Role-Key angelegt (umgeht RLS) – der Kunde selbst darf weiterhin
-- weder `invoices` noch `subscriptions` schreiben.

alter table public.profiles
  add column if not exists street text,
  add column if not exists postal_code text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists vat_id text;
