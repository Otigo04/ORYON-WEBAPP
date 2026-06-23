import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Services } from "@/components/landing/Services";
import { WhyUs } from "@/components/landing/WhyUs";
import { Portfolio } from "@/components/landing/Portfolio";
import { Testimonials } from "@/components/landing/Testimonials";
import { PreisrechnerSection } from "@/components/landing/PreisrechnerSection";
import { Faq } from "@/components/landing/Faq";
import { LeadFunnel } from "@/components/landing/LeadFunnel";
import { BrandSection } from "@/components/landing/BrandSection";
import { Footer } from "@/components/landing/Footer";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/structured-data";
import { faqs } from "@/lib/faq";

/**
 * Öffentliche Startseite (Onepager) – Server Component.
 *
 * Conversion-Aufbau: Navbar (sticky) → Hero → Leistungen → Warum wir →
 * Portfolio → Trust-Bar → Social Proof → Preisrechner → FAQ → Lead-Funnel.
 * Einzige Client-Inseln: die sticky Navbar und der WebGL-Hintergrund im Hero.
 * FAQ-JSON-LD ergänzt die globalen Organisation-/Website-Daten aus dem Layout.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <Navbar />
      <main>
        <Hero />
        <BrandSection />
        <Services />
        <WhyUs />
        <Portfolio />
        <TrustBar />
        <Testimonials />
        <PreisrechnerSection />
        <Faq />
        <LeadFunnel />
      </main>
      <Footer />
    </>
  );
}
