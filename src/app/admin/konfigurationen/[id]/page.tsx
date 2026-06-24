import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/admin/PageHeader";
import { StatusBadge, leadTone } from "@/components/ui/StatusBadge";
import { getBrief, BRIEF_STATUS_LABELS } from "@/lib/briefs";
import { BRIEF_STEPS, displayValue } from "@/lib/brief";
import { formatEuro } from "@/lib/pricing";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminBriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brief = await getBrief(id);
  if (!brief) notFound();

  const summary = brief.data?._summary;

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/konfigurationen"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Zurück zu Konfigurationen
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{brief.name}</h1>
            <StatusBadge label={BRIEF_STATUS_LABELS[brief.status]} tone={leadTone(brief.status)} />
          </div>
          <p className="mt-1 text-sm text-white/50">
            {dateFormatter.format(new Date(brief.created_at))}
          </p>
        </div>
        {typeof brief.price_min === "number" && typeof brief.price_max === "number" && (
          <p className="text-xl font-semibold text-[#09ed2d]">
            {formatEuro(brief.price_min)} – {formatEuro(brief.price_max)}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Kontakt */}
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#09ed2d]">Kontakt</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <Row label="Name" value={brief.name} />
            <Row
              label="E-Mail"
              value={
                <a href={`mailto:${brief.email}`} className="text-[#09ed2d] hover:underline">
                  {brief.email}
                </a>
              }
            />
            {brief.phone && (
              <Row
                label="Telefon"
                value={
                  <a href={`tel:${brief.phone}`} className="hover:underline">
                    {brief.phone}
                  </a>
                }
              />
            )}
            {brief.company && <Row label="Firma" value={brief.company} />}
          </dl>
        </Card>

        {/* Zusammenfassung aus dem Preisrechner */}
        {summary && (summary.projectType || summary.features?.length) && (
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#09ed2d]">
              Preisrechner-Auswahl
            </h2>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {summary.projectType && <Row label="Projektart" value={summary.projectType} />}
              {summary.design && <Row label="Design" value={summary.design} />}
              {summary.features && summary.features.length > 0 && (
                <Row label="Features" value={summary.features.join(", ")} />
              )}
              {typeof summary.extraLanguages === "number" && summary.extraLanguages > 0 && (
                <Row label="Zusatzsprachen" value={String(summary.extraLanguages)} />
              )}
              {typeof summary.maintenance === "boolean" && (
                <Row label="Wartung" value={summary.maintenance ? "Ja" : "Nein"} />
              )}
            </dl>
          </Card>
        )}

        {/* Alle Konfigurator-Angaben, Schritt für Schritt */}
        {BRIEF_STEPS.map((step) => {
          const answered = step.fields
            .map((f) => ({ label: f.label, value: brief.data?.[f.name] }))
            .filter((r) => {
              const v = r.value;
              return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim().length > 0;
            });
          if (answered.length === 0) return null;
          return (
            <Card key={step.id}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#09ed2d]">
                {step.title}
              </h2>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {answered.map((r) => (
                  <Row key={r.label} label={r.label} value={displayValue(r.value)} />
                ))}
              </dl>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/5 py-1.5">
      <dt className="shrink-0 text-white/40">{label}</dt>
      <dd className="text-right text-white/85">{value}</dd>
    </div>
  );
}
