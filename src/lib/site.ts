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
  name: "OTIGO Digital",
  /** Vollständiger rechtlicher Name (Impressum). */
  legalName: "OTIGO Digital (Inhaber: Max Mustermann)",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.otigo-digital.de",
  description:
    "OTIGO Digital ist deine Webagentur aus Berlin für blitzschnelle, SEO-optimierte Websites, Online-Shops und Landingpages – preiswert, modern und conversion-stark. Richtpreis in 60 Sekunden berechnen.",
  /** Kurze Tagline für OG-Bild & Social. */
  tagline: "Preiswerte Webagentur aus Berlin",
  locale: "de_DE",
  email: "hello@otigo-digital.de",
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
    twitter: "@otigodigital",
    linkedin: "https://www.linkedin.com/company/otigo-digital",
    instagram: "https://www.instagram.com/otigo.digital",
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
  "OTIGO Digital",
];
