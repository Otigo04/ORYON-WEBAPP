import BeamsBackground from "@/components/BeamsBackground";
import { LogoMark } from "@/components/Logo";
import { ENTRY_PRICE, PRICING, formatEuro } from "@/lib/pricing";

export function Hero() {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-black">
      <BeamsBackground />

      {/* Lesbarkeits-Overlay über dem Hintergrund */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/20 to-black"
      />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-6 py-28 text-center">
        <div className="mb-8 flex items-center gap-3 text-white/85">
          <LogoMark className="h-8 w-auto sm:h-10" />
          <span className="text-lg font-semibold tracking-[0.22em] sm:text-2xl">
            TAS WEBWORKS
          </span>
        </div>

        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
          <span className="sr-only">TAS Webworks – </span>
          Websites und Online-Shops
          <span className="text-[#09ed2d]"> für kleine Unternehmen.</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base text-white/70 sm:text-lg">
          Ich plane, gestalte und programmiere deine Seite selbst – von der ersten
          Skizze bis zum Livegang. Im Preisrechner siehst du in einer Minute,
          womit du ungefähr rechnen musst.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#preisrechner"
            className="whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Preis berechnen
          </a>
          <a
            href="#leistungen"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Leistungen ansehen
          </a>
        </div>

        <p className="mt-8 text-xs text-white/50">
          Einstieg ab {formatEuro(ENTRY_PRICE)} (One-Pager) · {PRICING.vatNote}
        </p>
      </div>
    </section>
  );
}
