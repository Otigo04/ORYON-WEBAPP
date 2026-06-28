import type { ReactNode } from "react";
import { PRICING, formatEuro } from "@/lib/pricing";
import { RainbowButton } from "@/components/ui/rainbow-button";

/**
 * Problem & Solution ("Leistungen") – holt den Kunden bei seinen Pain-Points ab
 * und stellt OTIGO Digital als die Lösung dar. Reine Server Component.
 * Betont zusätzlich prominent den USP: Agentur-Qualität zum kleinen Preis.
 */
type Pillar = {
  icon: ReactNode;
  problem: string;
  title: string;
  description: string;
};

const pillars: Pillar[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="6" cy="7" r="0.6" fill="currentColor" />
      </svg>
    ),
    problem: "Kein professioneller Online-Auftritt",
    title: "Deine individuelle Webseite",
    description:
      "Das Herzstück: deine maßgeschneiderte Website – von der Landingpage bis zur mehrseitigen Unternehmensseite. Einzigartiges Design auf deine Marke zugeschnitten, blitzschnell und SEO-stark.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
    problem: "Langsame, veraltete Systeme",
    title: "Performance-First Entwicklung",
    description:
      "Alte Seiten kosten Kunden und Rankings. Wir bauen mit Next.js & TypeScript blitzschnelle Anwendungen, die in Millisekunden laden und top in Google ranken.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9h18M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    problem: "Design, das nicht konvertiert",
    title: "Conversion-starkes UI/UX",
    description:
      "Schön reicht nicht – es muss verkaufen. Wir gestalten klare, vertrauensbildende Interfaces, die Besucher gezielt zu Anfragen und Abschlüssen führen.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path
          d="M12 3c2.5 2 5 3 8 3 0 6-2.5 11-8 13C6.5 17 4 12 4 6c3 0 5.5-1 8-3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    problem: "Fehlende Digitalisierung & Skalierung",
    title: "Automatisierte Prozesse",
    description:
      "Wir digitalisieren deine Abläufe, von der Terminbuchung bis zur Kundenverwaltung. Sicher, DSGVO-konform und jederzeit erweiterbar.",
  },
];

export function Services() {
  return (
    <section
      id="leistungen"
      className="relative overflow-hidden bg-gradient-to-b from-black via-[#03100a] to-black px-6 py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#09ed2d]/[0.07] blur-[120px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <header className="mb-14 max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Leistungen
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Deine Herausforderung. Unsere Lösung.
          </h2>
          <p className="mt-4 text-base text-white/60">
            Viele Firmen lassen online unbemerkt Kunden liegen. Wir decken die Fehler auf deiner Website auf und beheben sie direkt. 
            Das Ganze läuft komplett transparent zum fairen Festpreis, der weit unter den Preisen klassischer Agenturen liegt.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#09ed2d]/40 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black text-[#09ed2d]">
                {pillar.icon}
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                {pillar.problem}
              </p>
              <h3 className="mt-1.5 text-lg font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>

        {/* Preis-USP: klar betonen, dass OTIGO Digital sehr preiswert ist */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#09ed2d]/30 bg-gradient-to-br from-[#09ed2d]/[0.12] via-white/[0.03] to-black p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#09ed2d]/20 blur-3xl"
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#09ed2d]/30 bg-[#09ed2d]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#09ed2d]">
                Unschlagbar preiswert
              </span>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                Agentur-Qualität zum fairen Festpreis! schon ab{" "}
                <span className="text-[#09ed2d]">
                  {formatEuro(
                    PRICING.projectTypes.onepager.base[0] *
                      PRICING.designMultiplier.template,
                  )}
                </span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Schlanke Prozesse und modernste Technik machen es möglich: Wir geben unsere Kostenvorteile direkt 
                an dich weiter. Das bedeutet für dich kein Chaos bei den Stunden und keine versteckten Kosten,
                sondern absolut transparente Festpreise.
              </p>
            </div>
            <RainbowButton asChild>
              <a href="#preisrechner">Preis in 60 Sek. berechnen</a>
            </RainbowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
