/**
 * Zentrale Datenquelle für die TAS-FLEET-Produktseite (`/leistungen/tas-fleet`).
 *
 * TAS-FLEET ist das eigene SaaS-Produkt von TAS Webworks: eine Web-App für
 * Fuhrpark-, Fahrer- und Dispositionsverwaltung – primär für Taxi-, Mietwagen-
 * und Shuttle-Betriebe. Alle Inhalte der Produktseite (Module, Preis-Tiers,
 * Kennzahlen, FAQ, Testimonials) liegen hier gebündelt, damit Texte, SEO und
 * strukturierte Daten immer aus einer Quelle stammen.
 *
 * Platzhalter, die du später ersetzt:
 *  - {@link FLEET.demoVideoId}: YouTube-/Vimeo-ID des Demo-Videos (aktuell leer).
 *  - {@link FleetModule.image}: echte Screenshots unter /public/tas-fleet/screens/.
 *  - Logo: /public/tas-fleet/logo.svg (Platzhalter, bis das finale Logo da ist).
 */

import { pricingConfig } from "../../pricing.config";

/** Externer Link zur eigentlichen App – Ziel des "Jetzt starten"-CTA. */
export const FLEET_APP_URL = "https://fleet.tas-webworks.de";

/**
 * YouTube-ID des Demo-Videos (der Teil hinter `?v=` bzw. `youtu.be/`).
 * Solange leer, zeigt die Demo-Lightbox einen "in Produktion"-Platzhalter.
 * Beispiel: "dQw4w9WgXcQ".
 */
export const FLEET_DEMO_VIDEO_ID = "";

/** Markenfarben der TAS-FLEET-Produktseite (Tailwind-Arbitrary-Werte). */
export const FLEET_COLORS = {
  /** Smaragd – Anker an die Dachmarke TAS Webworks. */
  emerald: "#09ed2d",
  /** Cyan – eigenständige Produktfarbe (Mobility/Tech-Anmutung). */
  cyan: "#22d3ee",
} as const;

export type FleetModule = {
  /** Stabiler Anker/Key. */
  id: string;
  /** Kategorie-Label über dem Titel. */
  eyebrow: string;
  /** Modul-Titel. */
  title: string;
  /** Beschreibender Absatz. */
  description: string;
  /** Konkrete Funktions-Highlights (Bullet-Liste). */
  highlights: string[];
  /**
   * Pfad zum echten Screenshot unter /public. Solange leer/nicht vorhanden,
   * rendert die Seite einen stilvollen CSS-Mockup-Platzhalter.
   */
  image: string;
  /** Kennung für den passenden Mockup-Platzhalter (siehe BrowserFrame). */
  mock: "dashboard" | "disposition" | "fleet" | "compliance" | "import" | "incident";
};

