import { SMALL_BUSINESS_VAT_EXEMPT } from "../../pricing.config";

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
    "TAS Webworks baut Websites, Landingpages und Online-Shops für kleine Unternehmen. Mit dem Preisrechner erhältst du in einer Minute einen unverbindlichen Richtpreis.",
  /** Kurze Tagline für OG-Bild & Social. */
  tagline: "Websites und Online-Shops aus Berlin",
  locale: "de_DE",
  /**
   * Kontakt-E-Mail. Noch kein Postfach eingerichtet → sichtbarer Platzhalter.
   * Sobald es existiert: Adresse eintragen und `hasEmail` auf `true` setzen
   * (aktiviert mailto-Links, JSON-LD und Lead-Benachrichtigung).
   */
  email: "[PLATZHALTER: Kontakt-E-Mail]",
  hasEmail: false,
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
  /** Geokoordinaten (Berlin-Reinickendorf, Brunowstraße – für LocalBusiness). */
  geo: { latitude: 52.5876, longitude: 13.2887 },
  /**
   * Umsatzsteuer-Identifikationsnummer. `null`, da Kleinunternehmer nach
   * § 19 UStG – es wird keine USt-IdNr. geführt und keine USt. ausgewiesen.
   */
  vatId: null,
  /** Kleinunternehmer-Regelung nach § 19 UStG – gesteuert in `pricing.config.ts`. */
  smallBusiness: SMALL_BUSINESS_VAT_EXEMPT,
  founder: "Yakup Orhan Tas",
  foundingYear: "2024",
} as const;

/**
 * Schalter für Inhalte, die erst nach Bestätigung live gehen.
 * `tasFleet`: erst aktivieren, wenn das Produkt nachweislich live ist.
 * `dashboard`: Kundenportal erst freischalten, wenn es Kunden und Inhalte gibt.
 */
export const launchFlags = {
  /** TAS-FLEET-Produktseite + Navigation. */
  tasFleet: false,
  /** Kundenportal (/dashboard, Registrierung, Nav/Footer-Einträge). Code bleibt erhalten. */
  dashboard: false,
  /** Absenden im Konfigurator. Aus, solange es keine Kontakt-E-Mail für Anfragen gibt. */
  configuratorSubmit: false,
} as const;

/**
 * Zielseite nach Login / Passwort-Reset / Link-Bestätigung. Solange das
 * Kundenportal aus ist, gibt es für Kunden kein Ziel – dann zur Startseite.
 */
export const customerHome: string = launchFlags.dashboard ? "/dashboard" : "/";

/**
 * Ziel direkt nach dem Login. Ohne Kundenportal landen alle im Admin-Bereich;
 * Nicht-Admins leitet die Middleware von dort auf `customerHome` um.
 */
export const postLoginPath: string = launchFlags.dashboard ? "/dashboard" : "/admin";

/** Häufige Service-/SEO-Keywords. */
export const siteKeywords = [
  "Webdesigner Berlin",
  "Webdesign Berlin",
  "Website erstellen lassen",
  "Homepage erstellen lassen",
  "Online-Shop erstellen lassen",
  "Landingpage erstellen",
  "One-Pager Webdesign",
  "SEO Optimierung Berlin",
  "Webentwicklung Berlin",
  "TAS Webworks",
];
