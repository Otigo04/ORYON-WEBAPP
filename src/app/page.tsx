import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Services } from "@/components/landing/Services";
import { WhyUs } from "@/components/landing/WhyUs";
import { Portfolio } from "@/components/landing/Portfolio";
import { Testimonials } from "@/components/landing/Testimonials";
import { PreisrechnerSection } from "@/components/landing/PreisrechnerSection";
import { LeadFunnel } from "@/components/landing/LeadFunnel";
import { Footer } from "@/components/landing/Footer";

/**
 * Öffentliche Startseite (Onepager) – Server Component.
 *
 * Conversion-Aufbau: Navbar (sticky) → Hero → Trust-Bar → Problem & Solution →
 * Warum wir → Portfolio → Social Proof → Lead-Funnel → Footer.
 * Einzige Client-Inseln: die sticky Navbar und der WebGL-Hintergrund im Hero.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Portfolio />
        <TrustBar />
        <Testimonials />
        <PreisrechnerSection />
        <LeadFunnel />
      </main>
      <Footer />
    </>
  );
}