export const FLEET_MODULES: FleetModule[] = [
  {
    id: "dashboard",
    eyebrow: "Überblick",
    title: "Live-Dashboard für Ihre gesamte Flotte",
    description:
      "Alle Kennzahlen auf einen Blick: Anzahl aktiver Fahrer und Fahrzeuge, der aktuelle Flottenstatus (Aktiv / Wartung / Offline) und sämtliche ablaufenden Dokumente – in Echtzeit und ohne eine einzige Excel-Tabelle.",
    highlights: [
      "Gesamtzahl Fahrer & Fahrzeuge in Echtzeit",
      "Statusampel: Aktiv, Wartung, Offline",
      "Fristen-Warnungen für ablaufende Dokumente",
      "Schnellzugriff auf alle Module",
    ],
    image: "/tas-fleet/screens/dashboard.png",
    mock: "dashboard",
  },
  {
    id: "disposition",
    eyebrow: "Disposition",
    title: "Schichtplanung in Echtzeit – mit PDF-Export",
    description:
      "Weisen Sie Fahrer und Fahrzeuge tagesgenau zu. Änderungen synchronisieren sich live für das gesamte Team. Den fertigen Schichtplan exportieren Sie mit einem Klick als sauberes PDF – Schluss mit Zettelwirtschaft und Telefonchaos.",
    highlights: [
      "Tagesbasierte Schichtzuweisung per Drag-and-drop",
      "Echtzeit-Synchronisation über alle Geräte",
      "PDF-Export für Fahrer & Aushang",
      "Konflikte und Doppelbelegungen sofort sichtbar",
    ],
    image: "/tas-fleet/screens/disposition.png",
    mock: "disposition",
  },
  {
    id: "verwaltung",
    eyebrow: "Stammdaten",
    title: "Fahrer- & Fahrzeugverwaltung, die mitdenkt",
    description:
      "Pflegen Sie Ihre komplette Flotte zentral – mit Filterung, Suche und allen relevanten Feldern. Neue Fahrer importieren Sie per Excel/CSV im Massen-Upload; eine integrierte OCR-Erkennung liest Daten automatisch aus.",
    highlights: [
      "Vollständiges CRUD für Fahrer & Fahrzeuge",
      "Massenimport via Excel/CSV mit OCR-Erkennung",
      "Felder wie Adresse, Geburtsdatum, P-Schein-Ablauf",
      "Filter & Suche über den gesamten Datenbestand",
    ],
    image: "/tas-fleet/screens/verwaltung.png",
    mock: "fleet",
  },
  {
    id: "compliance",
    eyebrow: "Compliance",
    title: "Compliance-Center: keine Frist mehr verpassen",
    description:
      "P-Schein, Führerschein, TÜV, Versicherung – TAS-FLEET behält jede Frist im Auge und warnt Sie rechtzeitig, bevor ein Dokument abläuft. Lückenlose Dokumentation für jede Prüfung und maximale Rechtssicherheit.",
    highlights: [
      "Zentrale Dokumenten- & Fristenverwaltung",
      "Automatische Warnungen vor Ablauf",
      "Revisionssichere Historie",
      "DSGVO-konforme Datenhaltung",
    ],
    image: "/tas-fleet/screens/compliance.png",
    mock: "compliance",
  },
  {
    id: "incidents",
    eyebrow: "Vorfälle",
    title: "Incident-Log für lückenlose Dokumentation",
    description:
      "Unfälle, Schäden oder Beschwerden erfassen Sie strukturiert und ordnen sie direkt dem betroffenen Fahrer oder Fahrzeug zu. So haben Sie jeden Vorfall sauber dokumentiert und jederzeit abrufbar.",
    highlights: [
      "Vorfälle erfassen & kategorisieren",
      "Direkte Zuordnung zu Fahrer oder Fahrzeug",
      "Chronologische Historie pro Einheit",
      "Schnelle Auswertung für Versicherung & Recht",
    ],
    image: "/tas-fleet/screens/incident.png",
    mock: "incident",
  },
  {
    id: "import",
    eyebrow: "Onboarding",
    title: "In Minuten startklar – statt Wochen",
    description:
      "Bestehende Flotten und Fahrerlisten übernehmen Sie per Massenimport. Die globale Suche bringt Sie in Sekunden zu jedem Fahrer und jedem Fahrzeug. Kein langwieriges Einrichten, kein Datenchaos beim Umstieg.",
    highlights: [
      "Massenimport bestehender Daten in Minuten",
      "Globale Sofort-Suche über die ganze Flotte",
      "Intuitive Oberfläche ohne Schulungsaufwand",
      "Sofort einsatzbereit – im Browser, ohne Installation",
    ],
    image: "/tas-fleet/screens/import.png",
    mock: "import",
  },
];

/** Prägnante Kennzahlen für die Stats-Bar unter dem Hero. */
export type FleetStat = { value: string; label: string };

export const FLEET_STATS: FleetStat[] = [
  { value: "100%", label: "papierlose Disposition" },
  { value: "Echtzeit", label: "Sync über alle Geräte" },
  { value: "0 €", label: "Setup-Kosten" },
  { value: "DSGVO", label: "konform & sicher gehostet" },
];

/** Eindeutige Tarif-Kennung – auch der in der Datenbank gespeicherte `plan`. */
export type FleetPlanId = "starter" | "professional" | "enterprise";

export type FleetTier = {
  id: FleetPlanId;
  name: string;
  /** Kurzer Zielgruppen-Hinweis. */
  tagline: string;
  /** Monatspreis bei monatlicher Zahlung (in Euro). Aus pricing.config.ts. */
  monthly: number;
  /** Monatspreis bei jährlicher Zahlung (in Euro, bereits rabattiert). */
  yearly: number;
  /** Richtwert Flottengröße (Anzeigetext). */
  vehicles: string;
  /** Maximale Fahrzeuganzahl je Tarif. `null` = unbegrenzt. */
  vehicleLimit: number | null;
  /** Hervorheben (beliebtester Tarif)? */
  featured?: boolean;
  /** Beschriftung des CTA-Buttons. */
  cta: string;
  /** Enthaltene Leistungen. */
  features: string[];
};

