import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { LeadResponseForm } from "@/components/admin/LeadResponseForm";
import { StatusBadge, leadTone } from "@/components/ui/StatusBadge";
import { getAllLeads } from "@/lib/admin/leads";
import { LEAD_STATUS_LABELS } from "@/lib/documents";
import { projectTypeLabel } from "@/lib/leads";
import { formatEuro } from "@/lib/pricing";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminLeadsPage() {
  const leads = await getAllLeads();

  return (
    <>
      <PageHeader
        title="Anfragen"
        subtitle="Eingehende Anfragen aus dem Preisrechner, Status setzen und intern beantworten."
      />

      {leads.length === 0 ? (
        <EmptyState>
          Noch keine Anfragen. Sobald jemand den Preisrechner absendet, erscheint die Anfrage hier.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {leads.map((lead) => (
            <Card key={lead.id} className="scroll-mt-6" >
              <div id={`lead-${lead.id}`} />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    <StatusBadge label={LEAD_STATUS_LABELS[lead.status]} tone={leadTone(lead.status)} />
                  </div>
                  <p className="mt-0.5 text-sm text-white/50">
                    {dateFormatter.format(new Date(lead.created_at))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#09ed2d]">
                    {formatEuro(lead.price_min)} bis {formatEuro(lead.price_max)}
                  </p>
                  {(lead.monthly_min > 0 || lead.monthly_max > 0) && (
                    <p className="text-xs text-white/40">
                      mtl. {formatEuro(lead.monthly_min)} bis {formatEuro(lead.monthly_max)}
                    </p>
                  )}
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <Detail label="E-Mail" value={<a href={`mailto:${lead.email}`} className="text-[#09ed2d] hover:underline">{lead.email}</a>} />
                {lead.phone && <Detail label="Telefon" value={<a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>} />}
                {lead.company && <Detail label="Firma" value={lead.company} />}
                <Detail label="Projektart" value={projectTypeLabel(lead.project_type)} />
                <Detail label="Design" value={lead.design} />
                {lead.features.length > 0 && (
                  <Detail label="Features" value={lead.features.join(", ")} />
                )}
                {lead.extra_languages > 0 && (
                  <Detail label="Zusatzsprachen" value={String(lead.extra_languages)} />
                )}
                <Detail label="Wartung" value={lead.maintenance ? "Ja" : "Nein"} />
              </dl>

              {lead.message && (
                <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
                  &bdquo;{lead.message}&ldquo;
                </div>
              )}

              <LeadResponseForm id={lead.id} status={lead.status} adminNote={lead.admin_note} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/5 py-1">
      <dt className="text-white/40">{label}</dt>
      <dd className="text-right text-white/85">{value}</dd>
    </div>
  );
}
