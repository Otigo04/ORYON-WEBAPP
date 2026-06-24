import { z } from "zod";
import { PRICING, maintenanceRangeFor } from "@/lib/pricing";

/**
 * Datenmodell des detaillierten Projekt-Konfigurators.
 *
 * Der Wizard ist config-getrieben: Schritte und Felder werden hier als Daten
 * beschrieben und in der UI generisch gerendert. So bleibt die Konfiguration an
 * einer Stelle wartbar und Client/Server teilen sich dieselbe Wahrheit.
 *
 * Antwort-Werte sind bewusst schlicht typisiert: `string` (Text/Einfachauswahl)
 * oder `string[]` (Mehrfachauswahl). Das deckt alle Feldtypen ab und lässt sich
 * problemlos als JSON in Supabase ablegen.
 */

export type FieldType = "text" | "textarea" | "select" | "multi";

export type BriefField = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  options?: string[];
  optional?: boolean;
  /**
   * Optionaler Aufpreis (einmalig, in Euro) je Option – Schlüssel = Options-Label.
   * Wird in der UI an der Option angezeigt und in den Live-Kosten-Zähler
   * eingerechnet. Nur für select-/multi-Felder sinnvoll.
   */
  prices?: Record<string, number>;
  /** Monatlicher Aufpreis (z. B. Hosting) je Option – Schlüssel = Options-Label. */
  monthlyPrices?: Record<string, number>;
  /** Kurze Erklärung je Option (für das „?"-Tooltip). Schlüssel = Options-Label. */
  optionHelp?: Record<string, string>;
  /** Feld nur anzeigen, wenn ein anderes Feld einen bestimmten Wert hat. */
  showIf?: { field: string; equals: string | string[] };
};

export type BriefStep = {
  id: string;
  title: string;
  description: string;
  icon: "building" | "palette" | "gear" | "clipboard" | "mail";
  fields: BriefField[];
};

