import { PRICING, hostingRangeFor, maintenanceRangeFor, type FeatureKey } from "@/lib/pricing";

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
   * Optionaler Aufpreis (einmalig, in Euro) je Option, Schlüssel = Options-Label.
   * Wird in der UI an der Option angezeigt und in den Live-Kosten-Zähler
   * eingerechnet. Nur für select-/multi-Felder sinnvoll.
   */
  prices?: Record<string, number>;
  /** Kurze Erklärung je Option (für das „?"-Tooltip). Schlüssel = Options-Label. */
  optionHelp?: Record<string, string>;
  /**
   * Ausführlicher Detailtext je Option, beschreibt, was in diese Seite/Funktion
   * reinkommt bzw. wie sie aufgebaut wird. Klappt im Konfigurator unter der
   * Option auf, sobald sie ausgewählt ist. Schlüssel = Options-Label.
   */
  optionDetails?: Record<string, string>;
  /**
   * Optionen, die immer ausgewählt sind und nicht abgewählt werden können
   * (z. B. „Startseite" bei den Seiten, inklusive). Nur für multi-Felder.
   */
  lockedOptions?: string[];
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
    description: "Erzähl mir, wer du bist und was die Website erreichen soll.",
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
        hint: "Falls noch keine vorhanden ist, registriere ich deine Wunsch-Domain, inklusive.",
        optional: true,
      },
      {
        name: "domainStatus",
        label: "Domain bereits vorhanden?",
        type: "select",
        options: ["Ja, vorhanden", "Nein, bitte besorgen", "Noch unklar"],
        optionHelp: {
          "Ja, vorhanden": "Du hast die Internetadresse (z. B. firma.de) bereits.",
          "Nein, bitte besorgen": "Ich registriere deine Wunsch-Domain für dich, inklusive.",
          "Noch unklar": "Du bist dir nicht sicher, ich kläre das gern mit dir.",
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
        prices: PRICING.briefAddOns.oneTime.logoStatus,
        optionHelp: {
          "Ja, vorhanden": "Du hast bereits ein fertiges Logo.",
          "Nein, brauche eins": "Ich gestalte ein Logo für dich.",
          "In Arbeit": "Dein Logo entsteht gerade / kommt später.",
        },
        optional: true,
      },
      {
        name: "targetAudience",
        label: "Zielgruppe, wen willst du erreichen?",
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
          "Bekanntheit steigern",
          "Termine erhalten",
          "Informieren / Visitenkarte",
          "Bewerbungen erhalten",
        ],
        optionHelp: {
          "Mehr Anfragen / Leads": "Mehr Kontaktanfragen über die Website erhalten.",
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
    description: "Wie soll die Seite wirken, und welche Inhalte sind schon da?",
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
          "Sonstiges",
        ],
        optionHelp: {
          "Modern & minimalistisch": "Klar, reduziert, viel Weißraum.",
          "Elegant & hochwertig": "Edel, gehoben, premium.",
          "Verspielt & bunt": "Lebendig, farbenfroh, kreativ.",
          "Seriös & klassisch": "Vertrauenswürdig, zeitlos, solide.",
          "Technisch & futuristisch": "Modern-technisch, innovativ.",
          "Natürlich & warm": "Erdig, freundlich, einladend.",
          Sonstiges: "Etwas anderes, beschreibe deinen Wunsch-Stil im Textfeld.",
        },
        optional: true,
      },
      {
        name: "styleOther",
        label: "Dein Wunsch-Stil",
        type: "textarea",
        placeholder: "Beschreibe, wie deine Seite wirken soll …",
        showIf: { field: "style", equals: "Sonstiges" },
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
        placeholder: "Stile, Farben oder Elemente, die ich vermeiden soll",
        optional: true,
      },
      {
        name: "pages",
        label: "Gewünschte Seiten (Unterseiten)",
        type: "multi",
        hint: "Welche Unterseiten soll die Website haben? Startseite ist inklusive, jede weitere mit Aufpreis. Blog & Mitgliederbereich wählst du im nächsten Schritt unter „Funktionen“.",
        options: [
          "Startseite",
          "Über uns",
          "Leistungen / Produkte",
          "Portfolio / Referenzen",
          "Kontakt",
          "FAQ",
          "Team",
          "Karriere / Jobs",
          "Preise",
        ],
        lockedOptions: ["Startseite"],
        prices: PRICING.briefAddOns.oneTime.pages,
        optionHelp: {
          Startseite: "Die Hauptseite, der erste Eindruck (inklusive).",
          "Über uns": "Wer du bist, deine Geschichte.",
          "Leistungen / Produkte": "Was du anbietest, im Überblick.",
          "Portfolio / Referenzen": "Beispiele deiner Arbeit / Projekte.",
          Kontakt: "Eigene Kontaktseite mit Adresse & Anfahrt. Das Formular selbst wählst du unter „Funktionen“.",
          FAQ: "Häufige Fragen & Antworten.",
          Team: "Vorstellung deines Teams.",
          "Karriere / Jobs": "Stellenangebote & Bewerbung.",
          Preise: "Preisübersicht deiner Angebote.",
        },
        optionDetails: {
          Startseite:
            "Aufmerksamkeitsstarker Hero mit klarer Botschaft, Highlights deiner Leistungen, Vertrauenselemente (Bewertungen/Logos) und ein deutlicher Call-to-Action. Der erste Eindruck, der überzeugt.",
          "Über uns":
            "Deine Geschichte, Mission & Werte, was dich ausmacht und, auf Wunsch, eine kurze Team-Vorstellung. Schafft Vertrauen und Nähe.",
          "Leistungen / Produkte":
            "Übersichtliche Darstellung deiner Angebote mit Beschreibung, Vorteilen und je einem Call-to-Action pro Leistung, ideal als einzelne Karten oder Abschnitte.",
          "Portfolio / Referenzen":
            "Galerie deiner besten Projekte mit Bildern, kurzer Beschreibung und optional Kundenstimmen. Belegt deine Qualität sichtbar.",
          Kontakt:
            "Eigene Kontaktseite mit Adresse, Öffnungszeiten und allen Kontaktwegen auf einen Blick. Das interaktive Kontaktformular und die Karte fügst du als Funktion hinzu.",
          FAQ: "Häufige Fragen in sauber aufklappbaren Abschnitten (Akkordeon), reduziert Rückfragen und schafft Klarheit.",
          Team: "Vorstellung der Teammitglieder mit Foto, Position und kurzer Beschreibung, persönlich und sympathisch.",
          "Karriere / Jobs":
            "Stellenangebote, Infos zu dir als Arbeitgeber und ein Bewerbungsformular mit Datei-Upload.",
          Preise:
            "Transparente Preis- bzw. Paketübersicht mit Vergleich der Optionen und klarem Call-to-Action.",
        },
        optional: true,
      },
      {
        name: "contentStatus",
        label: "Texte vorhanden?",
        type: "select",
        options: ["Ja, liegen vor", "Teilweise", "Nein, bitte übernehmen"],
        prices: PRICING.briefAddOns.oneTime.contentStatus,
        optionHelp: {
          "Ja, liegen vor": "Alle Texte sind fertig vorhanden.",
          Teilweise: "Ein Teil ist da, ich ergänze den Rest.",
          "Nein, bitte übernehmen": "Ich schreibe alle Texte für dich.",
        },
        optional: true,
      },
      {
        name: "materials",
        label: "Welche Materialien hast du bereits?",
        type: "textarea",
        placeholder: "z. B. Logo, Bilder, Texte, Videos, was liegt schon vor?",
        optional: true,
      },
    ],
  },
  {
    id: "funktionen",
    title: "Funktionen & Technik",
    description: "Welche Funktionen brauchst du, und was ist technisch schon da?",
    icon: "gear",
    fields: [
      {
        name: "features",
        label: "Gewünschte Funktionen",
        type: "multi",
        hint: "Interaktive Funktionen deiner Website (nicht zu verwechseln mit den Seiten aus dem vorherigen Schritt). Blog und Mitgliederbereich gehören hierher.",
        options: [
          "Kontaktformular",
          "Terminbuchung",
          "Blog / CMS",
          "Mehrsprachigkeit",
          "Mitgliederbereich / Login",
          "Newsletter-Anmeldung",
          "Live-Chat",
          "Karte / Anfahrt",
          "Bewertungen",
          "Downloadbereich",
        ],
        prices: PRICING.briefAddOns.oneTime.features,
        optionHelp: {
          Kontaktformular: "Besucher schreiben dir direkt über ein Formular.",
          Terminbuchung: "Kunden buchen Termine online über einen Kalender.",
          "Blog / CMS": "Beiträge & Inhalte selbst pflegen (Redaktionssystem).",
          Mehrsprachigkeit: "Deine Seite in mehreren Sprachen, Deutsch inklusive, Aufpreis je weiterer Sprache.",
          "Mitgliederbereich / Login": "Geschützter Bereich, in den sich Nutzer einloggen.",
          "Newsletter-Anmeldung": "Besucher tragen sich für deinen Newsletter ein.",
          "Live-Chat": "Sofort-Chat-Fenster für schnelle Fragen.",
          "Karte / Anfahrt": "Eingebettete Karte mit deinem Standort.",
          Bewertungen: "Kundenbewertungen / Sterne auf der Seite anzeigen.",
          Downloadbereich: "Dateien (PDFs etc.) zum Herunterladen bereitstellen.",
        },
        optionDetails: {
          Kontaktformular:
            "Formular mit Feldern nach Wunsch, Spam-Schutz und automatischer Weiterleitung an dein Postfach, inkl. Datenschutz-Checkbox.",
          Terminbuchung:
            "Integrierter Kalender mit deinen Verfügbarkeiten, automatischer Bestätigungs-E-Mail und optionaler Erinnerung. Anbindung an gängige Tools möglich.",
          "Blog / CMS":
            "Redaktionssystem, mit dem du Beiträge, Bilder und Seiten selbst pflegst, ganz ohne Technikkenntnisse.",
          Mehrsprachigkeit:
            "Saubere Sprachumschaltung, übersetzte Inhalte und suchmaschinenfreundliche Sprachversionen. Deutsch ist inklusive, abgerechnet wird je zusätzlicher Sprache.",
          "Mitgliederbereich / Login":
            "Geschützter Bereich mit Registrierung, Login und individuell sichtbaren Inhalten je Nutzer.",
          "Newsletter-Anmeldung":
            "Anmeldeformular mit Double-Opt-in (DSGVO-konform) und Anbindung an dein Newsletter-Tool (z. B. Mailchimp, Brevo).",
          "Live-Chat":
            "Chat-Fenster für direkte Fragen, wahlweise per Tool (z. B. Tidio) oder als WhatsApp-Direktkontakt.",
          "Karte / Anfahrt":
            "Eingebettete, interaktive Karte mit deinem Standort und optionaler Routenführung.",
          Bewertungen:
            "Anzeige von Kundenbewertungen / Sternen, manuell gepflegt oder automatisch z. B. aus Google eingebunden.",
          Downloadbereich:
            "Bereich zum Bereitstellen von Dateien (PDFs, Preislisten etc.), auf Wunsch zugriffsgeschützt.",
        },
        optional: true,
      },
      {
        name: "languages",
        label: "Welche weiteren Sprachen? (falls mehrsprachig)",
        type: "text",
        placeholder: "z. B. Englisch, Türkisch",
        hint: "Deutsch ist immer inklusive. Trag hier nur zusätzliche Sprachen ein, je weiterer Sprache fällt ein kleiner Aufpreis an. Nur relevant, wenn „Mehrsprachigkeit“ als Funktion gewählt ist.",
        showIf: { field: "features", equals: "Mehrsprachigkeit" },
        optional: true,
      },
      {
        name: "hostingStatus",
        label: "Hosting vorhanden?",
        type: "select",
        options: ["Ja, vorhanden", "Nein, bitte übernehmen", "Noch unklar"],
        optionHelp: {
          "Ja, vorhanden": "Du hast bereits Webspace / Hosting.",
          "Nein, bitte übernehmen": "Ich übernehme das Hosting deiner Seite.",
          "Noch unklar": "Unsicher? Ich empfehle dir das Passende.",
        },
        optional: true,
      },
      {
        name: "emailStatus",
        label: "Professionelle E-Mail-Adresse (z. B. info@deinedomain.de)?",
        type: "select",
        // Nur sinnvoll, wenn ich die Domain für dich besorge (ich kaufe z. B.
        // bei Strato und richten dort gleich das Postfach ein).
        showIf: { field: "domainStatus", equals: "Nein, bitte besorgen" },
        options: ["Ja, bitte einrichten", "Nein, nicht nötig"],
        optionHelp: {
          "Ja, bitte einrichten": "Ich richte z. B. info@deinedomain.de für dich ein.",
          "Nein, nicht nötig": "Du brauchst keine eigene E-Mail-Adresse.",
        },
        optional: true,
      },
      {
        name: "integrations",
        label: "Integrationen / Tools",
        type: "multi",
        options: ["Social Media (inkl. WhatsApp)", "Google Maps", "CRM-Anbindung"],
        prices: PRICING.briefAddOns.oneTime.integrations,
        optionHelp: {
          "Social Media (inkl. WhatsApp)": "Verlinkung zu Instagram, Facebook, WhatsApp & Co.",
          "Google Maps": "Interaktive Karte mit deinem Standort.",
          "CRM-Anbindung": "Anbindung an ein Kundenverwaltungs-System (z. B. HubSpot).",
        },
        optionDetails: {
          "Social Media (inkl. WhatsApp)":
            "Verlinkte Icons zu deinen Profilen (Instagram, Facebook & Co.) und ein WhatsApp-Direktkontakt-Button für schnelle Anfragen.",
          "Google Maps":
            "Interaktive Karte mit deinem Standort, eingebettet auf der Kontaktseite, inkl. Marker und Routenlink.",
          "CRM-Anbindung":
            "Automatische Übergabe von Formular-Leads an dein CRM (z. B. HubSpot, Pipedrive), kein manuelles Übertragen mehr.",
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
          "1.000 bis 3.000 €",
          "3.000 bis 6.000 €",
          "6.000 bis 10.000 €",
          "Über 10.000 €",
          "Noch unklar",
        ],
        optionHelp: {
          "Bis 1.000 €": "Kleines Budget, Fokus auf das Wesentliche.",
          "1.000 bis 3.000 €": "Solider Rahmen für einen guten Auftritt.",
          "3.000 bis 6.000 €": "Umfangreichere Website mit mehr Funktionen.",
          "6.000 bis 10.000 €": "Großes Projekt mit vielen Extras.",
          "Über 10.000 €": "Sehr umfangreiches / individuelles Projekt.",
          "Noch unklar": "Du bist dir noch nicht sicher, kein Problem.",
        },
        optional: true,
      },
      {
        name: "timeline",
        label: "Wunsch-Zeitrahmen",
        type: "select",
        options: ["So schnell wie möglich", "In 1 bis 2 Monaten", "In 3 bis 6 Monaten", "Kein fester Termin"],
        optionHelp: {
          "So schnell wie möglich": "Es eilt, ich priorisiere.",
          "In 1 bis 2 Monaten": "Zeitnaher Start gewünscht.",
          "In 3 bis 6 Monaten": "Etwas mehr Vorlauf.",
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
        placeholder: "Alles, was ich noch wissen sollte.",
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
  /** Hosting-Pflichtwahl aus dem Landing-Preisrechner (Ja/Nein). */
  hosting?: boolean;
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
 * Einmal-Marker für die Übergabe vom Landing-Preisrechner in den Konfigurator.
 * Ist er gesetzt, hat die frisch übergebene lokale Auswahl Vorrang vor einem evtl.
 * älteren Konto-Entwurf (sonst überschreibt der Konto-Entwurf die neue Auswahl).
 */
export const BRIEF_HANDOFF_KEY = "tas-brief-handoff";

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

/** Hübsche Anzeige eines Antwortwerts (für Zusammenfassung & Admin). */
export function displayValue(value: BriefValue | undefined): string {
  if (value == null) return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return value.trim() || "—";
}

// ---- Live-Kostenschätzung ---------------------------------------------

export type BriefEstimate = {
  /** Basis-Spanne aus Projektart × Design-Faktor (einmalig). */
  baseMin: number;
  baseMax: number;
  /** Spanne aller gewählten Aufpreis-Optionen (einmalig). */
  addOnsMin: number;
  addOnsMax: number;
  /** Gesamte einmalige Richtwert-Spanne. */
  oneTimeMin: number;
  oneTimeMax: number;
  /** Monatliches Hosting als Spanne je Projektart (wie im Preisrechner). */
  hostingMin: number;
  hostingMax: number;
  /** Monatliche Wartung & Pflege als Spanne (optional, aus dem Preisrechner). */
  maintenanceMin: number;
  maintenanceMax: number;
  /** Monatliche Gesamt-Spanne (Hosting + Wartung). */
  monthlyMin: number;
  monthlyMax: number;
};

/**
 * Liefert die Basis-Preisspanne für eine Projektart aus der zentralen
 * Preis-Konfiguration. Unbekannt → [0, 0].
 */
export function baseRangeForProjectType(projectType: string | undefined): [number, number] {
  if (projectType && projectType in PRICING.projectTypes) {
    const base = PRICING.projectTypes[projectType as keyof typeof PRICING.projectTypes].base;
    return [base[0], base[1]];
  }
  return [0, 0];
}

// ---- Projektart-Abgleich (Überschneidungen erkennen) -------------------

export type ProjectTypeKey = keyof typeof PRICING.projectTypes;

/**
 * Vorschlag, die Projektart hochzustufen, weil die Detail-Auswahl im
 * Konfigurator über die aktuell gewählte Projektart hinausgeht (z. B. mehrere
 * Unterseiten bei einem One-Pager oder eine Online-Terminbuchung).
 */
export type ProjectTypeUpgrade = {
  /** Aktuell gewählte (zu kleine) Projektart. */
  current: string;
  /** Vorgeschlagene, zur Auswahl passende Projektart. */
  suggested: ProjectTypeKey;
  /** Lesbares Label der vorgeschlagenen Projektart (für die UI). */
  suggestedLabel: string;
  /** Menschlich lesbare Auslöser ("Online-Terminbuchung", "3 Unterseiten" …). */
  reasons: string[];
};

/** Umfangs-Gewicht je Projektart = oberes Ende der Basis-Spanne. */
function projectTypeWeight(pt: string | undefined): number {
  return pt && pt in PRICING.projectTypes
    ? PRICING.projectTypes[pt as ProjectTypeKey].base[1]
    : 0;
}

/**
 * Erkennt, ob die im Konfigurator getroffene Auswahl eine größere Projektart
 * verlangt, als aktuell gewählt ist. Liefert den passenden Vorschlag oder
 * `null`, wenn die Projektart bereits passt (gleich groß oder größer).
 *
 * Bewusst nicht erzwingend: die Funktion stellt nur fest, was sich überschneidet,
 * die UI entscheidet, ob sie sanft darauf hinweist und die Anpassung anbietet.
 */
export function detectProjectTypeUpgrade(
  data: BriefData,
  summary: BriefSummary,
): ProjectTypeUpgrade | null {
  const current = summary.projectType ?? "onepager";
  const candidates: { type: ProjectTypeKey; reason: string }[] = [];

  // Eigene Unterseiten → Mehrseitige Website (ein One-Pager hat nur eine Seite).
  const pages = Array.isArray(data.pages) ? data.pages : [];
  const extraPages = pages.filter((p) => p !== "Startseite");
  if (extraPages.length > 0) {
    candidates.push({
      type: "website",
      reason: extraPages.length === 1 ? "eine Unterseite" : `${extraPages.length} Unterseiten`,
    });
  }

  // Online-Terminbuchung (als Funktion oder Paket-Feature) → Buchungs-/Terminseite.
  const features = Array.isArray(data.features) ? data.features : [];
  const wantsBooking =
    features.includes("Terminbuchung") || (summary.features ?? []).includes("booking");
  if (wantsBooking) {
    candidates.push({ type: "booking", reason: "Online-Terminbuchung" });
  }

  // Mitgliederbereich / Login → individuelle Web-App.
  if (features.includes("Mitgliederbereich / Login")) {
    candidates.push({ type: "webapp", reason: "Mitgliederbereich / Login" });
  }

  if (candidates.length === 0) return null;

  // Umfangreichste vorgeschlagene Projektart bestimmt das Ziel.
  const suggested = candidates.reduce((a, b) =>
    projectTypeWeight(b.type) > projectTypeWeight(a.type) ? b : a,
  );

  // Passt die aktuelle Projektart bereits? Dann kein Hinweis nötig.
  if (projectTypeWeight(current) >= projectTypeWeight(suggested.type)) return null;

  // Alle Auslöser sammeln, die über die aktuelle Projektart hinausgehen.
  const reasons = candidates
    .filter((c) => projectTypeWeight(c.type) > projectTypeWeight(current))
    .map((c) => c.reason);

  return {
    current,
    suggested: suggested.type,
    suggestedLabel: PRICING.projectTypes[suggested.type].label,
    reasons,
  };
}

const roundEuro = (value: number) => Math.round(value);

/**
 * Berechnet den aktuellen Richtwert als Preisspanne: Basis (Projektart ×
 * Projektart) plus allen gewählten Aufpreis-Optionen des Konfigurators -
 * einmalig und monatlich. Versteckte Felder (showIf nicht erfüllt) zählen nicht
 * mit. Bewusst transparent: Einzelpreise werden in der UI nicht ausgewiesen, der
 * Gesamtwert bleibt aber stets eine unverbindliche Spanne.
 */
export function computeBriefEstimate(data: BriefData, summary: BriefSummary): BriefEstimate {
  const [baseLow, baseHigh] = baseRangeForProjectType(summary.projectType);
  const baseMin = roundEuro(baseLow);
  const baseMax = roundEuro(baseHigh);

  let addOnsMin = 0;
  let addOnsMax = 0;

  for (const step of BRIEF_STEPS) {
    for (const field of step.fields) {
      if (!isFieldVisible(field, data)) continue;
      const value = data[field.name];
      const selected = Array.isArray(value) ? value : value ? [value] : [];
      for (const opt of selected) {
        if (field.prices) {
          const p = field.prices[opt] ?? 0;
          addOnsMin += p;
          addOnsMax += p;
        }
      }
    }
  }

  // Features aus der Paket-Vorauswahl (Content, Terminbuchung, Blog, Branding)
  //, jeweils als eigene Aufpreis-Spanne (flach).
  for (const f of summary.features ?? []) {
    if (f in PRICING.features) {
      const [fMin, fMax] = PRICING.features[f as FeatureKey].price;
      addOnsMin += fMin;
      addOnsMax += fMax;
    }
  }

  // Weitere Sprachen (aus der Paket-Vorauswahl), als Spanne je Sprache.
  const langs = summary.extraLanguages ?? 0;
  addOnsMin += langs * PRICING.extraLanguage.price[0];
  addOnsMax += langs * PRICING.extraLanguage.price[1];

  // Hosting: gleiche Logik wie im Preisrechner – Spanne je Projektart aus
  // `pricing.config.ts`. Entfällt nur, wenn der Kunde bereits eigenes Hosting hat.
  let hostingMin = 0;
  let hostingMax = 0;
  if (
    data.hostingStatus !== "Ja, vorhanden" &&
    summary.projectType &&
    summary.projectType in PRICING.projectTypes
  ) {
    const h = hostingRangeFor(summary.projectType as keyof typeof PRICING.projectTypes);
    hostingMin = h[0];
    hostingMax = h[1];
  }

  // Optionale Wartung aus dem Preisrechner, als eigener, klar getrennter Posten.
  let maintenanceMin = 0;
  let maintenanceMax = 0;
  if (summary.maintenance && summary.projectType && summary.projectType in PRICING.projectTypes) {
    const m = maintenanceRangeFor(summary.projectType as keyof typeof PRICING.projectTypes);
    maintenanceMin = m[0];
    maintenanceMax = m[1];
  }

  return {
    baseMin,
    baseMax,
    addOnsMin,
    addOnsMax,
    oneTimeMin: baseMin + addOnsMin,
    oneTimeMax: baseMax + addOnsMax,
    hostingMin,
    hostingMax,
    maintenanceMin,
    maintenanceMax,
    monthlyMin: hostingMin + maintenanceMin,
    monthlyMax: hostingMax + maintenanceMax,
  };
}
