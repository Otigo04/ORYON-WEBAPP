"use client";

import { useState } from "react";

type Reason = {
  title: string;
  metric: string;
  description: string;
  details: string;
};

const reasons: Reason[] = [
  {
    title: "Berliner Unternehmen",
    metric: "Antwort < 24h",
    description:
      "Du hast immer einen echten Ansprechpartner in Berlin, kein Ticket-System, kein Callcenter. Schnelle Antworten per E-Mail und Lead-Videos, in denen wir dir alles direkt zeigen.",
    details:
      "Regionale Präsenz kombiniert mit moderner Cloud-Infrastruktur. Direkter Draht zum Entwicklungsteam per E-Mail, kein Outsourcing ins Ausland.",
  },
  {
    title: "Blitzschnelle Ladezeiten",
    metric: "Ladezeit < 1s",
    description:
      "Deine Website öffnet sich in unter einer Sekunde, so verlieren Besucher keine Geduld und kaufen lieber bei dir ein.",
    details:
      "Server-Side Rendering, Edge-Caching und optimierte Assets sorgen für Ladezeiten unter 1 s und grüne Core Web Vitals.",
  },
  {
    title: "Zukunftssichere Technik",
    metric: "Next.js · TS",
    description:
      "Wir bauen mit Technologie, die noch in fünf Jahren einwandfrei funktioniert! Kein teurer Umbau, keine veralteten Systeme.",
    details:
      "Next.js App Router, TypeScript Strict Mode und saubere, typsichere Datenflüsse garantieren langfristige Wartbarkeit und einfache Erweiterungen.",
  },
  {
    title: "Mehr Kunden über Google",
    metric: "SEO-optimiert",
    description:
      "Wir sorgen dafür, dass dich deine Kunden bei Google finden. Ohne teure Werbeanzeigen, einfach durch bessere Technik.",
    details:
      "Technisch sauberes, serverseitig gerendertes HTML, strukturierte Daten (Schema.org) und grüne Core Web Vitals optimieren dein organisches Ranking.",
  },
  {
    title: "Immer online & sicher",
    metric: "Uptime 24/7",
    description:
      "Deine Website ist rund um die Uhr erreichbar und alle Kundendaten sind sicher geschützt. Automatisch und ohne extra Aufwand für dich.",
    details:
      "Serverless-Hosting auf Vercel & Supabase mit Auto-Scaling, Row-Level Security und Ende-zu-Ende-Verschlüsselung für höchste Verfügbarkeit.",
  },
  {
    title: "Design, das verkauft",
    metric: "Conversion-UI",
    description:
      "Wir gestalten deine Website so, dass aus Besuchern echte Kunden werden, durch klares Design und den richtigen ersten Eindruck.",
    details:
      "Datengetriebenes UI/UX, durchdachte Call-to-Actions und Conversion-Funnels, die messbar mehr Anfragen und Käufe generieren.",
  },
  {
    title: "Alles aus einer Hand",
    metric: "1 Ansprechpartner",
    description:
      "Von der ersten Idee bis zur fertigen Website: ein Team, ein Ansprechpartner, kein Chaos. Du musst nichts koordinieren.",
    details:
      "Integrierter Prozess aus Strategie, Design, Entwicklung und Hosting, keine Schnittstellen zwischen Dienstleistern, klare Verantwortung.",
  },
  {
    title: "Transparente Festpreise",
    metric: "Fixpreis, kein h-Satz",
    description:
      "Keine versteckten Kosten oder böse Überraschungen. Mit unserem interaktiven Preisrechner kalkulierst du dein Budget vorab und weißt von Tag eins an exakt, woran du bist.",
    details:
      "Dynamische Kostenkalkulation in Echtzeit. Feste Projektpakete statt stündlicher Abrechnungen, Planungssicherheit vom ersten Klick an.",
  },
  {
    title: "Automatisierte Prozesse",
    metric: "0 Zettelchaos",
    description:
      "Wir beenden das Zettelchaos. Ob digitale Terminbuchung, Mitarbeiter-Dashboard oder Planungs-App, wir digitalisieren und vereinfachen deinen Arbeitsalltag spürbar.",
    details:
      "Maßgeschneiderte Web-Apps mit Next.js. Automatische Workflows ersetzen manuelle Schritte und sparen deinem Team täglich wertvolle Zeit.",
  },
];

function WhyUsRow({ reason }: { reason: Reason }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-3 py-5">
      <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[#09ed2d]" fill="none" aria-hidden="true">
        <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <h3 className="text-base font-semibold text-white">{reason.title}</h3>
          <span className="text-xs font-medium text-[#09ed2d]/70">{reason.metric}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-white/55">{reason.description}</p>

        {open && (
          <p className="mt-2 max-w-md text-xs leading-relaxed text-white/35">{reason.details}</p>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="mt-1.5 text-xs font-medium text-white/30 underline decoration-white/15 underline-offset-2 transition hover:text-[#09ed2d] hover:decoration-[#09ed2d]/40"
          aria-expanded={open}
        >
          {open ? "weniger" : "mehr dazu"}
        </button>
      </div>
    </div>
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
            Warum TAS Webworks
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Was uns zur richtigen Wahl macht
          </h2>
          <p className="mt-4 text-base text-white/60">
            Wir kümmern uns um alles Technische, damit du dich auf dein
            Geschäft konzentrieren kannst und deine Website für dich arbeitet.
          </p>
        </header>

        <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-2 sm:gap-x-12 sm:divide-y-0 lg:grid-cols-3">
          {reasons.map((reason) => (
            <WhyUsRow key={reason.title} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
