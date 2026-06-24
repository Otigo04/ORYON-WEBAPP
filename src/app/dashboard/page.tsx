import type { Metadata } from "next";
import Link from "next/link";
import BeamsBackground from "@/components/BeamsBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LiveRefresh } from "@/components/dashboard/LiveRefresh";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  StatusBadge,
  projectTone,
  invoiceTone,
  offerTone,
  conceptTone,
} from "@/components/ui/StatusBadge";
import { getMyLeads, projectTypeLabel } from "@/lib/leads";
import { getMyProfile, firstNameOf } from "@/lib/profile";
import { getMyProjects } from "@/lib/projects";
import { getMyInvoices } from "@/lib/invoices";
import { getMyOffers } from "@/lib/offers";
import { getMyConcepts } from "@/lib/concepts";
import { formatEuro } from "@/lib/pricing";
import {
  computeTotals,
  formatMoney,
  INVOICE_STATUS_LABELS,
  OFFER_STATUS_LABELS,
  CONCEPT_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
} from "@/lib/documents";

export const metadata: Metadata = {
  title: "Dashboard – TAS Webworks",
  description: "Dein persönlicher Bereich: Projekte, Angebote, Rechnungen und Konzepte.",
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function DashboardPage() {
  const [leads, profile, projects, invoices, offers, concepts] = await Promise.all([
    getMyLeads(),
    getMyProfile(),
    getMyProjects(),
    getMyInvoices(),
    getMyOffers(),
    getMyConcepts(),
  ]);

  const firstName = firstNameOf(profile?.full_name);
  const greeting = firstName ? `Willkommen zurück, ${firstName}` : "Willkommen zurück";

  const openInvoices = invoices.filter((i) => i.status === "sent");
  const stats = [
    { label: "Aktive Projekte", value: projects.length || "—", hint: "In Betreuung" },
    { label: "Angebote", value: offers.length || "—", hint: "Für dich erstellt" },
    { label: "Offene Rechnungen", value: openInvoices.length || "—", hint: "Zu begleichen" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <BeamsBackground />
      <LiveRefresh />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/25 to-black" />

      <DashboardHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        <header className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
            Kundenportal
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{greeting}</h1>
          <p className="max-w-xl text-base text-white/70">
            Verfolge deine Projekte live mit, sieh deine Angebote, Rechnungen und Konzepte –
            alles an einem Ort.
          </p>
        </header>

        <section aria-label="Kennzahlen" className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <p className="text-sm text-white/60">{stat.label}</p>
              <p className="mt-2 text-4xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/40">{stat.hint}</p>
            </article>
          ))}
        </section>

        {/* Projekte mit Live-Fortschritt */}
        <Section title="Deine Projekte" hint="Live aktualisiert">
          {projects.length === 0 ? (
            <Empty>
              Aktuell läuft kein Projekt. Sobald wir gemeinsam starten, siehst du hier den
              Fortschritt in Echtzeit.
            </Empty>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/projekte/${p.id}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{p.title}</h3>
                    <StatusBadge label={PROJECT_STATUS_LABELS[p.status]} tone={projectTone(p.status)} />
                  </div>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/50">{p.description}</p>
                  )}
                  <ProgressBar value={p.progress} className="mt-4" />
                </Link>
              ))}
            </div>
          )}
        </Section>

        {/* Angebote */}
        <Section title="Angebote">
          {offers.length === 0 ? (
            <Empty>Noch keine Angebote vorhanden.</Empty>
          ) : (
            <DocList>
              {offers.map((o) => (
                <DocRow
                  key={o.id}
                  href={`/dashboard/angebote/${o.id}`}
                  title={o.title}
                  sub={`${o.number} · ${dateFormatter.format(new Date(o.created_at))}`}
                  amount={formatMoney(computeTotals(o.items, o.tax_rate).gross, o.currency)}
                  badge={<StatusBadge label={OFFER_STATUS_LABELS[o.status]} tone={offerTone(o.status)} />}
                />
              ))}
            </DocList>
          )}
        </Section>

        {/* Rechnungen */}
        <Section title="Rechnungen">
          {invoices.length === 0 ? (
            <Empty>Noch keine Rechnungen vorhanden.</Empty>
          ) : (
            <DocList>
              {invoices.map((inv) => (
                <DocRow
                  key={inv.id}
                  href={`/dashboard/rechnungen/${inv.id}`}
                  title={inv.title}
                  sub={`${inv.number} · ${dateFormatter.format(new Date(inv.issue_date))}`}
                  amount={formatMoney(computeTotals(inv.items, inv.tax_rate).gross, inv.currency)}
                  badge={<StatusBadge label={INVOICE_STATUS_LABELS[inv.status]} tone={invoiceTone(inv.status)} />}
                />
              ))}
            </DocList>
          )}
        </Section>

        {/* Konzepte */}
        <Section title="Konzepte">
          {concepts.length === 0 ? (
            <Empty>Noch keine Konzepte geteilt.</Empty>
          ) : (
            <DocList>
              {concepts.map((c) => (
                <DocRow
                  key={c.id}
                  href={`/dashboard/konzepte/${c.id}`}
                  title={c.title}
                  sub={dateFormatter.format(new Date(c.created_at))}
                  badge={<StatusBadge label={CONCEPT_STATUS_LABELS[c.status]} tone={conceptTone(c.status)} />}
                />
              ))}
            </DocList>
          )}
        </Section>

        {/* Berechnete Angebote aus dem Preisrechner */}
        {leads.length > 0 && (
          <Section title="Deine Preisrechner-Anfragen">
            <DocList>
              {leads.map((lead) => (
                <DocRow
                  key={lead.id}
                  title={projectTypeLabel(lead.project_type)}
                  sub={dateFormatter.format(new Date(lead.created_at))}
                  amount={`${formatEuro(lead.price_min)} – ${formatEuro(lead.price_max)}`}
                />
              ))}
            </DocList>
          </Section>
        )}
      </div>
    </main>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60 backdrop-blur-md">
      {children}
    </div>
  );
}

function DocList({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
      <ul className="divide-y divide-white/10">{children}</ul>
    </div>
  );
}

function DocRow({
  href,
  title,
  sub,
  amount,
  badge,
}: {
  href?: string;
  title: string;
  sub: string;
  amount?: string;
  badge?: React.ReactNode;
}) {
  const inner = (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <p className="truncate font-medium text-white">{title}</p>
        <p className="truncate text-xs text-white/40">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        {amount && <span className="text-sm font-semibold text-emerald-300">{amount}</span>}
        {badge}
      </div>
    </div>
  );
  return <li>{href ? <Link href={href} className="block transition hover:bg-white/[0.04]">{inner}</Link> : inner}</li>;
}