export const FLEET_TIERS: FleetTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Für Einzelunternehmer & kleine Betriebe",
    monthly: pricingConfig.tasFleet.starter.monthly,
    yearly: pricingConfig.tasFleet.starter.yearly,
    vehicles: "bis 10 Fahrzeuge",
    vehicleLimit: 10,
    cta: "Kostenlos testen",
    features: [
      "Live-Dashboard",
      "Fahrer- & Fahrzeugverwaltung",
      "Compliance-Center (Fristen & Warnungen)",
      "Globale Suche",
      "E-Mail-Support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Für wachsende Taxi- & Mietwagenflotten",
    monthly: pricingConfig.tasFleet.professional.monthly,
    yearly: pricingConfig.tasFleet.professional.yearly,
    vehicles: "bis 50 Fahrzeuge",
    vehicleLimit: 50,
    featured: true,
    cta: "Jetzt starten",
    features: [
      "Alles aus Starter",
      "Disposition & Schichtplanung mit PDF-Export",
      "Echtzeit-Synchronisation",
      "Massenimport via Excel/CSV mit OCR",
      "Incident-Log",
      "Prioritäts-Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Für große Flotten & mehrere Standorte",
    monthly: pricingConfig.tasFleet.enterprise.monthly,
    yearly: pricingConfig.tasFleet.enterprise.yearly,
    vehicles: "unbegrenzte Fahrzeuge",
    vehicleLimit: null,
    cta: "Angebot anfragen",
    features: [
      "Alles aus Professional",
      "Mehrere Standorte & Mandanten",
      "Rollen- & Rechteverwaltung",
      "API-Zugang & individuelle Integrationen",
      "Persönliches Onboarding",
      "Dedizierter Ansprechpartner & SLA",
    ],
  },
];

/** Schneller Zugriff auf einen Tarif per Kennung. */
export function getFleetTier(plan: FleetPlanId): FleetTier | undefined {
  return FLEET_TIERS.find((t) => t.id === plan);
}

export type FleetFaq = { question: string; answer: string };

export const FLEET_FAQS: FleetFaq[] = [
  {
    question: "Für wen ist TAS-FLEET gemacht?",
    answer:
      "Für alle Betriebe mit Fuhrpark – besonders für Taxi-, Mietwagen- und Shuttle-Unternehmen. Ob fünf oder fünfhundert Fahrzeuge: TAS-FLEET skaliert mit Ihrem Betrieb.",
  },
  {
    question: "Muss ich etwas installieren?",
    answer:
      "Nein. TAS-FLEET läuft vollständig im Browser – auf Desktop, Tablet und Smartphone. Sie melden sich an und legen sofort los, ganz ohne Installation oder eigene Server.",
  },
  {
    question: "Wie aufwendig ist der Umstieg?",
    answer:
      "Minimal. Bestehende Fahrer- und Fahrzeuglisten importieren Sie per Excel/CSV-Massenimport; die integrierte OCR-Erkennung übernimmt die Tipparbeit. Die meisten Betriebe sind innerhalb eines Tages startklar.",
  },
  {
    question: "Sind meine Daten sicher?",
    answer:
      "Ja. TAS-FLEET wird DSGVO-konform auf europäischen Servern gehostet. Jeder Betrieb sieht ausschließlich seine eigenen Daten – abgesichert durch strikte Zugriffskontrollen auf Datenbankebene.",
  },
  {
    question: "Kann ich den Tarif später wechseln?",
    answer:
      "Jederzeit. Sie können monatlich kündigen und Ihren Tarif flexibel hoch- oder herunterstufen, wenn Ihre Flotte wächst oder sich verändert.",
  },
  {
    question: "Gibt es eine kostenlose Testphase?",
    answer:
      "Ja. Sie können TAS-FLEET unverbindlich testen und sich selbst von der Oberfläche überzeugen, bevor Sie sich für einen Tarif entscheiden.",
  },
];

export type FleetTestimonial = {
  quote: string;
  author: string;
  role: string;
  rating: number;
};

export const FLEET_TESTIMONIALS: FleetTestimonial[] = [
  {
    quote:
      "Seit wir mit TAS-FLEET disponieren, ist die Zettelwirtschaft komplett verschwunden. Der Schichtplan ist in Minuten fertig und jeder Fahrer weiß sofort Bescheid.",
    author: "Betriebsleitung",
    role: "ON Mobility",
    rating: 5,
  },
  {
    quote:
      "Die Fristen-Warnungen sind Gold wert. Wir haben noch nie so entspannt durch eine Konzessionsprüfung kommen können.",
    author: "Disponent",
    role: "Mietwagenbetrieb, Berlin",
    rating: 5,
  },
  {
    quote:
      "Den Massenimport unserer 40 Fahrer hatten wir an einem Nachmittag erledigt. Endlich eine Software, die für unseren Alltag gebaut ist.",
    author: "Geschäftsführer",
    role: "Taxiunternehmen",
    rating: 5,
  },
];
