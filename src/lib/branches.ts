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
  /** Branche – wird im Dropdown als kleine Überschrift gezeigt. */
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
};

export const branches: Branche[] = [
  {
    slug: "personenbefoerderung",
    industry: "Personenbeförderung",
    solution: "OTIGO-FLEET – Ihre Flottenlösung",
    description:
      "Digitale Flotten-, Buchungs- und Dispositionsverwaltung für Taxi-, Mietwagen- und Shuttle-Unternehmen.",
    headline: "OTIGO-FLEET – Die digitale Flottenlösung für die Personenbeförderung",
    intro:
      "Schluss mit Zettelwirtschaft und Telefonchaos. OTIGO-FLEET bündelt Buchung, Disposition und Abrechnung in einer schnellen, sicheren Web-App – maßgeschneidert für Taxi-, Mietwagen- und Shuttle-Betriebe.",
    features: [
      "Online-Buchung & automatische Disposition",
      "Fahrer-, Fahrzeug- und Schichtverwaltung",
      "Tourenplanung in Echtzeit",
      "Kundenportal mit Rechnungen & Belegen",
    ],
  },
  {
    slug: "handel",
    industry: "Einzel- & Großhandel",
    solution: "Ihr eigener One-Pager oder Online-Shop",
    description:
      "Vom repräsentativen One-Pager bis zum vollwertigen Online-Shop mit Zahlungsanbindung und Lagerübersicht.",
    headline: "Online-Präsenz & Shop für Einzel- und Großhandel",
    intro:
      "Ob digitale Visitenkarte oder voller Verkaufskanal: Wir bauen Ihnen eine blitzschnelle, conversion-starke Präsenz – vom eleganten One-Pager bis zum skalierbaren Online-Shop mit Zahlungs- und Warenwirtschaftsanbindung.",
    features: [
      "Repräsentativer One-Pager oder vollwertiger Shop",
      "Sichere Zahlungsanbindung (Stripe & Co.)",
      "Produkt- & Lagerverwaltung",
      "SEO-optimiert für lokale & überregionale Reichweite",
    ],
  },
  {
    slug: "handwerk",
    industry: "Handwerk",
    solution: "One-Pager mit Online-Terminbuchung",
    description:
      "Moderne Webpräsenz mit integrierter Terminbuchung – Kunden buchen rund um die Uhr, ganz ohne Telefon.",
    headline: "Moderne Webpräsenz mit Online-Terminbuchung fürs Handwerk",
    intro:
      "Gewinnen Sie Aufträge, während Sie arbeiten. Wir verbinden einen modernen One-Pager mit einer integrierten Online-Terminbuchung – damit Ihre Kunden rund um die Uhr buchen und Sie sich aufs Handwerk konzentrieren.",
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
