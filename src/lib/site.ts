/**
 * Zentrale Stammdaten der Firma & Website.
 *
 * Eine Quelle der Wahrheit für SEO-Metadaten, strukturierte Daten (JSON-LD),
 * Impressum, Datenschutz und Footer. Die rechtlichen Angaben sind aktuell
 * **Platzhalter** – vor dem Live-Gang durch echte Daten ersetzen.
 *
 * Die Produktions-URL kommt aus `NEXT_PUBLIC_SITE_URL` (z. B. in Vercel setzen),
 * fällt sonst auf die Standard-Domain zurück.
 */
export const siteConfig = {
  name: "TAS Webworks",
  /** Vollständiger rechtlicher Name (Impressum). */
  legalName: "TAS Webworks (Inhaber: Max Mustermann)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tas-webworks.de",
  description:
    "TAS Webworks ist deine Webagentur aus Berlin für blitzschnelle, SEO-optimierte Websites, Online-Shops und Landingpages – preiswert, modern und conversion-stark. Richtpreis in 60 Sekunden berechnen.",
  /** Kurze Tagline für OG-Bild & Social. */
  tagline: "Preiswerte Webagentur aus Berlin",
  locale: "de_DE",
  email: "hello@tas-webworks.de",
  /** Platzhalter-Telefonnummer (Impressum/Kontakt). */
  telephone: "+49 30 1234567",
  /** Platzhalter-Anschrift (Berlin). */
  address: {
    street: "Musterstraße 1",
    postalCode: "10115",
    city: "Berlin",
    region: "Berlin",
    country: "DE",
  },
  /** Geokoordinaten (Berlin Mitte – Platzhalter, für LocalBusiness). */
  geo: { latitude: 52.531677, longitude: 13.381777 },
  /** Platzhalter – im Impressum / DSGVO ersetzen. */
  vatId: "DE000000000",
  founder: "Max Mustermann",
  foundingYear: "2024",
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
  "Online-Shop erstellen lassen",
  "Landingpage erstellen",
  "One-Pager Agentur",
  "SEO Optimierung Berlin",
  "Next.js Agentur",
  "Webentwicklung Berlin",
  "professionelle Website günstig",
  "TAS Webworks",
];
