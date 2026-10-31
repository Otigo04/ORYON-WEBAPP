/**
 * Branchen-Lösungen von TAS Webworks.
 *
 * Zentrale Datenquelle für das "Leistungen"-Dropdown in der Navbar sowie für die
 * dynamischen Branchenseiten unter `/branchen/[slug]`. So bleiben Navigation und
 * Landingpages immer synchron.
 */
import { launchFlags } from "@/lib/site";

export type Branche = {
  /** URL-Segment unter /branchen/<slug>. */
  slug: string;
  /** Branche, wird im Dropdown als kleine Überschrift gezeigt. */
  industry: string;
  /** Konkrete Lösung für diese Branche (Card-Titel). */
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

const allBranches: Branche[] = [
  {
    slug: "personenbefoerderung",
    industry: "Personenbeförderung",
    solution: "TAS-FLEET: deine Flottenlösung",
    description:
      "Digitale Flotten-, Buchungs- und Dispositionsverwaltung für Taxi-, Mietwagen- und Shuttle-Unternehmen.",
    headline: "TAS-FLEET: Die digitale Flottenlösung für die Personenbeförderung",
    intro:
      "Schluss mit Zettelwirtschaft und Telefonchaos. TAS-FLEET bündelt Buchung, Disposition und Abrechnung in einer Web-App für Taxi-, Mietwagen- und Shuttle-Betriebe.",
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
    solution: "Website & Produkt-Schaufenster",
    description:
      "Vom One-Pager bis zur mehrseitigen Website, die dein Sortiment zeigt und Anfragen ermöglicht.",
    headline: "Online-Präsenz für Einzel- und Großhandel",
    intro:
      "Digitale Visitenkarte und Produkt-Schaufenster in einem: Ich baue dir eine Website, die dein Geschäft und dein Sortiment verständlich zeigt und Kunden klare Wege zur Anfrage gibt.",
    features: [
      "Website, die deine Marke und dein Sortiment zeigt",
      "Produkt- und Sortiments-Schaufenster mit klaren Anfrage-Wegen",
      "Anbindung an WhatsApp und Kontaktformular",
      "Grundlegende SEO für lokale und überregionale Suche",
    ],
  },
  {
    slug: "handwerk",
    industry: "Handwerk",
    solution: "One-Pager mit Online-Terminbuchung",
    description:
      "Webpräsenz mit integrierter Terminbuchung – Kunden können Termine online anfragen, auch außerhalb deiner Arbeitszeit.",
    headline: "Moderne Webpräsenz mit Online-Terminbuchung fürs Handwerk",
    intro:
      "Kunden finden dich online und buchen direkt einen Termin, während du auf der Baustelle bist. Ich verbinde einen One-Pager mit einer Online-Terminbuchung, damit du dich aufs Handwerk konzentrieren kannst.",
    features: [
      "One-Pager für Handy und Desktop",
      "Integrierte Online-Terminbuchung",
      "Automatische Termin-Erinnerungen",
      "Galerie für deine Arbeiten",
    ],
  },
];

/**
 * Sichtbare Branchen. TAS-FLEET erscheint erst, wenn `launchFlags.tasFleet`
 * aktiv ist (siehe `src/lib/site.ts`).
 */
export const branches: Branche[] = allBranches.filter(
  (b) => launchFlags.tasFleet || b.href !== "/leistungen/tas-fleet",
);

export function getBranche(slug: string): Branche | undefined {
  return branches.find((b) => b.slug === slug);
}

/** Ziel-URL eines Leistungs-Eintrags, eigener `href` oder generische Seite. */
export function brancheHref(branche: Branche): string {
  return branche.href ?? `/branchen/${branche.slug}`;
}
