"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PRICING, formatEuro } from "@/lib/pricing";
import { RainbowButton } from "@/components/ui/rainbow-button";

/**
 * Problem & Solution ("Leistungen"): interaktives Showcase statt Feature-Grid.
 * Links wählbare Pain-Points, rechts ein Browser-Mockup, das live zeigt, was
 * die gewählte Leistung konkret bedeutet, das Portfolio nutzt dieselbe
 * Browser-Chrome-Optik, damit sich die Seite wie aus einem Guss anfühlt.
 */
type Pillar = {
  problem: string;
  title: string;
  description: string;
  domain: string;
};

const pillars: Pillar[] = [
  {
    problem: "Schluss mit unprofessionellem Auftritt",
    title: "Deine individuelle Webseite",
    description:
      "Das Herzstück: deine maßgeschneiderte Website, von der Landingpage bis zur mehrseitigen Unternehmensseite. Einzigartiges Design auf deine Marke zugeschnitten.",
    domain: "deinefirma.de",
  },
  {
    problem: "Schluss mit langsamen, veralteten Seiten",
    title: "Performance-First Entwicklung",
    description:
      "Langsame Seiten kosten Kunden und Rankings. Wir bauen mit Next.js & TypeScript blitzschnelle Anwendungen, die in Millisekunden laden.",
    domain: "deinefirma.de · 380ms",
  },
  {
    problem: "Schluss mit Design, das nicht verkauft",
    title: "Conversion-starkes UI/UX",
    description:
      "Schön reicht nicht, es muss verkaufen. Wir gestalten klare, vertrauensbildende Interfaces, die Besucher gezielt zu Anfragen führen.",
    domain: "deinefirma.de/kontakt",
  },
  {
    problem: "Schluss mit fehlender Digitalisierung",
    title: "Automatisierte Prozesse",
    description:
      "Wir digitalisieren deine Abläufe, von der Terminbuchung bis zur Kundenverwaltung. Sicher, DSGVO-konform und jederzeit erweiterbar.",
    domain: "deinefirma.de/dashboard",
  },
];

function BrowserChrome({ domain, children }: { domain: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 truncate rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
          {domain}
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

/** Website-Baukasten-Skizze: Heading, Text, Bildraster, CTA. */
function SiteScene() {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="h-2.5 w-2/3 rounded-full bg-white/25" />
      <span className="h-1.5 w-full rounded-full bg-white/10" />
      <span className="h-1.5 w-4/5 rounded-full bg-white/10" />
      <div className="mt-1.5 grid grid-cols-3 gap-2">
        <span className="h-10 rounded-md bg-white/[0.06]" />
        <span className="h-10 rounded-md bg-white/[0.06]" />
        <span className="h-10 rounded-md bg-white/[0.06]" />
      </div>
      <span className="mt-1.5 h-7 w-28 rounded-full bg-[#09ed2d]/80" />
    </div>
  );
}

/** Performance-Skizze: Ladebalken schnellt auf 100 %, Zeit-Badge. */
function SpeedScene() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-white">0.38</span>
        <span className="text-sm text-white/40">Sekunden bis interaktiv</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.span
          className="block h-full rounded-full bg-[#09ed2d]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex gap-2">
        {["LCP", "CLS", "INP"].map((metric) => (
          <span
            key={metric}
            className="rounded-md border border-[#09ed2d]/25 bg-[#09ed2d]/10 px-2 py-1 text-[11px] font-medium text-[#09ed2d]"
          >
            {metric} ✓
          </span>
        ))}
      </div>
    </div>
  );
}

/** Conversion-Skizze: CTA-Button mit Klick-Ripple und Ergebnis-Badge. */
function ConversionScene() {
  return (
    <div className="flex flex-col gap-4">
      <span className="h-1.5 w-3/4 rounded-full bg-white/10" />
      <div className="relative flex items-center">
        <span className="inline-flex items-center rounded-full bg-[#09ed2d] px-5 py-2 text-sm font-semibold text-black">
          Jetzt anfragen
        </span>
        <motion.span
          aria-hidden="true"
          className="absolute left-8 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border-2 border-[#09ed2d]/60"
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
      <span className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/50">
        +38 % mehr Anfragen im Schnitt
      </span>
    </div>
  );
}

/** Automatisierungs-Skizze: verbundene Knoten, die sich abhaken. */
function AutomationScene() {
  const steps = ["Buchung", "Bestätigung", "Erinnerung"];
  return (
    <div className="flex items-center justify-between gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-2">
            <motion.span
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#09ed2d]/40 bg-[#09ed2d]/10 text-[#09ed2d]"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
            <span className="text-[11px] text-white/40">{step}</span>
          </div>
          {i < steps.length - 1 && <span className="mb-5 h-px flex-1 bg-white/10" />}
        </div>
      ))}
    </div>
  );
}

const scenes = [SiteScene, SpeedScene, ConversionScene, AutomationScene];

export function Services() {
  const [active, setActive] = useState(0);
  const pillar = pillars[active];
  const Scene = scenes[active];

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
            Viele Firmen lassen online unbemerkt Kunden liegen. Wir decken die Fehler auf deiner
            Website auf und beheben sie direkt, zum fairen Festpreis, der weit unter den Preisen
            klassischer Agenturen liegt.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-start md:gap-12">
          <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:gap-1 md:overflow-visible md:border-l md:border-white/10 md:pb-0">
            {pillars.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setActive(i)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-left text-sm font-medium transition md:-ml-px md:w-full md:rounded-none md:border-l-2 md:px-4 md:py-2.5 md:text-base ${
                  active === i
                    ? "bg-[#09ed2d]/10 text-white md:border-[#09ed2d] md:bg-transparent"
                    : "text-white/40 hover:text-white/70 md:border-transparent"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <p className="text-xs text-white/35 line-through decoration-white/20">
                  {pillar.problem}
                </p>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">
                  {pillar.description}
                </p>
                <div className="mt-5">
                  <BrowserChrome domain={pillar.domain}>
                    <Scene />
                  </BrowserChrome>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Preis-USP: klar betonen, dass OTIGO Digital sehr preiswert ist */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-[#09ed2d]/30 bg-gradient-to-br from-[#09ed2d]/[0.12] via-white/[0.03] to-black p-6 sm:p-8">
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
