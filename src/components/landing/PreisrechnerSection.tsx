import { Preisrechner } from "@/components/landing/Preisrechner";
import { PRICING } from "@/lib/pricing";

/**
 * Preisrechner-Sektion der Landingpage.
 *
 * Server Component, die nur den (statischen) Rahmen rendert; der interaktive
 * Rechner selbst ist die einzige Client-Insel. Bewusst keine eigene Route –
 * der Kunde kalkuliert direkt auf der Startseite (Anker `#preisrechner`).
 */
export function PreisrechnerSection() {
  return (
    <section
      id="preisrechner"
      className="border-t border-white/10 bg-black px-4 py-20 scroll-mt-28 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Was kostet dein Projekt?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Stell dir dein Paket zusammen und sieh direkt, wo du preislich ungefähr
            liegst. Mit „Weiter kalkulieren“ kommst du zum Detail-Konfigurator – deine
            Auswahl wird dorthin übernommen und lässt sich jederzeit ändern.
          </p>
          <p className="mt-3 text-sm text-white/40">{PRICING.vatNote}</p>
        </header>

        <Preisrechner />
      </div>
    </section>
  );
}
