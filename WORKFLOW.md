# TAS Webworks – Ablauf von der Anfrage bis zur Übergabe

Dieses Dokument erklärt, wie ein Kundenprojekt durch die App läuft – welche
Bausteine es gibt (Anfrage, Konfiguration, Angebot, Konzept, Projekt, Rechnung),
was die einzelnen **Status** bedeuten und wer was sieht.

---

## Die Beteiligten

| Rolle | Wo | Was sie tun |
|------|----|-------------|
| **Besucher** | Öffentliche Seite | Preis berechnen, Konfigurator ausfüllen, anfragen |
| **Kunde** | `/dashboard` (eingeloggt) | Angebote annehmen, Konzepte ansehen, anzahlen, Projektfortschritt verfolgen, Rechnungen bezahlen |
| **Du / Admin** | `/admin` | Anfragen sichten, Angebote/Konzepte/Rechnungen erstellen, Projekt pflegen |

Die Trennung ist über Supabase **Row Level Security (RLS)** abgesichert: Ein Kunde
sieht ausschließlich seine eigenen Daten und **keine Entwürfe** (siehe unten).

---

## Der Ablauf in 7 Phasen

```
1. Anfrage        Besucher → Preisrechner / Konfigurator      → Lead / Brief
2. Sichten        Du im Admin                                  → Anfrage/Konfiguration prüfen
3. Angebot        Du erstellst ein Angebot                     → Offer (Entwurf → versendet)
4. Annahme        Kunde nimmt an + zahlt Anzahlung             → Offer (angenommen)
5. Konzept        Du teilst ein Konzept (optional)             → Concept (Entwurf → geteilt)
6. Umsetzung      Du legst ein Projekt an + pflegst Fortschritt→ Project (Planung → fertig)
7. Abrechnung     Du stellst Rechnung(en)                      → Invoice (Entwurf → versendet → bezahlt)
```

---

### Phase 1 – Anfrage (Lead & Brief)

Es gibt **zwei** Einstiege, beide landen bei dir im Admin:

- **Preisrechner** (kurz): erzeugt einen **Lead** → `/admin/anfragen`.
  Enthält Kontaktdaten + grobe Auswahl + berechnete Preisspanne.
- **Konfigurator** (ausführlich): erzeugt eine **Konfiguration / Brief** →
  `/admin/konfigurationen`. Enthält alle Detailangaben des Kunden zur Vision.

> 💡 **Neu:** In jeder Konfiguration (`/admin/konfigurationen/[id]`) gibt es oben
> den Block **„Für Claude aufbereiten"** mit zwei Buttons: die komplette
> Kundenkonfiguration als fertigen Prompt **kopieren** oder als **.md-Datei**
> laden – direkt bei Claude einfügen/hochladen, um an der Vision zu arbeiten.

Bei jeder neuen Anfrage geht zusätzlich eine **E-Mail-Benachrichtigung** an dich
raus (sobald `RESEND_API_KEY` gesetzt ist).

**Status von Lead/Brief:** `new` (neu) · `in_progress` (in Bearbeitung) ·
`answered` (beantwortet) · `closed` (abgeschlossen). Reines Organisations-Hilfsmittel
für dich – der Kunde sieht diesen Status nicht.

---

### Phase 2 & 3 – Angebot (Offer)

Aus einer Anfrage erstellst du unter `/admin/angebote/neu` ein **Angebot** mit
Positionen (Beschreibung, Menge, Einzelpreis), Steuersatz und Gültigkeitsdatum.

**Status eines Angebots:**

| Status | Bedeutung | Kunde sieht es? |
|--------|-----------|-----------------|
| `draft` (Entwurf) | Du arbeitest noch daran | **Nein** |
| `sent` (versendet) | Für den Kunden freigegeben, wartet auf Antwort | Ja |
| `accepted` (angenommen) | Kunde hat zugesagt | Ja |
| `declined` (abgelehnt) | Kunde hat abgelehnt (ggf. mit Kommentar) | Ja |
| `expired` (abgelaufen) | Gültigkeitsdatum überschritten | Ja |

👉 **Wichtig:** Solange ein Angebot `draft` ist, ist es für den Kunden unsichtbar.
Erst wenn du auf **`sent`** stellst, taucht es im Kundendashboard auf.

---

### Phase 4 – Annahme & Anzahlung

Der Kunde öffnet das Angebot in `/dashboard` und kann es **annehmen** oder
**ablehnen** (optional mit Kommentar). Die Annahme schreibt nur den Status – der
Preis kann dabei nicht manipuliert werden (serverseitig abgesichert).

