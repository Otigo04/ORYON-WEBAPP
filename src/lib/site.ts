/**
 * Zentrale Stammdaten der Firma & Website.
 *
 * Eine Quelle der Wahrheit für SEO-Metadaten, strukturierte Daten (JSON-LD),
 * Impressum, Datenschutz und Footer.
 *
 * Die Produktions-URL kommt aus `NEXT_PUBLIC_SITE_URL` (z. B. in Vercel setzen),
 * fällt sonst auf die Standard-Domain zurück.
 */
export const siteConfig = {
  name: "TAS Webworks",
  /** Vollständiger rechtlicher Name (Impressum). */
  legalName: "TAS Webworks (Inhaber: Yakup Orhan Tas)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tas-webworks.de",
  description:
    "TAS Webworks ist deine Webagentur aus Berlin für blitzschnelle, SEO-optimierte Websites, Web-Apps und Landingpages. Preiswert, modern und conversion-stark. Richtpreis in 60 Sekunden berechnen.",
  /** Kurze Tagline für OG-Bild & Social. */
  tagline: "Preiswerte Webagentur aus Berlin",
  locale: "de_DE",
  email: "kontakt@tas-webworks.de",
  /** Kontakt-/Impressum-Telefonnummer. */
  telephone: "+49 159 01054910",
  /** Ladungsfähige Anschrift (Impressum § 5 TMG). */
  address: {
    street: "Brunowstr. 10",
    postalCode: "13507",
    city: "Berlin",
    region: "Berlin",
    country: "DE",
  },
  /** Geokoordinaten (Berlin-Reinickendorf, Brunowstraße, für LocalBusiness). */
  geo: { latitude: 52.5876, longitude: 13.2887 },
  /**
   * Bankverbindung für Überweisungen (TAS-FLEET-Rechnungen).
   * PLATZHALTER – durch echte Daten ersetzen, bevor Rechnungen rausgehen.
   */
  bank: {
    accountHolder: "Yakup Orhan Tas",
    iban: "DE00 0000 0000 0000 0000 00",
    bic: "XXXXXXXXXXX",
    bankName: "Bank",
  },
  /**
   * Umsatzsteuer-Identifikationsnummer. `null`, da Kleinunternehmer nach
   * § 19 UStG, es wird keine USt-IdNr. geführt und keine USt. ausgewiesen.
   */
  vatId: null,
  /** Kleinunternehmer-Regelung nach § 19 UStG. */
  smallBusiness: true,
  founder: "Yakup Orhan Tas",
  foundingYear: "2026",
  social: {
    twitter: "@taswebworks",
    linkedin: "https://www.linkedin.com/company/tas-webworks",
    instagram: "https://www.instagram.com/tas.webworks",
  },
} as const;

/** Häufige Service-/SEO-Keywords (Berlin & preiswert betont). */
export const siteKeywords = [
  "Webagentur Berlin",
  "günstige Webagentur",
  "preiswerte Webagentur Berlin",
  "Webdesign Berlin",
  "Website erstellen lassen",
  "Homepage erstellen lassen",
  "Web-App erstellen lassen",
  "Landingpage erstellen",
  "One-Pager Agentur",
  "SEO Optimierung Berlin",
  "Next.js Agentur",
  "Webentwicklung Berlin",
  "professionelle Website günstig",
  "TAS Webworks",
];
