import Link from "next/link";
import { FLEET_APP_URL } from "@/lib/tas-fleet";

/**
 * Abschließender Call-to-Action der TAS-FLEET-Seite. Reine Server Component.
 */
export function FleetCta() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-24">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#09ed2d]/30 bg-gradient-to-br from-[#09ed2d]/[0.12] via-white/[0.03] to-[#22d3ee]/[0.1] p-10 text-center sm:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#22d3ee]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#09ed2d]/20 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Bringen Sie Ihre Flotte ins Rollen
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
            Starten Sie noch heute mit TAS-FLEET, ohne Installation, ohne
            Setup-Kosten, jederzeit kündbar. Ihre Disposition wird es Ihnen danken.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={FLEET_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_30px_-6px_rgba(34,211,238,0.7)] transition hover:opacity-90"
            >
              Jetzt starten
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <Link
              href="/#kontakt"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              Beratung anfragen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
