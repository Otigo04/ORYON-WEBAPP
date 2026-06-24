import { computeTotals, formatMoney, type LineItem } from "@/lib/documents";
import { siteConfig } from "@/lib/site";

type Meta = { label: string; value: string }[];

/**
 * Druckbare Dokumentenansicht für Rechnungen & Angebote (helles Layout,
 * print-optimiert via .doc-sheet in globals.css). Positionen + Summen werden
 * serverseitig berechnet.
 */
export function DocumentView({
  kind,
  number,
  title,
  meta,
  items,
  taxRate,
  currency,
  customer,
  intro,
  notes,
}: {
  kind: "Rechnung" | "Angebot";
  number: string;
  title: string;
  meta: Meta;
  items: LineItem[];
  taxRate: number;
  currency: string;
  customer: { full_name: string | null; email: string | null; company: string | null } | null;
  intro?: string | null;
  notes?: string | null;
}) {
  const totals = computeTotals(items, taxRate);

  return (
    <article className="doc-sheet mx-auto max-w-3xl rounded-2xl bg-white p-8 text-neutral-900 shadow-xl sm:p-12">
      {/* Kopf */}
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <p className="text-xl font-bold tracking-tight">{siteConfig.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">
            {siteConfig.address.street}
            <br />
            {siteConfig.address.postalCode} {siteConfig.address.city}
            <br />
            {siteConfig.email}
          </p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-neutral-800">{kind}</h1>
          <p className="mt-1 text-sm text-neutral-500">{number}</p>
        </div>
      </header>

      {/* Empfänger + Meta */}
      <div className="mt-6 flex flex-wrap justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">An</p>
          <p className="mt-1 font-medium">{customer?.company || customer?.full_name || "—"}</p>
          {customer?.company && customer?.full_name && (
            <p className="text-sm text-neutral-600">{customer.full_name}</p>
          )}
          {customer?.email && <p className="text-sm text-neutral-600">{customer.email}</p>}
        </div>
        <dl className="text-sm">
          {meta.map((m) => (
            <div key={m.label} className="flex justify-end gap-3">
              <dt className="text-neutral-400">{m.label}:</dt>
              <dd className="font-medium text-neutral-700">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h2 className="mt-8 text-lg font-semibold">{title}</h2>
      {intro && <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-600">{intro}</p>}

      {/* Positionen */}
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-300 text-left text-xs uppercase tracking-wide text-neutral-400">
            <th className="py-2">Beschreibung</th>
            <th className="py-2 text-right">Menge</th>
            <th className="py-2 text-right">Einzelpreis</th>
            <th className="py-2 text-right">Summe</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-b border-neutral-100">
              <td className="py-2 pr-2">{it.description}</td>
              <td className="py-2 text-right tabular-nums">{it.quantity}</td>
              <td className="py-2 text-right tabular-nums">{formatMoney(it.unit_price, currency)}</td>
              <td className="py-2 text-right tabular-nums">
                {formatMoney(it.quantity * it.unit_price, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summen */}
      <div className="mt-4 flex justify-end">
        <dl className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Netto</dt>
            <dd className="tabular-nums">{formatMoney(totals.net, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">zzgl. MwSt. ({taxRate}%)</dt>
            <dd className="tabular-nums">{formatMoney(totals.tax, currency)}</dd>
          </div>
          <div className="flex justify-between border-t border-neutral-300 pt-1 text-base font-bold">
            <dt>Gesamtbetrag</dt>
            <dd className="tabular-nums">{formatMoney(totals.gross, currency)}</dd>
          </div>
        </dl>
      </div>

      {notes && (
        <div className="mt-8 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
          <p className="whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      <footer className="mt-10 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-400">
        {siteConfig.legalName} · USt-IdNr. {siteConfig.vatId}
      </footer>
    </article>
  );
}
