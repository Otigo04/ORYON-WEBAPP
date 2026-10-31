# TAS Webworks – Launch-To-do

Branch: `launch-prep` (nicht `main`, kein Deploy). Reihenfolge = Priorität.
Legende: [ ] offen · [~] in Arbeit · [x] erledigt (im Build/Code geprüft)

Baseline Mobile (PageSpeed 31.10.2026): Performance 65 · LCP 3,18 s · TBT 1,90 s · FCP 954 ms · SI 3,15 s
Baseline Bundle (lokal `next start`, gzip): 403 KB initiales JS auf `/` + ~180 KB three.js (Hero) nachgeladen.

---

## P0 – Mobile-Ladezeit (zuerst)

Ursachen (im Code gefunden):
- Hero lädt three.js / @react-three/fiber / drei (WebGL-Beams) auch auf dem Handy → Hauptursache für „Unused JavaScript" + TBT.
- Navbar zieht `@supabase/ssr` + supabase-js für jeden Besucher, obwohl nur eingeloggte Nutzer es brauchen.
- FAQ ist Client Component (`motion` + `@headlessui/react`) für einen simplen Aufklapp-Effekt.
- `/` ist dynamisch gerendert (ƒ), weil Portfolio/Testimonials über `cookies()` aus Supabase laden → kein statisches HTML vom CDN.
- Legacy-JS (~14 KiB): kein `browserslist` gesetzt.
- ScrollProgress setzt State bei jedem Scroll-Frame (Re-Render).

- [x] P0.1 Hero-Beams nur auf Desktop (≥1024 px, kein `prefers-reduced-motion`, kein `saveData`), erst nach Idle laden; Mobile bekommt CSS-Hintergrund
- [x] P0.2 Navbar: Supabase nur bei vorhandenem Auth-Cookie per dynamischem `import()` laden
- [x] P0.3 FAQ auf natives `<details>` umbauen (Server Component, kein motion/headlessui auf `/`)
- [x] P0.4 `/` statisch machen (Portfolio/Testimonials ohne `cookies()`; ergibt sich aus P1)
- [x] P0.5 `browserslist` modern setzen (Legacy-JS-Warnung)
- [x] P0.6 ScrollProgress ohne React-State (direkter `transform` per ref)
- [ ] P0.7 Teure Blur-Layer (`blur-[120px]`) auf Mobile reduzieren
- [ ] P0.8 Build + Bundle-Vergleich vorher/nachher; PageSpeed-Neumessung durch dich nach Deploy (Preview)

## P1 – Inhalte wahr & belegbar (Branch, kein Deploy)

### 1. Portfolio
- [x] Fake-Projekte entfernen (NORDLICHT, Vogel Logistik, Helio/Atelier Mara, Meridian, Praxis Lindqvist, TAS-FLEET) inkl. Fallback in `src/lib/portfolio.ts`
- [x] Ergebniszahlen entfernen („+40 %", „Conversion verdoppelt", „60 % weniger Telefonaufwand")
- [x] Case Study „Webshop für Familienunternehmen" (Ausgangslage / Lösung / Technik), Fakten = `[PLATZHALTER]`
- [x] Fake-Testimonials entfernen (`src/lib/testimonials.ts` Fallback: Lena Brandt, Marco Vogel, Sophie Keller) + Sektion „Referenzen" aus Startseite
- [x] TAS-FLEET raus aus Navbar (Produkte-Menü), Leistungen-Menü, Branchen, Sitemap, Produkt-Sektion; Route `/leistungen/tas-fleet` stilllegen (noindex/404)

### 2. Behauptungen
- [x] „Ladezeit < 1 s", „unter einer Sekunde", „Uptime 24/7", „rund um die Uhr erreichbar", „höchste Verfügbarkeit garantiert" neutral umformulieren
- [ ] „DSGVO-konform" / „Daten sicher in der EU": nur mit Region + AVV, sonst `[PLATZHALTER]`
- [x] „Antwort in 24 h": 1× behalten, Rest raus
- [ ] „Werde eine unserer ersten Referenzen" → Angebot für frühe Kunden ohne Referenz-Versprechen

### 3. Preise
- [x] Alle Preise nur aus `pricing.config.ts` (Hero „79 €" hartkodiert, Services „76 €" = 95×0,8 berechnet)
- [x] Hero / Services / FAQ / Rechner angleichen (One-Pager ab 95 €, Mehrseiten ab 199 €)
- [x] USt.-Kennzeichnung (Kleinunternehmer § 19 UStG laut `site.ts`) – zu bestätigen
- [x] FAQ-Antwort „niedriger dreistelliger Bereich" anpassen

### 4. Ton & Wiederholungen
- [x] Durchgehend „du" (`branches.ts`, TAS-FLEET-Texte entfallen)
- [x] Keine Team-Sprache („wir", „unser Team", „ein Team, ein Ansprechpartner") → Ich-Form/neutral, auch `/ueber-uns`
- [x] „Lead-Videos" entfernen
- [x] „Festpreis", „kein Callcenter", „Berlin" auf max. 2 Stellen
- [x] Technik-Jargon → Kundensprache; Technik nur in einer Zeile „Gebaut mit"

### 5. KI-Look entschärfen
- [x] Hero-Badge „NEU · Agenturqualität schon ab 79 €!" raus
- [x] Superlative („atemberaubend", „blitzschnell", „unschlagbar preiswert", „Agentur-Qualität") streichen
- [ ] Glow-/Blur-Dekor, Rainbow-Button, Eyebrow-Labels reduzieren

### 6. Pflichtseiten
- [x] Impressum / Datenschutz / AGB vorhanden + im Footer verlinkt (prüfen)
- [ ] Lücken als Befund melden, keine Rechtstexte schreiben

## P2 – Abschlussbericht
- [ ] Änderungen je Datei · Platzhalter · offene Entscheidungen · nichts als geprüft melden, was nicht im Code/Build kontrolliert wurde

## Stand / offen
- [ ] P0.7 Blur-Layer: auf Landing entfernt (Sektionen), Rest in Navbar/Preisrechner-Karten bleibt
- [ ] P0.8 PageSpeed-Neumessung (nach Preview-Deploy, durch dich)
- [ ] „DSGVO"/Hosting-Region/AVV: Datenschutz-Seite nennt AVV + Vercel(USA)/Supabase(EU) – du musst belegen
- [ ] Datenschutz ergänzen: Stripe, Resend (E-Mail-Versand) fehlen im Text
- [ ] Impressum/Datenschutz zitieren „TMG/TTDSG" (seit 2024 DDG/TDDDG) – juristisch prüfen lassen
- [ ] Kontakt-E-Mail anlegen → `src/lib/site.ts` (`email`, `hasEmail: true`)
- [ ] Supabase-Tabellen `showcase_projects` / `testimonials` im Dashboard auf Fake-Zeilen prüfen
