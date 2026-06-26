"use client";

import { useState } from "react";
import { FLEET_APP_URL, FLEET_TIERS } from "@/lib/tas-fleet";

/**
 * Preis-Sektion mit drei Tarifen und Monatlich-/Jährlich-Umschalter.
 *
 * Client-Insel wegen des Billing-Toggles. Alle CTAs verlinken extern auf die
 * TAS-FLEET-App; der Enterprise-Tarif führt zum Kontakt-Anker der Hauptseite.
 */
export function FleetPricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="preise" className="relative scroll-mt-28 bg-black px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#22d3ee]">
            Preise
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ein Tarif für jede Flottengröße
          </h2>
          <p className="mt-4 text-base text-white/60">
            Transparent, monatlich kündbar, ohne Setup-Kosten. Sparen Sie 20 % mit
            jährlicher Abrechnung.
          </p>

          {/* Billing-Toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                !yearly ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              Monatlich
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                yearly ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              Jährlich
              <span className="rounded-full bg-[#09ed2d]/20 px-2 py-0.5 text-[11px] font-semibold text-[#09ed2d]">
                −20 %
              </span>
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {FLEET_TIERS.map((tier) => {
            const price = yearly ? tier.yearly : tier.monthly;
            const href = tier.id === "enterprise" ? "/#kontakt" : FLEET_APP_URL;
            const external = tier.id !== "enterprise";

            const isEnterprise = tier.id === "enterprise";

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-2xl p-7 ${
                  isEnterprise
                    ? // Animierter Rainbow-Rahmen: dunkle Füllung auf padding-box,
                      // Regenbogen-Verlauf auf border-box – gleiche Technik wie der
                      // RainbowButton, nur als Karten-Rahmen statt Button.
                      "animate-rainbow border-2 border-transparent bg-[linear-gradient(#0a0a0a,#0a0a0a),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] [background-clip:padding-box,border-box] [background-origin:border-box] shadow-[0_0_50px_-12px_rgba(147,51,234,0.45)]"
                    : tier.featured
                      ? "border-2 border-[#09ed2d]/40 bg-gradient-to-b from-[#09ed2d]/[0.08] to-transparent shadow-[0_0_50px_-12px_rgba(9,237,45,0.4)]"
                      : "border-2 border-white/10 bg-white/[0.03]"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] px-4 py-1 text-xs font-semibold text-black">
                    Beliebtester Tarif
                  </span>
                )}

                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <p className="mt-1 text-sm text-white/50">{tier.tagline}</p>

                <div className="mt-6 flex items-end gap-1.5">
                  <span className="text-4xl font-semibold text-white">{price} €</span>
                  <span className="mb-1 text-sm text-white/50">/ Monat</span>
                </div>
                <p className="mt-1 text-xs text-white/40">
                  {yearly ? "jährlich abgerechnet · " : ""}
                  {tier.vehicles}
                </p>

                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                    tier.featured
                      ? "bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] text-black hover:opacity-90"
                      : "border border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </a>

                <ul className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-7">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#09ed2d]"
                        fill="none"
                      >
                        <path
                          d="m5 13 4 4 10-10"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-white/40">
          Alle Preise zzgl. MwSt. · Jederzeit kündbar · Keine Einrichtungsgebühr
        </p>
      </div>
    </section>
  );
}
