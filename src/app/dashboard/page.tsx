import type { Metadata } from "next";
import Link from "next/link";
import SideRaysBackground from "@/components/backgrounds/SideRaysBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { LiveRefresh } from "@/components/dashboard/LiveRefresh";
import { ActivityFeed, type ActivityItem } from "@/components/dashboard/ActivityFeed";
import { ExpandableList, ExpandableGrid } from "@/components/dashboard/Expandable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  StatusBadge,
  projectTone,
  invoiceTone,
  offerTone,
  conceptTone,
  leadTone,
} from "@/components/ui/StatusBadge";
import { projectTypeLabel } from "@/lib/leads";
import { getMyBriefs, BRIEF_STATUS_LABELS } from "@/lib/briefs";
import type { ProjectType } from "@/lib/pricing";
import { getMyProfile, firstNameOf } from "@/lib/profile";
import { getMyProjects } from "@/lib/projects";
import { getMyInvoices } from "@/lib/invoices";
import { getMyOffers } from "@/lib/offers";
import { getMyConcepts } from "@/lib/concepts";
import { isAdmin } from "@/lib/auth";
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
  title: "Dashboard, TAS Webworks",
  description: "Dein persönlicher Bereich: Projekte, Angebote, Rechnungen und Konzepte.",
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

type NextStep = {
  id: string;
  label: string;
  hint: string;
  href: string;
  cta: string;
};

