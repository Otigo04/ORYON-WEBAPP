/**
 * Builder für schema.org-JSON-LD (strukturierte Daten).
 *
 * Zentralisiert, damit Marken-/Kontaktdaten konsistent zu `siteConfig` bleiben.
 * Genutzt für: Organisation/lokales Unternehmen (Knowledge Graph + lokale
 * Suche in Berlin), Website (Sitelinks-Suchfeld), FAQ (Rich Results) und
 * Breadcrumbs (Navigationspfade in den SERPs).
 */
import { siteConfig } from "@/lib/site";

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

/** TAS Webworks als lokales Unternehmen (Berlin) – Basis für Knowledge Graph. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.telephone,
    image: `${siteConfig.url}/logo/otigo-wordmark.svg`,
    logo: `${siteConfig.url}/logo/otigo-mark.svg`,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    foundingDate: siteConfig.foundingYear,
    areaServed: [
      { "@type": "City", name: "Berlin" },
      { "@type": "Country", name: "Deutschland" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    priceRange: "€€",
    sameAs: [siteConfig.social.linkedin, siteConfig.social.instagram],
    knowsAbout: [
      "Webentwicklung",
      "Webdesign",
      "Suchmaschinenoptimierung (SEO)",
      "Online-Shops",
      "Landingpages",
      "Next.js",
    ],
  };
}

/** Website-Entität mit Sitelinks-Suchfeld-Potenzial. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "de-DE",
    publisher: { "@id": ORG_ID },
  };
}

/** FAQ für Rich Results – beantwortet typische Kundenfragen (inkl. Preis). */
export function faqSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Breadcrumb-Pfad für Unterseiten (Branchen, Impressum …). */
export function breadcrumbSchema(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