Nach der Annahme erscheint die **Anzahlung (50 %)** als Zahlungsbox:
- Aktuell per **Überweisung** (Bankdaten + Verwendungszweck).
- Später per **Stripe** „Online bezahlen" (vorbereitet, schaltet sich frei, sobald
  die Stripe-Keys gesetzt sind und `NEXT_PUBLIC_ONLINE_PAYMENT_ENABLED=true`).

Die Anzahlung ist branchenüblich der Startschuss fürs Projekt.

---

### Phase 5 – Konzept (Concept, optional)

Ein **Konzept** (`/admin/konzepte`) ist ein freier Textbaustein, den du mit dem
Kunden teilen kannst – z. B. Content-Konzept, Sitemap, Designrichtung, Vorschläge.

**Status:** `draft` (Entwurf, nur du) · `shared` (geteilt → im Kundendashboard
sichtbar). Ein Konzept ist also dein Werkzeug, um Zwischenstände abzustimmen,
**bevor** oder **während** gebaut wird. Es ist nichts Verbindliches/Bezahltes –
anders als ein Angebot oder eine Rechnung.

---

### Phase 6 – Umsetzung (Project)

Für die eigentliche Arbeit legst du ein **Projekt** an (`/admin/projekte`). Es hat
einen **Fortschrittsbalken (0–100 %)** und eine **Live-Timeline**: Jeder Eintrag
(„Update") erscheint beim Kunden in Echtzeit – so sieht er transparent, woran du
gerade arbeitest.

**Projekt-Status:** `planning` (Planung) · `in_progress` (in Umsetzung) ·
`review` (Abnahme/Review) · `done` (fertig) · `paused` (pausiert).

Typischer Verlauf: `planning → in_progress → review → done`.

---

### Phase 7 – Abrechnung (Invoice)

Rechnungen erstellst du unter `/admin/rechnungen` (Positionen wie beim Angebot).
Üblich sind z. B. die **Restzahlung** nach Fertigstellung und/oder laufende Posten.

**Rechnungs-Status:**

| Status | Bedeutung | Kunde sieht es? |
|--------|-----------|-----------------|
| `draft` (Entwurf) | In Vorbereitung | **Nein** |
| `sent` (versendet) | Offen, zur Zahlung freigegeben | Ja |
| `paid` (bezahlt) | Zahlung verbucht | Ja |
| `cancelled` (storniert) | Zurückgezogen | Ja |

Wie beim Angebot gilt: `draft` ist für den Kunden unsichtbar, erst `sent` macht die
Rechnung im Dashboard sichtbar und bezahlbar. Bei Stripe-Zahlung setzt der Webhook
den Status automatisch auf `paid`; bei Überweisung setzt du ihn manuell.

---

## Status-Spickzettel (alle auf einen Blick)

| Objekt | Mögliche Status |
|--------|-----------------|
| **Lead / Brief** | `new` · `in_progress` · `answered` · `closed` |
| **Angebot (Offer)** | `draft` · `sent` · `accepted` · `declined` · `expired` |
| **Konzept (Concept)** | `draft` · `shared` |
| **Projekt (Project)** | `planning` · `in_progress` · `review` · `done` · `paused` |
| **Rechnung (Invoice)** | `draft` · `sent` · `paid` · `cancelled` |
| **Abo (Subscription, TAS-Fleet)** | `incomplete` · `trialing` · `active` · `past_due` · `canceled` |

**Faustregel Sichtbarkeit:** Alles, was `draft`/Entwurf ist, sieht nur du.
Angebote & Rechnungen werden mit **`sent`** für den Kunden sichtbar, Konzepte mit
**`shared`**. Projekte sieht der Kunde, sobald sie ihm zugeordnet sind.

---

## Kurz: der häufigste Weg

1. Kunde füllt **Konfigurator** aus → Konfiguration landet im Admin (+ E-Mail).
2. Du klickst **„Als Prompt kopieren"**, lässt Claude einen Entwurf/Plan bauen.
3. Du erstellst ein **Angebot** und stellst es auf **`sent`**.
4. Kunde **nimmt an** und zahlt die **Anzahlung**.
5. Du legst ein **Projekt** an, pflegst Fortschritt + Updates (optional vorab ein
   **Konzept** teilen).
6. Projekt auf **`done`**, **Restrechnung** auf **`sent`** → Kunde zahlt → `paid`.
7. Website-Übergabe. 🎉