export default async function DashboardPage() {
  const [briefs, profile, projects, invoices, offers, concepts, admin] = await Promise.all([
    getMyBriefs(),
    getMyProfile(),
    getMyProjects(),
    getMyInvoices(),
    getMyOffers(),
    getMyConcepts(),
    isAdmin(),
  ]);

  const firstName = firstNameOf(profile?.full_name);
  const greeting = firstName ? `Willkommen zurück, ${firstName}` : "Willkommen zurück";

  const openInvoices = invoices.filter((i) => i.status === "sent");
  // Nur Kennzahlen mit echtem Wert zeigen, damit das Dashboard nicht mit
  // leeren „—"-Karten überladen wirkt.
  const stats = [
    { label: "Aktive Projekte", value: projects.length, hint: "In Betreuung" },
    { label: "Angebote", value: offers.length, hint: "Für dich erstellt" },
    { label: "Offene Rechnungen", value: openInvoices.length, hint: "Zu begleichen" },
  ].filter((s) => s.value > 0);

  // --- Aktivitäts-Feed: alle Ereignisse zusammenführen, neueste zuerst -------
  const activity: ActivityItem[] = [
    ...offers.map((o) => ({
      id: `o-${o.id}`,
      kind: "offer" as const,
      title: o.title,
      sub: `${o.number} · ${OFFER_STATUS_LABELS[o.status]}`,
      href: `/dashboard/angebote/${o.id}`,
      date: o.created_at,
    })),
    ...invoices.map((inv) => ({
      id: `i-${inv.id}`,
      kind: "invoice" as const,
      title: inv.title,
      sub: `${inv.number} · ${INVOICE_STATUS_LABELS[inv.status]}`,
      href: `/dashboard/rechnungen/${inv.id}`,
      date: inv.issue_date,
    })),
    ...projects.map((p) => ({
      id: `p-${p.id}`,
      kind: "project" as const,
      title: p.title,
      sub: `${PROJECT_STATUS_LABELS[p.status]} · ${p.progress}%`,
      href: `/dashboard/projekte/${p.id}`,
      date: p.updated_at,
    })),
    ...concepts.map((c) => ({
      id: `c-${c.id}`,
      kind: "concept" as const,
      title: c.title,
      sub: CONCEPT_STATUS_LABELS[c.status],
      href: `/dashboard/konzepte/${c.id}`,
      date: c.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  // --- Nächste Schritte: konkrete To-Dos aus dem Datenbestand ableiten -------
  const nextSteps: NextStep[] = [];
  for (const o of offers) {
    if (o.status === "sent") {
      nextSteps.push({
        id: `step-offer-${o.id}`,
        label: `Dein Angebot ist da: ${o.title}`,
        hint: `${o.number} · auch per E-Mail erhalten · Zusagen per Antwort-Mail`,
        href: `/dashboard/angebote/${o.id}`,
        cta: "Ansehen",
      });
    }
  }
  for (const inv of openInvoices) {
    nextSteps.push({
      id: `step-invoice-${inv.id}`,
      label: `Rechnung begleichen: ${inv.title}`,
      hint: `${inv.number} · offen: ${formatMoney(computeTotals(inv.items, inv.tax_rate).gross, inv.currency)}`,
      href: `/dashboard/rechnungen/${inv.id}`,
      cta: "Öffnen",
    });
  }
  for (const c of concepts.filter((x) => x.status === "shared")) {
    nextSteps.push({
      id: `step-concept-${c.id}`,
      label: `Konzept „${c.title}" ansehen`,
      hint: "Wir haben ein Konzept für dich geteilt.",
      href: `/dashboard/konzepte/${c.id}`,
      cta: "Ansehen",
    });
  }

  const isEmpty =
    projects.length === 0 &&
    offers.length === 0 &&
    invoices.length === 0 &&
    concepts.length === 0 &&
    briefs.length === 0;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <SideRaysBackground />
      <LiveRefresh />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/45 to-black/85" />

      <DashboardHeader isAdmin={admin} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        <header className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Kundenportal
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{greeting}</h1>
          <p className="max-w-xl text-base text-white/70">
            Verfolge deine Projekte live mit und sieh deine Angebote, Rechnungen und Konzepte.
            Alles an einem Ort.
          </p>
        </header>

        {isEmpty ? (
          <Onboarding />
        ) : (
          <>
            {stats.length > 0 && (
              <section aria-label="Kennzahlen" className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                  >
                    <p className="text-sm text-white/60">{stat.label}</p>
                    <p className="mt-2 text-4xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-white/40">{stat.hint}</p>
                  </article>
                ))}
              </section>
            )}

            {/* Nächste Schritte + Was ist neu nebeneinander */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="flex flex-col gap-4">
                <SectionTitle title="Deine nächsten Schritte" />
                {nextSteps.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                    Alles erledigt. Aktuell ist nichts zu tun. Wir melden uns per E-Mail,
                    sobald es Neuigkeiten gibt.
                  </div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {nextSteps.map((step) => (
                      <li key={step.id}>
                        <Link
                          href={step.href}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-[#09ed2d]/20 bg-[#09ed2d]/[0.06] p-4 transition hover:border-[#09ed2d]/40 hover:bg-[#09ed2d]/10"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-white">{step.label}</p>
                            <p className="mt-0.5 truncate text-xs text-white/50">{step.hint}</p>
                          </div>
                          <span className="flex-none rounded-full bg-[#09ed2d] px-4 py-1.5 text-xs font-semibold text-black">
                            {step.cta}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="flex flex-col gap-4">
                <SectionTitle title="Was ist neu" />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  {activity.length === 0 ? (
                    <p className="px-2 py-4 text-sm text-white/50">Noch keine Aktivität.</p>
                  ) : (
                    <ActivityFeed items={activity} />
                  )}
                </div>
              </section>
            </div>

            {/* Projekte mit Live-Fortschritt – nur wenn vorhanden */}
            {projects.length > 0 && (
              <Section title="Deine Projekte" hint="Live aktualisiert">
                <ExpandableGrid max={4} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/dashboard/projekte/${p.id}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-400/40 hover:bg-white/10"
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
                </ExpandableGrid>
              </Section>
            )}

            {/* Angebote – nur wenn vorhanden */}
            {offers.length > 0 && (
              <Section title="Angebote">
                <ExpandableList max={5}>
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
                </ExpandableList>
              </Section>
            )}

            {/* Rechnungen – nur wenn vorhanden */}
            {invoices.length > 0 && (
              <Section title="Rechnungen">
                <ExpandableList max={5}>
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
                </ExpandableList>
              </Section>
            )}

            {/* Konzepte – nur wenn vorhanden */}
            {concepts.length > 0 && (
              <Section title="Konzepte">
                <ExpandableList max={5}>
                  {concepts.map((c) => (
                    <DocRow
                      key={c.id}
                      href={`/dashboard/konzepte/${c.id}`}
                      title={c.title}
                      sub={dateFormatter.format(new Date(c.created_at))}
                      badge={<StatusBadge label={CONCEPT_STATUS_LABELS[c.status]} tone={conceptTone(c.status)} />}
                    />
                  ))}
                </ExpandableList>
              </Section>
            )}

            {/* Detaillierte Konfigurator-Anfragen */}
            {briefs.length > 0 && (
              <Section title="Deine Konfigurations-Anfragen">
                <ExpandableList max={5}>
                  {briefs.map((b) => (
                    <DocRow
                      key={b.id}
                      title={
                        b.project_type
                          ? projectTypeLabel(b.project_type as ProjectType)
                          : "Projekt-Konfiguration"
                      }
                      sub={dateFormatter.format(new Date(b.created_at))}
                      amount={
                        typeof b.price_min === "number" && typeof b.price_max === "number"
                          ? `${formatEuro(b.price_min)} bis ${formatEuro(b.price_max)}`
                          : undefined
                      }
                      badge={
                        <StatusBadge label={BRIEF_STATUS_LABELS[b.status]} tone={leadTone(b.status)} />
                      }
                    />
                  ))}
                </ExpandableList>
              </Section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Onboarding() {
  const steps = [
    {
      title: "Preis berechnen",
      text: "Stelle dir dein Projekt im Preisrechner zusammen und erhalte sofort eine Richtpreis-Spanne.",
    },
    {
      title: "Detailliert konfigurieren",
      text: "Gib im Konfigurator alle Wünsche an: Firma, Domain, Funktionen, Stil. Je genauer, desto besser.",
    },
    {
      title: "Angebot & Projektstart",
      text: "Wir erstellen dein persönliches Angebot und senden es dir per E-Mail. Nach deiner Zusage starten wir dein Projekt.",
    },
  ];

  return (
    <section className="rounded-3xl border border-[#09ed2d]/20 bg-gradient-to-br from-[#09ed2d]/10 via-white/[0.03] to-black p-8">
      <h2 className="text-2xl font-semibold text-white">Willkommen bei TAS Webworks</h2>
      <p className="mt-2 max-w-2xl text-white/60">
        Hier ist noch nichts los. Das ändern wir gemeinsam. So läuft dein Weg zur neuen Website:
      </p>

      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#09ed2d]/30 bg-[#09ed2d]/10 text-sm font-bold text-[#09ed2d]">
              {i + 1}
            </span>
            <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
            <p className="mt-1 text-sm text-white/55">{s.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/#preisrechner"
          className="rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90"
        >
          Jetzt Projekt anfragen
        </Link>
        <Link
          href="/konfigurator"
          className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Direkt konfigurieren
        </Link>
      </div>
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="h-4 w-1 rounded-full bg-[#09ed2d]" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
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
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-4 w-1 rounded-full bg-[#09ed2d]" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
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
