import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { getAllOffers } from "@/lib/offers";
import { getAllInvoices } from "@/lib/invoices";
import { getAllProjects } from "@/lib/projects";
import { getAllConcepts } from "@/lib/concepts";
import { getAllLeads } from "@/lib/admin/leads";
import { getAllBriefs } from "@/lib/briefs";
import { projectTypeLabel } from "@/lib/leads";

export const metadata = {
  title: "Suche, Admin",
  robots: { index: false, follow: false },
};

type Result = {
  id: string;
  type: string;
  /** Hauptzeile, z. B. „AN-2026-001 · Relaunch". */
  primary: string;
  /** Nebenzeile, z. B. Kundenname / E-Mail. */
  secondary: string;
  href: string;
  /** Felder, gegen die gematcht wird (klein geschrieben gesammelt). */
  haystack: string;
};

const lc = (...parts: (string | null | undefined)[]) =>
  parts.filter(Boolean).join(" ").toLowerCase();

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (!query) {
    return (
      <>
        <PageHeader
          title="Suche"
          subtitle="Suche über Angebote, Rechnungen, Projekte, Konzepte und Anfragen, nach Nummer, Titel, Name oder E-Mail."
        />
        <EmptyState>Gib oben links einen Suchbegriff ein (z. B. eine Rechnungs- oder Angebotsnummer).</EmptyState>
      </>
    );
  }

  const [offers, invoices, projects, concepts, leads, briefs] = await Promise.all([
    getAllOffers(),
    getAllInvoices(),
    getAllProjects(),
    getAllConcepts(),
    getAllLeads(),
    getAllBriefs(),
  ]);

  const results: Result[] = [
    ...offers.map((o) => ({
      id: o.id,
      type: "Angebot",
      primary: `${o.number} · ${o.title}`,
      secondary: o.customer?.full_name || o.customer?.email || "—",
      href: `/admin/angebote/${o.id}`,
      haystack: lc(o.number, o.title, o.customer?.full_name, o.customer?.email),
    })),
    ...invoices.map((i) => ({
      id: i.id,
      type: "Rechnung",
      primary: `${i.number} · ${i.title}`,
      secondary: i.customer?.full_name || i.customer?.email || "—",
      href: `/admin/rechnungen/${i.id}`,
      haystack: lc(i.number, i.title, i.customer?.full_name, i.customer?.email),
    })),
    ...projects.map((p) => ({
      id: p.id,
      type: "Projekt",
      primary: p.title,
      secondary: p.customer?.full_name || p.customer?.email || "—",
      href: `/admin/projekte/${p.id}`,
      haystack: lc(p.title, p.customer?.full_name, p.customer?.email),
    })),
    ...concepts.map((c) => ({
      id: c.id,
      type: "Konzept",
      primary: c.title,
      secondary: c.customer?.full_name || c.customer?.email || "—",
      href: `/admin/konzepte/${c.id}`,
      haystack: lc(c.title, c.customer?.full_name, c.customer?.email),
    })),
    ...leads.map((l) => ({
      id: l.id,
      type: "Anfrage",
      primary: `${l.name} · ${projectTypeLabel(l.project_type)}`,
      secondary: l.email,
      href: `/admin/anfragen#lead-${l.id}`,
      haystack: lc(l.name, l.email, l.company, l.project_type),
    })),
    ...briefs.map((b) => ({
      id: b.id,
      type: "Konfiguration",
      primary: `${b.name} · ${
        b.project_type ? projectTypeLabel(b.project_type as Parameters<typeof projectTypeLabel>[0]) : "Konfiguration"
      }`,
      secondary: b.email,
      href: `/admin/konfigurationen/${b.id}`,
      haystack: lc(b.name, b.email, b.company, b.project_type),
    })),
  ];

  // Mehrere Begriffe → alle müssen vorkommen (UND-Suche).
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = results.filter((r) => terms.every((t) => r.haystack.includes(t)));

  return (
    <>
      <PageHeader
        title={`Suche: „${query}“`}
        subtitle={`${matches.length} ${matches.length === 1 ? "Treffer" : "Treffer"} über alle Bereiche.`}
      />

      {matches.length === 0 ? (
        <EmptyState>
          Keine Treffer für „{query}“. Versuch eine Nummer, einen Namen oder eine E-Mail.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.map((r) => (
            <Link key={`${r.type}-${r.id}`} href={r.href} className="block">
              <Card className="flex flex-wrap items-center justify-between gap-3 py-3 transition hover:border-[#09ed2d]/40 hover:bg-white/[0.05]">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{r.primary}</p>
                  <p className="truncate text-sm text-white/45">{r.secondary}</p>
                </div>
                <span className="flex-none rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                  {r.type}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
