import type { Metadata } from "next";
import BeamsBackground from "@/components/BeamsBackground";
import { getMyLeads, projectTypeLabel } from "@/lib/leads";
import { formatEuro } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Dashboard – OTIGO Digital",
  description: "Dein persönlicher Bereich: Angebote, Leads und Projektübersicht.",
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/**
 * Kunden-Dashboard (geschützter Bereich).
 *
 * Server Component: Die UI wird serverseitig gerendert, lediglich der
 * WebGL-Hintergrund (<BeamsBackground />) ist eine Client-Insel. Sobald
 * Supabase-Auth steht, werden hier per `createClient()` (server) die Daten
 * des eingeloggten Nutzers via RLS abgesichert geladen.
 */
export default async function DashboardPage() {
  const leads = await getMyLeads();

  const stats = [
    {
      label: "Aktive Leads",
      value: leads.length > 0 ? String(leads.length) : "—",
      hint: "Aus dem Preisrechner",
    },
    {
      label: "Berechnete Angebote",
      value: leads.length > 0 ? String(leads.length) : "—",
      hint: "Insgesamt",
    },
    { label: "Offene Projekte", value: "—", hint: "In Bearbeitung" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <BeamsBackground />

      {/* Lesbarkeits-Overlay über dem WebGL-Hintergrund */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
            OTIGO Digital
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Willkommen zurück
          </h1>
          <p className="max-w-xl text-base text-white/70">
            Hier findest du deine berechneten Angebote, eingegangenen Leads und
            den Status deiner Projekte – alles an einem Ort.
          </p>
        </header>

        <section
          aria-label="Kennzahlen"
          className="grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10"
            >
              <p className="text-sm text-white/60">{stat.label}</p>
              <p className="mt-2 text-4xl font-semibold text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/40">{stat.hint}</p>
            </article>
          ))}
        </section>

        <section
          aria-label="Letzte Angebote"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Deine letzten Angebote</h2>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              MVP
            </span>
          </div>

          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-white/60">
              Noch keine Angebote vorhanden. Sobald du den Preisrechner nutzt,
              erscheinen deine berechneten Angebote hier – abgesichert durch
              Supabase Row Level Security.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-white/10">
              {leads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {projectTypeLabel(lead.project_type)}
                    </span>
                    <span className="text-xs text-white/40">
                      {dateFormatter.format(new Date(lead.created_at))}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    {formatEuro(lead.price_min)} – {formatEuro(lead.price_max)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
