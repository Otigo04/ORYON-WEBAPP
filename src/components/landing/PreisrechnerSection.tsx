import { Preisrechner } from "@/components/landing/Preisrechner";

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
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-black via-[#03100a] to-black px-4 py-20 scroll-mt-28 sm:px-6 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#09ed2d]/[0.07] blur-[120px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Preisrechner
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Was kostet dein Projekt?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            Stell dir dein Paket zusammen – der Richtpreis aktualisiert sich live.
            Fordere mit einem Klick dein unverbindliches Angebot an.
          </p>
        </header>

        <Preisrechner />
      </div>
    </section>
  );
}
