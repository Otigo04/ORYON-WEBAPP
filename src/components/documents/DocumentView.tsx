import { computeTotals, formatMoney, type LineItem } from "@/lib/documents";
import { siteConfig } from "@/lib/site";

type Meta = { label: string; value: string }[];

/**
 * Druckbare Dokumentenansicht für Rechnungen & Angebote (helles Layout,
 * print-optimiert via .doc-sheet in globals.css). Positionen + Summen werden
 * serverseitig berechnet.
 */
type Customer = {
  full_name: string | null;
  email: string | null;
  company: string | null;
  street?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
  vat_id?: string | null;
};

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
  logoSrc = "/logo/tas_wordmark.svg",
  payment,
}: {
  kind: "Rechnung" | "Angebot";
  number: string;
  title: string;
  meta: Meta;
  items: LineItem[];
  taxRate: number;
  currency: string;
  customer: Customer | null;
  intro?: string | null;
  notes?: string | null;
  /** Logo oben links (Standard: Wortmarke). */
  logoSrc?: string;
  /**
   * Überweisungs-Box mit Bankverbindung. Wird gerendert, wenn gesetzt – etwa bei
   * offenen Rechnungen (Status „Versendet"). `reference` = Verwendungszweck.
   */
  payment?: { reference: string } | null;
}) {
  const totals = computeTotals(items, taxRate);
  const bank = siteConfig.bank;

  return (
    <article className="doc-sheet mx-auto max-w-3xl rounded-2xl bg-white p-8 text-neutral-900 shadow-xl sm:p-12">
      {/* Kopf */}
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt={siteConfig.name} className="h-9 w-auto" />
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
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
        <div className="text-sm text-neutral-600">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">An</p>
          <p className="mt-1 font-medium text-neutral-900">
            {customer?.company || customer?.full_name || "—"}
          </p>
          {customer?.company && customer?.full_name && <p>{customer.full_name}</p>}
          {customer?.street && <p>{customer.street}</p>}
          {(customer?.postal_code || customer?.city) && (
            <p>
              {customer?.postal_code} {customer?.city}
            </p>
          )}
          {customer?.country && <p>{customer.country}</p>}
          {customer?.email && <p>{customer.email}</p>}
          {customer?.vat_id && <p>USt-IdNr. {customer.vat_id}</p>}
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
          {taxRate > 0 ? (
            <>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Netto</dt>
                <dd className="tabular-nums">{formatMoney(totals.net, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">zzgl. MwSt. ({taxRate}%)</dt>
                <dd className="tabular-nums">{formatMoney(totals.tax, currency)}</dd>
              </div>
            </>
          ) : null}
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

      {payment && (
        <div className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-5">
          <p className="text-sm font-semibold text-neutral-800">Zahlung per Überweisung</p>
          <p className="mt-1 text-xs text-neutral-500">
            Bitte überweisen Sie den Gesamtbetrag von{" "}
            <span className="font-medium text-neutral-700">
              {formatMoney(totals.gross, currency)}
            </span>{" "}
            auf folgendes Konto. Geben Sie als Verwendungszweck bitte{" "}
            <span className="font-medium text-neutral-700">{payment.reference}</span> an.
          </p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-neutral-400">Kontoinhaber</dt>
            <dd className="font-medium text-neutral-700">{bank.accountHolder}</dd>
            <dt className="text-neutral-400">IBAN</dt>
            <dd className="font-medium tabular-nums text-neutral-700">{bank.iban}</dd>
            <dt className="text-neutral-400">BIC</dt>
            <dd className="font-medium tabular-nums text-neutral-700">{bank.bic}</dd>
            <dt className="text-neutral-400">Bank</dt>
            <dd className="font-medium text-neutral-700">{bank.bankName}</dd>
            <dt className="text-neutral-400">Verwendungszweck</dt>
            <dd className="font-medium text-neutral-700">{payment.reference}</dd>
          </dl>
          <p className="mt-3 text-xs text-neutral-500">
            Nach Zahlungseingang richten wir Ihren TAS-FLEET-Zugang innerhalb von 12 Stunden
            ein und senden Ihnen die Zugangsdaten per E-Mail.
          </p>
        </div>
      )}

      <footer className="mt-10 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-400">
        {siteConfig.legalName}
        {siteConfig.vatId
          ? ` · USt-IdNr. ${siteConfig.vatId}`
          : " · Kleinunternehmer gemäß § 19 UStG"}
      </footer>
    </article>
  );
}
