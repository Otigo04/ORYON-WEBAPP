# TAS-FLEET – Assets

Hier liegen die Medien für die Produktseite `/leistungen/tas-fleet`.

## Logo
- `logo.svg` – aktuell **Platzhalter**. Einfach durch das finale Logo ersetzen (gleicher Dateiname).

## Screenshots
Lege die echten Screenshots unter `screens/` ab. Solange eine Datei fehlt, zeigt
die Seite automatisch einen stilvollen CSS-Mockup – es bricht also nichts.

Erwartete Dateien (Format **PNG**, idealerweise 16:10, z. B. 1280×800):

| Datei | Modul |
| --- | --- |
| `screens/dashboard.png` | Live-Dashboard (auch im Hero) |
| `screens/disposition.png` | Disposition & Schichtplanung |
| `screens/verwaltung.png` | Fahrer- & Fahrzeugverwaltung |
| `screens/compliance.png` | Compliance-Center |
| `screens/incident.png` | Incident-Log |
| `screens/import.png` | Onboarding / Massenimport |

> Reihenfolge & Zuordnung werden in `src/lib/tas-fleet.ts` (`FLEET_MODULES`) gepflegt.

## Demo-Video
Das Video wird **nicht** hier abgelegt, sondern über YouTube eingebettet.
Trage einfach die Video-ID in `src/lib/tas-fleet.ts` → `FLEET_DEMO_VIDEO_ID` ein
(der Teil hinter `?v=` bzw. `youtu.be/`). Bis dahin zeigt die Demo-Lightbox einen
„in Produktion"-Platzhalter.

## App-Link
Der „Jetzt starten"-Button zeigt auf `FLEET_APP_URL` (`src/lib/tas-fleet.ts`),
aktuell `https://fleet.tas-webworks.de`.
