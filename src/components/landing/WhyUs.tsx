import type { ReactNode } from "react";

/**
 * „Warum wir" – Vertrauens- & USP-Sektion. Bündelt die zentralen
 * Verkaufsargumente von OTIGO Digital. Reine Server Component. Ein dezenter
 * grüner Ambient-Glow lockert die ansonsten sehr dunkle Fläche auf.
 */
type Reason = {
  icon: ReactNode;
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    title: "Beste Performance",
    description:
      "Ladezeiten unter einer Sekunde dank Server-Side-Rendering, Edge-Caching und optimierten Assets. Jede Millisekunde zählt – für Nutzer und Rankings.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Modernste Architektur",
    description:
      "Server-First mit Next.js, TypeScript im Strict Mode und sauberen, typsicheren Datenflüssen. Wartbar, erweiterbar und auf Jahre zukunftsfähig.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Beste SEO-Optimierung",
    description:
      "Technisch sauberes, serverseitig gerendertes HTML, strukturierte Daten und Core-Web-Vitals im grünen Bereich – damit dich deine Kunden bei Google ganz oben finden.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M12 3c2.5 2 5 3 8 3 0 6-2.5 11-8 13C6.5 17 4 12 4 6c3 0 5.5-1 8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Sichere & ausfallsichere Cloud",
    description:
      "Verschlüsselte, serverless gehostete Lösungen auf Vercel & Supabase mit Row-Level-Security, Auto-Scaling und hoher Verfügbarkeit. Deine Daten bleiben geschützt.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M3 17c3-6 7-9 9-9m0 0-3-1m3 1-1 3M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Conversion-starkes UI/UX",
    description:
      "Design, das nicht nur gut aussieht, sondern verkauft. Klare Nutzerführung und durchdachte Call-to-Actions verwandeln Besucher messbar in Kunden.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    title: "Alles aus einer Hand",
    description:
      "Strategie, Design, Entwicklung und Hosting – ein Team, ein Ansprechpartner, ein durchgängiger Prozess. Kein Schnittstellen-Chaos, klare Verantwortung.",
  },
];

export function WhyUs() {
  return (
    <section
      id="warum-wir"
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#04140a] via-black to-black px-6 py-24"
    >
      {/* Dezenter grüner Ambient-Glow gegen die zu dunkle Fläche */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-[#09ed2d]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-14 max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Warum OTIGO Digital
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Was uns zur richtigen Wahl macht
          </h2>
          <p className="mt-4 text-base text-white/60">
            Wir verbinden technische Exzellenz mit messbaren Geschäftsergebnissen –
            damit deine Website nicht nur läuft, sondern arbeitet.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-[#09ed2d]/40 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#09ed2d]/20 bg-[#09ed2d]/10 text-[#09ed2d]">
                {reason.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{reason.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
