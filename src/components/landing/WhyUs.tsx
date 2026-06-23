"use client";

import { useState, type ReactNode } from "react";

type Reason = {
  icon: ReactNode;
  title: string;
  description: string;
  details: string;
};

const reasons: Reason[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
    title: "Berliner Unternehmen",
    description:
      "Du hast immer einen echten Ansprechpartner in Berlin – kein Ticket-System, kein Callcenter. Persönliche Termine und kurze Wege inklusive.",
    details:
      "Regionale Präsenz kombiniert mit moderner Cloud-Infrastruktur. Direkter Draht zum Entwicklungsteam, kein Outsourcing ins Ausland.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    title: "Blitzschnelle Ladezeiten",
    description:
      "Deine Website öffnet sich in unter einer Sekunde – so verlieren Besucher keine Geduld und kaufen lieber bei dir ein.",
    details:
      "Server-Side Rendering, Edge-Caching und optimierte Assets sorgen für Ladezeiten unter 1 s und grüne Core Web Vitals.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Zukunftssichere Technik",
    description:
      "Wir bauen mit Technologie, die noch in fünf Jahren einwandfrei funktioniert – kein teurer Umbau, keine veralteten Systeme.",
    details:
      "Next.js App Router, TypeScript Strict Mode und saubere, typsichere Datenflüsse garantieren langfristige Wartbarkeit und einfache Erweiterungen.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Mehr Kunden über Google",
    description:
      "Wir sorgen dafür, dass dich deine Kunden bei Google finden – ohne teure Werbeanzeigen, einfach durch bessere Technik.",
    details:
      "Technisch sauberes, serverseitig gerendertes HTML, strukturierte Daten (Schema.org) und grüne Core Web Vitals optimieren dein organisches Ranking.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M12 3c2.5 2 5 3 8 3 0 6-2.5 11-8 13C6.5 17 4 12 4 6c3 0 5.5-1 8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Immer online & sicher",
    description:
      "Deine Website ist rund um die Uhr erreichbar und alle Kundendaten sind sicher geschützt – automatisch und ohne extra Aufwand für dich.",
    details:
      "Serverless-Hosting auf Vercel & Supabase mit Auto-Scaling, Row-Level Security und Ende-zu-Ende-Verschlüsselung – höchste Verfügbarkeit garantiert.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M3 17c3-6 7-9 9-9m0 0-3-1m3 1-1 3M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Design, das verkauft",
    description:
      "Wir gestalten deine Website so, dass aus Besuchern echte Kunden werden – durch klares Design und den richtigen ersten Eindruck.",
    details:
      "Datengetriebenes UI/UX, durchdachte Call-to-Actions und Conversion-Funnels, die messbar mehr Anfragen und Käufe generieren.",
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
      "Von der ersten Idee bis zur fertigen Website – ein Team, ein Ansprechpartner, kein Chaos. Du musst nichts koordinieren.",
    details:
      "Integrierter Prozess aus Strategie, Design, Entwicklung und Hosting – keine Schnittstellen zwischen Dienstleistern, klare Verantwortung.",
  },
];

function WhyUsCard({ reason }: { reason: Reason }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-[#09ed2d]/40 hover:bg-white/[0.07]">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#09ed2d]/20 bg-[#09ed2d]/10 text-[#09ed2d]">
        {reason.icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{reason.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{reason.description}</p>

      {open && (
        <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs leading-relaxed text-white/40">
          {reason.details}
        </p>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="mt-4 flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/40 transition hover:border-white/20 hover:text-white/60"
        aria-expanded={open}
      >
        {open ? "Weniger" : "Tech-Details"}
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </article>
  );
}

export function WhyUs() {
  return (
    <section
      id="warum-wir"
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#04140a] via-black to-black px-6 py-24"
    >
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
            Wir kümmern uns um alles Technische – damit du dich auf dein
            Geschäft konzentrieren kannst und deine Website für dich arbeitet.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <WhyUsCard key={reason.title} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
