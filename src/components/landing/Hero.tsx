import BeamsBackground from "@/components/BeamsBackground";
import { LogoMark } from "@/components/Logo";

export function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-black">
      <BeamsBackground />

      {/* Lesbarkeits-Overlay über dem WebGL-Hintergrund */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-28 text-center">
        <div className="mb-7 flex items-center gap-3 text-white/85">
          <LogoMark className="h-8 w-auto sm:h-10" />
          <span className="text-lg font-semibold tracking-[0.22em] sm:text-2xl">
            TAS WEBWORKS
          </span>
        </div>

        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
          <span className="rounded-full bg-[#09ed2d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
            Neu
          </span>
          Agenturqualität schon ab <span className="font-semibold text-white">79€!</span>
        </span>

        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
          <span className="sr-only">TAS Webworks: </span>
          Smarte Web-Lösungen, die dein Unternehmen
          <span className="text-[#09ed2d]"> wachsen lassen.</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
          Agentur-Qualität muss nicht teuer sein. Wir entwickeln atemberaubende,
          SEO-optimierte Websites, Web-Apps und Landingpages zu Preisen, die jedes Budget schonen.
          Jetzt konfigurieren und direkt online berechnen!
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#kontakt"
              className="whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Projekt starten
            </a>
            <a
              href="#leistungen"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Mehr erfahren
            </a>
          </div>
          <a
            href="#referenzen"
            className="rounded-full border border-[#09ed2d]/40 bg-[#09ed2d]/10 px-6 py-3 text-sm font-semibold text-[#09ed2d] backdrop-blur-sm transition hover:bg-[#09ed2d]/20"
          >
            Referenzen ansehen
          </a>
        </div>
      </div>
    </section>
  );
}
