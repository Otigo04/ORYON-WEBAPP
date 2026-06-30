/**
 * ============================================================================
 *  OTIGO PREISRECHNER – PREISE HIER BEARBEITEN
 * ============================================================================
 *
 * Diese Datei liegt bewusst im Projekt-Hauptverzeichnis, damit Preise schnell
 * angepasst werden können – ganz ohne im Code zu suchen. Änderungen werden nach
 * einem Reload (im Dev sofort) automatisch im Preisrechner übernommen.
 *
 * Alle Beträge sind in Euro. Jede Preisangabe ist eine Spanne `[min, max]`.
 * Nur die Zahlen/Texte unten ändern – die Struktur (Schlüssel) bitte so lassen.
 */

export const pricingConfig = {
  /** Projektarten. `base` ist die Einmalpreis-Spanne [min, max]. Keine Shops. */
  projectTypes: {
    onepager:  { label: "One-Pager / Landingpage",        base: [95, 195],    complex: false },
    website:   { label: "Mehrseitige Website",            base: [199, 399],   complex: false },
    booking:   { label: "Buchungs- / Terminseite",        base: [290, 690],   complex: false },
    portfolio: { label: "Portfolio- / Kreativseite",      base: [190, 490],   complex: false },
    webapp:    { label: "Web-App / individuelle Lösung",  base: [690, 2900],  complex: true  },
  },

  /** Design-Faktor: maßgeschneidert = voller Preis, Template = günstiger. */
  designMultiplier: { custom: 1.0, template: 0.8 },
  designLabel:      { custom: "Maßgeschneidertes Design", template: "Template / Vorlage" },

  /** Optionale Zusatz-Features (Einmalpreis-Aufschlag [min, max]). */
  features: {
    content:  { label: "Content & Texte",      hint: "Professionelle Texterstellung", price: [39, 99] },
    booking:  { label: "Online-Terminbuchung", hint: "Buchungs-/Kalenderfunktion",    price: [99, 280] },
    blog:     { label: "Blog / CMS",           hint: "Inhalte selbst pflegen",        price: [90, 180] },
    branding: { label: "Logo & Branding",      hint: "Logo-Design / CI-Paket",        price: [200, 450] },
  },
  /** Aufpreis je zusätzlicher Sprache. `max` = maximal wählbare Sprachen. */
  extraLanguage: { label: "Weitere Sprache", price: [39, 79], max: 5 },

  /**
   * Monatliche Hosting-Pauschale (separat zum Einmalpreis). Fällt für jede
   * live betriebene Seite an und wird daher im Preisrechner dauerhaft als
   * eigener Posten angezeigt. Pro Projektart gestaffelt, jeweils [min, max] €/Monat.
   */
  hosting: {
    label: "Hosting",
    byProjectType: {
      onepager:  [9, 15],
      website:   [15, 25],
      booking:   [15, 29],
      portfolio: [12, 22],
      webapp:    [29, 59],
    },
  },

  /**
   * Optionale monatliche Wartung & Pflege (separat zum Hosting): Updates,
   * Backups, Sicherheit, kleine Inhaltsanpassungen. Pro Projektart gestaffelt,
   * jeweils [min, max] € pro Monat.
   */
  maintenance: {
    label: "Wartung & Pflege",
    byProjectType: {
      onepager:  [10, 24],
      website:   [24, 44],
      booking:   [24, 49],
      portfolio: [19, 39],
      webapp:    [49, 99],
    },
  },

  /** Beträge werden auf diesen Wert gerundet (saubere Zahlen). 0 = kein Runden. */
  roundTo: 0,

  /**
   * ──────────────────────────────────────────────────────────────────────
   *  TAS-FLEET (SaaS-Abo) – monatliche Tarifpreise in €/Monat.
   * ──────────────────────────────────────────────────────────────────────
   *  `monthly` = bei monatlicher Zahlung, `yearly` = bei jährlicher Zahlung
   *  (bereits rabattierter Monatspreis). Nur die Zahlen ändern.
   *  Die Tarif-Inhalte (Features, Limits, Texte) stehen in
   *  `src/lib/tas-fleet.ts`.
   */
  tasFleet: {
    starter:      { monthly: 29,  yearly: 23  },
    professional: { monthly: 69,  yearly: 55  },
    enterprise:   { monthly: 129, yearly: 103 },
  },
} as const;