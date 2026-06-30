"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { BrowserFrame } from "@/components/tas-fleet/BrowserFrame";
import { FLEET_APP_URL, FLEET_DEMO_VIDEO_ID } from "@/lib/tas-fleet";

const SideRays = dynamic(() => import("@/components/backgrounds/SideRays"), { ssr: false });

/**
 * Hero der TAS-FLEET-Produktseite.
 *
 * Client-Insel, weil sie den WebGL-Hintergrund lädt und die Demo-Video-Lightbox
 * steuert. Headline mit Grün→Cyan-Verlauf, zwei CTAs (App-Start extern +
 * Demo-Video) und ein Browser-Mockup des Dashboards.
 */
export function FleetHero() {
  const [videoOpen, setVideoOpen] = useState(false);

  // Scroll sperren, solange die Lightbox offen ist; Escape schließt sie.
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setVideoOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [videoOpen]);

  return (
    <section className="relative overflow-hidden bg-black px-6 pb-20 pt-36">
      {/* WebGL-Strahlen + Cyan-Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <SideRays
          speed={0.9}
          rayColor1="#00ff1a"
          rayColor2="#22d3ee"
          intensity={0.95}
          spread={3}
          origin="top-right"
          tilt={0}
          saturation={10}
          blend={0.6}
          falloff={3}
          opacity={0.4}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-[#22d3ee]/[0.07] blur-[140px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        {/* Text-Spalte */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#09ed2d] shadow-[0_0_8px_rgba(9,237,45,0.8)]" />
            TAS-FLEET · Fuhrpark-Management
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ihre gesamte Flotte.
            <br />
            <span className="bg-gradient-to-r from-[#09ed2d] via-[#5ef08a] to-[#22d3ee] bg-clip-text text-transparent">
              Eine Plattform.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
            Disposition, Fahrer- und Fahrzeugverwaltung, Compliance und Vorfälle -
            TAS-FLEET bündelt den kompletten Betrieb von Taxi-, Mietwagen- und
            Shuttle-Unternehmen in einer schnellen, sicheren Web-App. Schluss mit
            Zettelwirtschaft und Telefonchaos.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={FLEET_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_30px_-6px_rgba(34,211,238,0.7)] transition hover:opacity-90"
            >
              Jetzt starten
              <ArrowIcon className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
            >
              <PlayIcon className="h-4 w-4 text-[#09ed2d]" />
              Demo ansehen
            </button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-white/40">
            <CheckIcon className="h-4 w-4 text-[#09ed2d]" />
            Im Einsatz bei <span className="font-medium text-white/70">ON Mobility</span> · DSGVO-konform gehostet
          </p>
        </div>

        {/* Mockup-Spalte */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#09ed2d]/10 via-transparent to-[#22d3ee]/10 blur-2xl"
          />
          <BrowserFrame
            src="/tas-fleet/screens/dashboard.png"
            alt="TAS-FLEET Dashboard, Flottenübersicht in Echtzeit"
            mock="dashboard"
          />
        </div>
      </div>

      {/* Demo-Video-Lightbox */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="TAS-FLEET Demo-Video"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#070d0b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              aria-label="Video schließen"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <div className="aspect-video w-full">
              {FLEET_DEMO_VIDEO_ID ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${FLEET_DEMO_VIDEO_ID}?autoplay=1&rel=0`}
                  title="TAS-FLEET Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#08120e] to-black text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#09ed2d] to-[#22d3ee]">
                    <PlayIcon className="h-7 w-7 text-black" />
                  </span>
                  <p className="text-lg font-semibold text-white">Demo-Video erscheint in Kürze</p>
                  <p className="max-w-sm text-sm text-white/50">
                    Wir produzieren gerade eine ausführliche Produkt-Demo. Solange
                    können Sie TAS-FLEET direkt live ausprobieren.
                  </p>
                  <a
                    href={FLEET_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex rounded-full bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    Jetzt live testen
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="m5 13 4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
