import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { JsonLd } from "@/components/JsonLd";
import { FleetHero } from "@/components/tas-fleet/FleetHero";
import { FleetStats } from "@/components/tas-fleet/FleetStats";
import { FleetFeatures } from "@/components/tas-fleet/FleetFeatures";
import { FleetPricing } from "@/components/tas-fleet/FleetPricing";
import { FleetSocialProof } from "@/components/tas-fleet/FleetSocialProof";
import { FleetFaq } from "@/components/tas-fleet/FleetFaq";
import { FleetCta } from "@/components/tas-fleet/FleetCta";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import { FLEET_APP_URL, FLEET_FAQS, FLEET_TIERS } from "@/lib/tas-fleet";

const PATH = "/leistungen/tas-fleet";
const TITLE = "TAS-FLEET – Fuhrpark- & Dispositionssoftware für Taxi & Mietwagen";
const DESCRIPTION =
  "TAS-FLEET ist die All-in-One-Web-App für Fuhrpark-, Fahrer- und Dispositionsverwaltung. Schichtplanung in Echtzeit, Compliance-Center, OCR-Massenimport und Incident-Log – für Taxi-, Mietwagen- und Shuttle-Betriebe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
  },
};

/** SoftwareApplication-Schema (Rich Results für SaaS) mit Preis-Aggregat. */
function softwareApplicationSchema() {
  const prices = FLEET_TIERS.map((t) => t.monthly).filter((p): p is number => p !== null);
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TAS-FLEET",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${siteConfig.url}${PATH}`,
    description: DESCRIPTION,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: FLEET_TIERS.length,
      url: FLEET_APP_URL,
    },
  };
}

export default function TasFleetPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Start", path: "/" },
          { name: "Leistungen", path: "/#leistungen" },
          { name: "TAS-FLEET", path: PATH },
        ])}
      />
      <JsonLd data={faqSchema(FLEET_FAQS)} />
      <JsonLd data={softwareApplicationSchema()} />

      <Navbar />
      <main>
        {/* Zurück-Link über dem Hero */}
        <div className="absolute left-0 right-0 top-24 z-10 px-6">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/#leistungen"
              className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                <path
                  d="m10 4-4 4 4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Zurück zu den Leistungen
            </Link>
          </div>
        </div>

        <FleetHero />
        <FleetStats />
        <FleetFeatures />
        <FleetPricing />
        <FleetSocialProof />
        <FleetFaq />
        <FleetCta />
      </main>
      <Footer />
    </>
  );
}
