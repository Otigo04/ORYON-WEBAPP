/**
 * Branchen-Lösungen von OTIGO Digital.
 *
 * Zentrale Datenquelle für das "Leistungen"-Dropdown in der Navbar sowie für die
 * dynamischen Branchenseiten unter `/branchen/[slug]`. So bleiben Navigation und
 * Landingpages immer synchron.
 */
export type Branche = {
  /** URL-Segment unter /branchen/<slug>. */
  slug: string;
  /** Branche, wird im Dropdown als kleine Überschrift gezeigt. */
  industry: string;
  /** Konkrete OTIGO-Lösung für diese Branche (Card-Titel). */
  solution: string;
  /** Kurzbeschreibung für Dropdown & SEO-Description. */
  description: string;
  /** Headline der Branchenseite. */
  headline: string;
  /** Einleitender Absatz der Branchenseite. */
  intro: string;
  /** Kernleistungen / Bullet-Points der Branchenseite. */
  features: string[];
  /**
   * Optionales Ziel-Link-Override. Ist gesetzt, verlinkt das Leistungen-Menü
   * dorthin statt auf die generische `/branchen/<slug>`-Seite, und es wird
   * keine generische Branchenseite generiert (vermeidet doppelten Content).
   * Genutzt für TAS-FLEET, das eine eigene Produktseite besitzt.
   */
  href?: string;
};

export const branches: Branche[] = [
  {
    slug: "personenbefoerderung",
    industry: "Personenbeförderung",
    solution: "TAS-FLEET: Ihre Flottenlösung",
    description:
      "Digitale Flotten-, Buchungs- und Dispositionsverwaltung für Taxi-, Mietwagen- und Shuttle-Unternehmen.",
    headline: "TAS-FLEET: Die digitale Flottenlösung für die Personenbeförderung",
    intro:
      "Schluss mit Zettelwirtschaft und Telefonchaos. TAS-FLEET bündelt Buchung, Disposition und Abrechnung in einer schnellen, sicheren Web-App, maßgeschneidert für Taxi-, Mietwagen- und Shuttle-Betriebe.",
    features: [
      "Online-Buchung & automatische Disposition",
      "Fahrer-, Fahrzeug- und Schichtverwaltung",
      "Tourenplanung in Echtzeit",
      "Kundenportal mit Rechnungen & Belegen",
    ],
    href: "/leistungen/tas-fleet",
  },
  {
    slug: "handel",
    industry: "Einzel- & Großhandel",
    solution: "Repräsentative Website & Produkt-Schaufenster",
    description:
      "Vom eleganten One-Pager bis zur mehrseitigen Website, die Ihr Sortiment ins beste Licht rückt und Anfragen bringt.",
    headline: "Starke Online-Präsenz für Einzel- und Großhandel",
    intro:
      "Ihre digitale Visitenkarte und Ihr Produkt-Schaufenster: Wir bauen Ihnen eine blitzschnelle, conversion-starke Website, die Ihre Marke und Ihr Sortiment überzeugend präsentiert und Besucher gezielt zu Anfragen führt.",
    features: [
      "Repräsentative Website, die Ihre Marke zeigt",
      "Produkt- & Sortiments-Schaufenster mit klaren Anfrage-Wegen",
      "Direkte Anbindung an WhatsApp & Kontaktformular",
      "SEO-optimiert für lokale & überregionale Reichweite",
    ],
  },
  {
    slug: "handwerk",
    industry: "Handwerk",
    solution: "One-Pager mit Online-Terminbuchung",
    description:
      "Moderne Webpräsenz mit integrierter Terminbuchung. Kunden buchen rund um die Uhr, ganz ohne Telefon.",
    headline: "Moderne Webpräsenz mit Online-Terminbuchung fürs Handwerk",
    intro:
      "Gewinnen Sie Aufträge, während Sie arbeiten. Wir verbinden einen modernen One-Pager mit einer integrierten Online-Terminbuchung, damit Ihre Kunden rund um die Uhr buchen und Sie sich aufs Handwerk konzentrieren.",
    features: [
      "Moderner, mobil-optimierter One-Pager",
      "Integrierte Online-Terminbuchung 24/7",
      "Automatische Termin-Erinnerungen",
      "Galerie für Referenzen & Projekte",
    ],
  },
];

export function getBranche(slug: string): Branche | undefined {
  return branches.find((b) => b.slug === slug);
}

/** Ziel-URL eines Leistungs-Eintrags, eigener `href` oder generische Seite. */
export function brancheHref(branche: Branche): string {
  return branche.href ?? `/branchen/${branche.slug}`;
}
