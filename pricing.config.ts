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

/**
 * Steuerstatus – EINE Stelle für die ganze Website (Preise, FAQ, Rechner,
 * Konfigurator, Angebote/Rechnungen, Impressum).
 * `true`  = Kleinunternehmer nach § 19 UStG: keine Umsatzsteuer, alle Preise
 *           sind Endpreise ohne USt.-Ausweis.
 * `false` = Regelbesteuerung: Preise gelten inkl. gesetzlicher USt.; dann auch
 *           die Impressum-Angaben (USt-IdNr. in `src/lib/site.ts`) prüfen.
 */
export const SMALL_BUSINESS_VAT_EXEMPT = true;

/** Standard-Steuersatz für neue Angebote/Rechnungen (in Prozent). */
export const DEFAULT_TAX_RATE = SMALL_BUSINESS_VAT_EXEMPT ? 0 : 19;

/** Hinweistext, der überall neben Preisen steht. */
export const VAT_NOTE = SMALL_BUSINESS_VAT_EXEMPT
  ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
  : "Alle Preise inkl. gesetzlicher Umsatzsteuer.";

export const pricingConfig = {
  /** Projektarten – `base` ist die Einmalpreis-Spanne [min, max]. */
  projectTypes: {
    onepager:    { label: "One-Pager / Landingpage", base: [900, 1800],    complex: false },
    website:     { label: "Mehrseitige Website",      base: [2500, 5000],   complex: false },
    shopSimple:  { label: "Einfacher Online-Shop",    base: [4000, 8000],   complex: false },
    shopComplex: { label: "Komplexer Online-Shop",    base: [12000, 30000], complex: true  },
  },

  /**
   * Design-Wunsch (nur Information für das Angebot). Beeinflusst den Preis
   * nicht – es gibt einen Preis pro Projektart.
   */
  designLabel: { custom: "Maßgeschneidertes Design", template: "Template / Vorlage" },

  /** Optionale Zusatz-Features (Einmalpreis-Aufschlag [min, max]). */
  features: {
    content:  { label: "Content & Texte",      hint: "Professionelle Texterstellung", price: [600, 1500] },
    booking:  { label: "Online-Terminbuchung", hint: "Buchungs-/Kalenderfunktion",    price: [800, 1500] },
    blog:     { label: "Blog / CMS",           hint: "Inhalte selbst pflegen",        price: [700, 1400] },
    branding: { label: "Logo & Branding",      hint: "Logo-Design / CI-Paket",        price: [500, 1200] },
  },
  /** Aufpreis je zusätzlicher Sprache. `max` = maximal wählbare Sprachen. */
  extraLanguage: { label: "Weitere Sprache", price: [500, 900], max: 5 },

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

  /**
   * Aufpreise des Detail-Konfigurators (`src/lib/brief.ts`) je Frage und Option.
   * Schlüssel = Feldname, danach Options-Label → Betrag in Euro. Einmalig.
   * Hier ändern, nicht im Code.
   */
  briefAddOns: {
    oneTime: {
      logoStatus: {
        "Nein, brauche eins": 350,
      },
      pages: {
        "Über uns": 39,
        "Leistungen / Produkte": 39,
        "Portfolio / Referenzen": 250,
        Kontakt: 39,
        FAQ: 39,
        Team: 39,
        "Karriere / Jobs": 39,
        Preise: 39,
      },
      contentStatus: {
        Teilweise: 50,
        "Nein, bitte übernehmen": 95,
      },
      features: {
        Kontaktformular: 39,
        Terminbuchung: 99,
        Onlineshop: 1500,
        "Blog / CMS": 149,
        Mehrsprachigkeit: 39,
        "Mitgliederbereich / Login": 199,
        "Newsletter-Anmeldung": 39,
        "Live-Chat": 79,
        "Karte / Anfahrt": 39,
        Bewertungen: 59,
        Downloadbereich: 49,
      },
      integrations: {
        "Social Media (inkl. WhatsApp)": 20,
        "Google Maps": 10,
        "CRM-Anbindung": 49,
      },
    },
  },

  /** Steuerhinweis neben allen Preisen – gesteuert über `SMALL_BUSINESS_VAT_EXEMPT`. */
  vatNote: VAT_NOTE,

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
    starter:      { monthly: 49,  yearly: 39  },
    professional: { monthly: 149, yearly: 119 },
    enterprise:   { monthly: 399, yearly: 319 },
  },
} as const;