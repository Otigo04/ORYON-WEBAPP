/**
 * ============================================================================
 *  ORYON PREISRECHNER – PREISE HIER BEARBEITEN
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
    onepager:    { label: "One-Pager / Landingpage", base: [900, 1800],    complex: false },
    website:     { label: "Mehrseitige Website",      base: [2500, 5000],   complex: false },
    shopSimple:  { label: "Einfacher Online-Shop",    base: [4000, 8000],   complex: false },
    shopComplex: { label: "Komplexer Online-Shop",    base: [12000, 30000], complex: true  },
  },

  /** Design-Faktor: maßgeschneidert = voller Preis, Template = günstiger. */
  designMultiplier: { custom: 1.0, template: 0.8 },
  designLabel:      { custom: "Maßgeschneidertes Design", template: "Template / Vorlage" },

  /** Optionale Zusatz-Features (Einmalpreis-Aufschlag [min, max]). */
  features: {
    content:  { label: "Content & Texte",      hint: "Professionelle Texterstellung", price: [600, 1500] },
    booking:  { label: "Online-Terminbuchung", hint: "Buchungs-/Kalenderfunktion",    price: [800, 1500] },
    blog:     { label: "Blog / CMS",           hint: "Inhalte selbst pflegen",        price: [700, 1400] },
    branding: { label: "Logo & Branding",      hint: "Logo-Design / CI-Paket",        price: [500, 1200] },
  },

  /** Aufpreis je zusätzlicher Sprache. `max` = maximal wählbare Sprachen. */
  extraLanguage: { label: "Weitere Sprache", price: [500, 900], max: 5 },

  /** Monatliche Wartungs- & Hosting-Pauschale (separat zum Einmalpreis). */
  maintenance: { label: "Wartung & Hosting", price: [49, 99] },

  /** Beträge werden auf diesen Wert gerundet (saubere Zahlen). 0 = kein Runden. */
  roundTo: 50,
} as const;
