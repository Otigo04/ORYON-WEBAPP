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
  /** Projektarten – `base` ist die Einmalpreis-Spanne [min, max]. */
  projectTypes: {
    onepager:    { label: "One-Pager / Landingpage", base: [95, 195],     complex: false },
    website:     { label: "Mehrseitige Website",      base: [199, 399],    complex: false },
    shopSimple:  { label: "Einfacher Online-Shop",    base: [450, 990],    complex: false },
    shopComplex: { label: "Komplexer Online-Shop",    base: [1490, 4900],  complex: true  },
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
      onepager:    [9, 15],
      website:     [15, 25],
      shopSimple:  [25, 45],
      shopComplex: [45, 79],
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
      onepager:    [10, 24],
      website:     [24, 44],
      shopSimple:  [34, 74],
      shopComplex: [54, 120],
    },
  },

  /** Beträge werden auf diesen Wert gerundet (saubere Zahlen). 0 = kein Runden. */
  roundTo: 0,
} as const;