export const BRIEF_STEPS: BriefStep[] = [
  {
    id: "unternehmen",
    title: "Unternehmen & Marke",
    description: "Erzähl uns, wer ihr seid und was die Website erreichen soll.",
    icon: "building",
    fields: [
      { name: "companyName", label: "Firmenname", type: "text", placeholder: "Mustermann GmbH" },
      {
        name: "brandName",
        label: "Marken-/Anzeigename (falls abweichend)",
        type: "text",
        placeholder: "z. B. Mustermann Design",
        optional: true,
      },
      {
        name: "domain",
        label: "Wunsch-Domain",
        type: "text",
        placeholder: "meinefirma.de",
        hint: "Falls noch keine vorhanden ist, registrieren wir deine Wunsch-Domain – inklusive.",
        optional: true,
      },
      {
        name: "domainStatus",
        label: "Domain bereits vorhanden?",
        type: "select",
        options: ["Ja, vorhanden", "Nein, bitte besorgen", "Noch unklar"],
        optionHelp: {
          "Ja, vorhanden": "Du hast die Internetadresse (z. B. firma.de) bereits.",
          "Nein, bitte besorgen": "Wir registrieren deine Wunsch-Domain für dich – inklusive.",
          "Noch unklar": "Du bist dir nicht sicher – wir klären das gemeinsam.",
        },
        optional: true,
      },
      { name: "industry", label: "Branche", type: "text", placeholder: "z. B. Gastronomie, Handwerk …" },
      {
        name: "businessDescription",
        label: "Was macht dein Unternehmen genau?",
        type: "textarea",
        placeholder: "Beschreibe kurz dein Angebot / deine Dienstleistung.",
        optional: true,
      },
      {
        name: "usp",
        label: "Was unterscheidet dich von Mitbewerbern?",
        type: "textarea",
        placeholder: "Deine Stärken, dein Alleinstellungsmerkmal …",
        optional: true,
      },
      { name: "slogan", label: "Slogan / Claim", type: "text", optional: true },
      {
        name: "logoStatus",
        label: "Logo vorhanden?",
        type: "select",
        options: ["Ja, vorhanden", "Nein, brauche eins", "In Arbeit"],
        prices: { "Nein, brauche eins": 350 },
        optionHelp: {
          "Ja, vorhanden": "Du hast bereits ein fertiges Logo.",
          "Nein, brauche eins": "Wir gestalten ein professionelles Logo für dich.",
          "In Arbeit": "Dein Logo entsteht gerade / kommt später.",
        },
        optional: true,
      },
      {
        name: "targetAudience",
        label: "Zielgruppe – wen willst du erreichen?",
        type: "textarea",
        placeholder: "z. B. junge Familien in der Region, B2B-Kunden im Handwerk …",
        optional: true,
      },
      {
        name: "goals",
        label: "Hauptziele der Website",
        type: "multi",
        options: [
          "Mehr Anfragen / Leads",
          "Online verkaufen",
          "Bekanntheit steigern",
          "Termine erhalten",
          "Informieren / Visitenkarte",
          "Bewerbungen erhalten",
        ],
        optionHelp: {
          "Mehr Anfragen / Leads": "Mehr Kontaktanfragen über die Website erhalten.",
          "Online verkaufen": "Produkte oder Dienstleistungen direkt verkaufen.",
          "Bekanntheit steigern": "Sichtbarer werden und deine Marke aufbauen.",
          "Termine erhalten": "Mehr Buchungen / Terminanfragen bekommen.",
          "Informieren / Visitenkarte": "Dich einfach professionell präsentieren.",
          "Bewerbungen erhalten": "Neue Mitarbeiter / Bewerbungen gewinnen.",
        },
        optional: true,
      },
    ],
  },
  {
    id: "design",
    title: "Design & Inhalte",
    description: "Wie soll die Seite wirken – und welche Inhalte sind schon da?",
    icon: "palette",
    fields: [
      {
        name: "style",
        label: "Gewünschter Stil / Stimmung",
        type: "multi",
        options: [
          "Modern & minimalistisch",
          "Elegant & hochwertig",
          "Verspielt & bunt",
          "Seriös & klassisch",
          "Technisch & futuristisch",
          "Natürlich & warm",
        ],
        optionHelp: {
          "Modern & minimalistisch": "Klar, reduziert, viel Weißraum.",
          "Elegant & hochwertig": "Edel, gehoben, premium.",
          "Verspielt & bunt": "Lebendig, farbenfroh, kreativ.",
          "Seriös & klassisch": "Vertrauenswürdig, zeitlos, solide.",
          "Technisch & futuristisch": "Modern-technisch, innovativ.",
          "Natürlich & warm": "Erdig, freundlich, einladend.",
        },
        optional: true,
      },
      {
        name: "colorPreference",
        label: "Farbwünsche",
        type: "text",
        placeholder: "Hex-Codes, Farbnamen oder „überrascht mich“",
        optional: true,
      },
      {
        name: "references",
        label: "Referenz-Websites, die dir gefallen",
        type: "textarea",
        placeholder: "Links + kurz, was dir daran gefällt",
        optional: true,
      },
      {
        name: "dislikes",
        label: "Was gefällt dir gar nicht?",
        type: "textarea",
        placeholder: "Stile, Farben oder Elemente, die wir vermeiden sollen",
        optional: true,
      },
      {
        name: "pages",
        label: "Gewünschte Seiten",
        type: "multi",
        hint: "Startseite ist inklusive – jede weitere Unterseite mit Aufpreis.",
        options: [
          "Startseite",
          "Über uns",
          "Leistungen / Produkte",
          "Portfolio / Referenzen",
          "Blog / News",
          "Kontakt",
          "FAQ",
          "Team",
          "Shop",
          "Karriere / Jobs",
          "Preise",
        ],
        prices: {
          "Über uns": 39,
          "Leistungen / Produkte": 39,
          "Portfolio / Referenzen": 250,
          "Blog / News": 150,
          Kontakt: 39,
          FAQ: 39,
          Team: 39,
          Shop: 1500,
          "Karriere / Jobs": 39,
          Preise: 39,
        },
        optionHelp: {
          Startseite: "Die Hauptseite – der erste Eindruck (inklusive).",
          "Über uns": "Wer ihr seid, eure Geschichte.",
          "Leistungen / Produkte": "Was ihr anbietet, im Überblick.",
          "Portfolio / Referenzen": "Beispiele eurer Arbeit / Projekte.",
          "Blog / News": "Aktuelles & Beiträge zum Selbstpflegen.",
          Kontakt: "Kontaktdaten & Formular.",
          FAQ: "Häufige Fragen & Antworten.",
          Team: "Vorstellung eures Teams.",
          Shop: "Onlineshop mit Produkten.",
          "Karriere / Jobs": "Stellenangebote & Bewerbung.",
          Preise: "Preisübersicht eurer Angebote.",
        },
        optional: true,
      },
      {
        name: "contentStatus",
        label: "Texte vorhanden?",
        type: "select",
        options: ["Ja, liegen vor", "Teilweise", "Nein, bitte übernehmen"],
        prices: { Teilweise: 50, "Nein, bitte übernehmen": 95 },
        optionHelp: {
          "Ja, liegen vor": "Alle Texte sind fertig vorhanden.",
          Teilweise: "Ein Teil ist da, wir ergänzen den Rest.",
          "Nein, bitte übernehmen": "Wir schreiben alle Texte für dich.",
        },
        optional: true,
      },
      {
        name: "materials",
        label: "Welche Materialien hast du bereits?",
        type: "textarea",
        placeholder: "z. B. Logo, Bilder, Texte, Videos – was liegt schon vor?",
        optional: true,
      },
    ],
  },
  {
    id: "funktionen",
    title: "Funktionen & Technik",
    description: "Welche Funktionen brauchst du – und was ist technisch schon da?",
    icon: "gear",
    fields: [
      {
        name: "features",
        label: "Gewünschte Funktionen",
        type: "multi",
        options: [
          "Kontaktformular",
          "Terminbuchung",
          "Onlineshop",
          "Blog / CMS",
          "Mehrsprachigkeit",
          "Mitgliederbereich / Login",
          "Newsletter-Anmeldung",
          "Live-Chat",
          "Karte / Anfahrt",
          "Bewertungen",
          "Downloadbereich",
        ],
        prices: {
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
        optionHelp: {
          Kontaktformular: "Besucher schreiben dir direkt über ein Formular.",
          Terminbuchung: "Kunden buchen Termine online über einen Kalender.",
          Onlineshop: "Produkte online verkaufen – mit Warenkorb & Bezahlung.",
          "Blog / CMS": "Beiträge & Inhalte selbst pflegen (Redaktionssystem).",
          Mehrsprachigkeit: "Deine Seite in mehreren Sprachen (Preis je Sprache).",
          "Mitgliederbereich / Login": "Geschützter Bereich, in den sich Nutzer einloggen.",
          "Newsletter-Anmeldung": "Besucher tragen sich für deinen Newsletter ein.",
          "Live-Chat": "Sofort-Chat-Fenster für schnelle Fragen.",
          "Karte / Anfahrt": "Eingebettete Karte mit deinem Standort.",
          Bewertungen: "Kundenbewertungen / Sterne auf der Seite anzeigen.",
          Downloadbereich: "Dateien (PDFs etc.) zum Herunterladen bereitstellen.",
        },
        optional: true,
      },
      {
        name: "languages",
        label: "Welche Sprachen? (falls mehrsprachig)",
        type: "text",
        placeholder: "z. B. Deutsch, Englisch, Türkisch",
        hint: "Je zusätzlicher Sprache 39 €.",
        optional: true,
      },
      {
        name: "hostingStatus",
        label: "Hosting vorhanden?",
        type: "select",
        options: ["Ja, vorhanden", "Nein, bitte übernehmen", "Noch unklar"],
        monthlyPrices: { "Nein, bitte übernehmen": 14 },
        optionHelp: {
          "Ja, vorhanden": "Du hast bereits Webspace / Hosting.",
          "Nein, bitte übernehmen": "Wir hosten deine Seite – 14 €/Monat.",
          "Noch unklar": "Unsicher? Wir empfehlen dir das Passende.",
        },
        optional: true,
      },
      {
        name: "emailStatus",
        label: "Professionelle E-Mail-Adresse (z. B. info@deinedomain.de)?",
        type: "select",
        // Nur sinnvoll, wenn wir die Domain für dich besorgen (wir kaufen z. B.
        // bei Strato und richten dort gleich das Postfach ein).
        showIf: { field: "domainStatus", equals: "Nein, bitte besorgen" },
        options: ["Ja, bitte einrichten", "Nein, nicht nötig"],
        optionHelp: {
          "Ja, bitte einrichten": "Wir richten z. B. info@deinedomain.de für dich ein.",
          "Nein, nicht nötig": "Du brauchst keine eigene E-Mail-Adresse.",
        },
        optional: true,
      },
      {
        name: "integrations",
        label: "Integrationen / Tools",
        type: "multi",
        options: ["Social Media (inkl. WhatsApp)", "Google Maps", "CRM-Anbindung"],
        prices: {
          "Social Media (inkl. WhatsApp)": 20,
          "Google Maps": 10,
          "CRM-Anbindung": 49,
        },
        optionHelp: {
          "Social Media (inkl. WhatsApp)": "Verlinkung zu Instagram, Facebook, WhatsApp & Co.",
          "Google Maps": "Interaktive Karte mit deinem Standort.",
          "CRM-Anbindung": "Anbindung an ein Kundenverwaltungs-System (z. B. HubSpot).",
        },
        optional: true,
      },
      {
        name: "featureNotes",
        label: "Besondere Funktionswünsche?",
        type: "textarea",
        placeholder: "Beschreibe spezielle Funktionen, die dir wichtig sind.",
        optional: true,
      },
    ],
  },
  {
    id: "rahmen",
    title: "Rahmen & Sonstiges",
    description: "Budget, Zeitrahmen und alles, was sonst noch wichtig ist.",
    icon: "clipboard",
    fields: [
      {
        name: "budget",
        label: "Budget-Rahmen",
        type: "select",
        options: [
          "Bis 1.000 €",
          "1.000–3.000 €",
          "3.000–6.000 €",
          "6.000–10.000 €",
          "Über 10.000 €",
          "Noch unklar",
        ],
        optionHelp: {
          "Bis 1.000 €": "Kleines Budget – Fokus auf das Wesentliche.",
          "1.000–3.000 €": "Solider Rahmen für einen guten Auftritt.",
          "3.000–6.000 €": "Umfangreichere Website mit mehr Funktionen.",
          "6.000–10.000 €": "Großes Projekt mit vielen Extras.",
          "Über 10.000 €": "Sehr umfangreiches / individuelles Projekt.",
          "Noch unklar": "Du bist dir noch nicht sicher – kein Problem.",
        },
        optional: true,
      },
      {
        name: "timeline",
        label: "Wunsch-Zeitrahmen",
        type: "select",
        options: ["So schnell wie möglich", "In 1–2 Monaten", "In 3–6 Monaten", "Kein fester Termin"],
        optionHelp: {
          "So schnell wie möglich": "Es eilt – wir priorisieren.",
          "In 1–2 Monaten": "Zeitnaher Start gewünscht.",
          "In 3–6 Monaten": "Etwas mehr Vorlauf.",
          "Kein fester Termin": "Flexibel, ohne Deadline.",
        },
        optional: true,
      },
      {
        name: "deadline",
        label: "Konkreter Stichtag / Anlass",
        type: "text",
        placeholder: "z. B. Messe im September, Eröffnung …",
        optional: true,
      },
      {
        name: "legal",
        label: "Bereits vorhanden",
        type: "multi",
        options: ["Impressum", "Datenschutzerklärung", "AGB"],
        optionHelp: {
          Impressum: "Pflicht-Seite mit Anbieterangaben.",
          Datenschutzerklärung: "Pflicht-Text zum Umgang mit Daten (DSGVO).",
          AGB: "Allgemeine Geschäftsbedingungen.",
        },
        optional: true,
      },
      {
        name: "competitors",
        label: "Wettbewerber / Vorbilder",
        type: "textarea",
        placeholder: "Wer macht es (deiner Meinung nach) gut?",
        optional: true,
      },
      {
        name: "projectVision",
        label: "Beschreibe dein Wunsch-Ergebnis in eigenen Worten",
        type: "textarea",
        placeholder: "Wie sieht für dich das perfekte Ergebnis aus?",
        optional: true,
      },
      {
        name: "notes",
        label: "Sonstiges",
        type: "textarea",
        placeholder: "Alles, was wir noch wissen sollten.",
        optional: true,
      },
    ],
  },
];

export type BriefValue = string | string[];
export type BriefData = Record<string, BriefValue>;

/** Aus dem Preisrechner übergebene Vorauswahl (read-only Zusammenfassung). */
export type BriefSummary = {
  projectType?: string;
  design?: string;
  features?: string[];
  extraLanguages?: number;
  maintenance?: boolean;
  priceMin?: number;
  priceMax?: number;
};

export type BriefContact = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

/** Vollständiger, im Browser/Konto persistierter Entwurf. */
export type BriefDraft = {
  data: BriefData;
  contact: BriefContact;
  summary: BriefSummary;
};

export const EMPTY_CONTACT: BriefContact = { name: "", email: "", phone: "", company: "" };

export function emptyDraft(): BriefDraft {
  return { data: {}, contact: { ...EMPTY_CONTACT }, summary: {} };
}

export const BRIEF_STORAGE_KEY = "tas-brief-draft";

/**
 * Prüft, ob ein Feld unter den aktuellen Antworten sichtbar ist (showIf).
 * Wird sowohl beim Rendern als auch bei der Kostenschätzung genutzt, damit
 * versteckte Felder nicht ins Gewicht fallen.
 */
export function isFieldVisible(field: BriefField, data: BriefData): boolean {
  if (!field.showIf) return true;
  const current = data[field.showIf.field];
  const expected = field.showIf.equals;
  const values = Array.isArray(current) ? current : current ? [current] : [];
  if (Array.isArray(expected)) return expected.some((e) => values.includes(e));
  return values.includes(expected);
}

// ---- Validierung (Server) ---------------------------------------------

const valueSchema = z.union([
  z.string().max(5000),
  z.array(z.string().max(300)).max(50),
]);

export const briefSubmitSchema = z.object({
  contact: z.object({
    name: z.string().min(2, "Bitte gib deinen Namen an.").max(120),
    email: z.string().email("Bitte gib eine gültige E-Mail-Adresse an.").max(200),
    phone: z.string().max(60).optional().default(""),
    company: z.string().max(160).optional().default(""),
  }),
  data: z.record(z.string(), valueSchema).default({}),
  summary: z
    .object({
      projectType: z.string().max(60).optional(),
      design: z.string().max(60).optional(),
      features: z.array(z.string().max(60)).max(30).optional(),
      extraLanguages: z.number().int().min(0).max(50).optional(),
      maintenance: z.boolean().optional(),
      priceMin: z.number().int().min(0).optional(),
      priceMax: z.number().int().min(0).optional(),
    })
    .default({}),
});

export type BriefSubmitInput = z.infer<typeof briefSubmitSchema>;

/** Hübsche Anzeige eines Antwortwerts (für Zusammenfassung & Admin). */
export function displayValue(value: BriefValue | undefined): string {
  if (value == null) return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return value.trim() || "—";
}

// ---- Live-Kostenschätzung ---------------------------------------------

export type BriefEstimate = {
  /** Startwert aus der Projektart (Preisrechner). */
  base: number;
  /** Summe aller gewählten einmaligen Aufpreis-Optionen. */
  addOns: number;
  /** Gesamter einmaliger Richtwert. */
  oneTime: number;
  /** Monatlicher Richtwert (Hosting/Wartung). */
  monthly: number;
};

/**
 * Liefert den Basispreis (einmalig) für eine Projektart aus der zentralen
 * Preis-Konfiguration. Unbekannt → 0.
 */
export function baseForProjectType(projectType: string | undefined): number {
  if (projectType && projectType in PRICING.projectTypes) {
    return PRICING.projectTypes[projectType as keyof typeof PRICING.projectTypes].base[0];
  }
  return 0;
}

/**
 * Berechnet den aktuellen Richtwert aus Projektart (Basis) plus allen gewählten
 * Aufpreis-Optionen des Konfigurators – einmalig und monatlich. Versteckte
 * Felder (showIf nicht erfüllt) zählen nicht mit. Bewusst eine schlichte Summe:
 * transparenter, unverbindlicher Live-Wert.
 */
export function computeBriefEstimate(data: BriefData, summary: BriefSummary): BriefEstimate {
  const base = baseForProjectType(summary.projectType);

  let addOns = 0;
  let monthly = 0;

  for (const step of BRIEF_STEPS) {
    for (const field of step.fields) {
      if (!isFieldVisible(field, data)) continue;
      const value = data[field.name];
      const selected = Array.isArray(value) ? value : value ? [value] : [];
      for (const opt of selected) {
        if (field.prices) addOns += field.prices[opt] ?? 0;
        if (field.monthlyPrices) monthly += field.monthlyPrices[opt] ?? 0;
      }
    }
  }

  // Optionale Wartung aus dem Preisrechner ergänzt den monatlichen Richtwert.
  if (summary.maintenance && summary.projectType && summary.projectType in PRICING.projectTypes) {
    monthly += maintenanceRangeFor(summary.projectType as keyof typeof PRICING.projectTypes)[0];
  }

  return { base, addOns, oneTime: base + addOns, monthly };
}
