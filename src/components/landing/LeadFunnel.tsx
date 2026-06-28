/**
 * Finaler Lead-Funnel – dedizierte, hochkonvertierende Abschluss-Sektion für
 * den Projektstart. Reine Server Component. Der Preisrechner-Button scrollt zum
 * interaktiven Rechner auf der Landingpage (`#preisrechner`); alternativ ist die
 * direkte Kontaktaufnahme der zweite Conversion-Pfad.
 */
import { RainbowButton } from "@/components/ui/rainbow-button";

const guarantees = [
  "Antwort innerhalb von 24 Stunden",
  "Unverbindliches Erstgespräch",
  "Festpreis statt böser Überraschungen",
];

export function LeadFunnel() {
  return (
    <section id="kontakt" className="border-t border-white/10 bg-black px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#09ed2d]/20 bg-gradient-to-br from-[#09ed2d]/10 via-white/[0.03] to-black px-6 py-14 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#09ed2d]/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
              Projektstart
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Bereit, dein Projekt zu starten?
            </h2>
            <p className="mt-4 text-pretty text-base text-white/70 sm:text-lg">
              Berechne in 60 Sekunden einen unverbindlichen Richtpreis – oder
              schreib uns direkt. Wir melden uns mit konkreten nächsten Schritten.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <RainbowButton asChild size="lg">
                <a href="#preisrechner">Preis berechnen</a>
              </RainbowButton>
              <a
                href="mailto:Kontakt@tas-webworks.de"
                className="w-full rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 sm:w-auto"
              >
                Direkt anfragen
              </a>
            </div>

            <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
              {guarantees.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 flex-none fill-[#09ed2d]" aria-hidden="true">
                    <path d="M8.5 13.6 5 10.1l1.4-1.4 2.1 2.1 5-5L15 7.2z" />
                    <circle cx="10" cy="10" r="9" className="fill-none stroke-[#09ed2d]" strokeWidth="1.2" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
