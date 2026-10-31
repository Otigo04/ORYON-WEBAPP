import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { WhyUs } from "@/components/landing/WhyUs";
import { CaseStudy } from "@/components/landing/CaseStudy";
import { PreisrechnerSection } from "@/components/landing/PreisrechnerSection";
import { Faq } from "@/components/landing/Faq";
import { LeadFunnel } from "@/components/landing/LeadFunnel";
import { Footer } from "@/components/landing/Footer";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/structured-data";
import { faqs } from "@/lib/faq";

/**
 * Öffentliche Startseite (Onepager), Server Component.
 *
 * Aufbau: Navbar (sticky) → Hero → Leistungen → Zusammenarbeit → Case Study →
 * Preisrechner → FAQ → Kontakt. Es gibt bewusst keine Kundenbewertungen und
 * keine Beispiel-Referenzen, solange es keine belegbaren gibt.
 * Client-Inseln: Navbar, Preisrechner und der (nur Desktop) WebGL-Hintergrund.
 * FAQ-JSON-LD ergänzt die globalen Organisation-/Website-Daten aus dem Layout.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <CaseStudy />
        <PreisrechnerSection />
        <Faq />
        <LeadFunnel />
      </main>
      <Footer />
    </>
  );
}
