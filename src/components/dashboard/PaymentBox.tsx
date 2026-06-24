"use client";

import { useState } from "react";
import { BANK_DETAILS, ONLINE_PAYMENT_ENABLED } from "@/lib/payment";
import { formatMoney } from "@/lib/documents";

/**
 * Zahlungs-Hinweis (vorbereitet).
 *
 * Zeigt einen „Jetzt zahlen"-Button, der die Überweisungsdaten (Platzhalter)
 * samt Verwendungszweck einblendet. Eine echte Online-Zahlung (Stripe) ist noch
 * nicht angebunden – sobald `ONLINE_PAYMENT_ENABLED` true ist, kann hier der
 * Checkout ergänzt werden.
 */
export function PaymentBox({
  amount,
  currency = "EUR",
  reference,
  heading = "Zahlung",
  subline,
}: {
  amount: number;
  currency?: string;
  reference: string;
  heading?: string;
  subline?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(BANK_DETAILS.iban.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard nicht verfügbar – kein Problem */
    }
  };

  return (
    <div className="rounded-2xl border border-[#09ed2d]/25 bg-gradient-to-br from-[#09ed2d]/10 via-white/[0.03] to-black p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#09ed2d]">
            {heading}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {formatMoney(amount, currency)}
          </p>
          {subline && <p className="mt-1 text-xs text-white/50">{subline}</p>}
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full bg-[#09ed2d] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90"
        >
          {open ? "Zahlungsdaten ausblenden" : "Jetzt zahlen"}
        </button>
      </div>

      {open && (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-sm text-white/70">
            Überweise den Betrag bitte auf folgendes Konto:
          </p>
          <dl className="mt-3 grid gap-2 text-sm">
            <Row label="Kontoinhaber" value={BANK_DETAILS.accountHolder} />
            <Row
              label="IBAN"
              value={BANK_DETAILS.iban}
              action={
                <button
                  type="button"
                  onClick={copyIban}
                  className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70 transition hover:bg-white/10"
                >
                  {copied ? "Kopiert ✓" : "Kopieren"}
                </button>
              }
            />
            <Row label="BIC" value={BANK_DETAILS.bic} />
            <Row label="Bank" value={BANK_DETAILS.bankName} />
            <Row label="Betrag" value={formatMoney(amount, currency)} />
            <Row label="Verwendungszweck" value={reference} highlight />
          </dl>

          {!ONLINE_PAYMENT_ENABLED && (
            <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/45">
              💳 Online-Zahlung per Karte / SEPA folgt in Kürze. Bis dahin bequem
              per Überweisung.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  action,
  highlight,
}: {
  label: string;
  value: string;
  action?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-black/30 px-3 py-2">
      <span className="text-xs text-white/45">{label}</span>
      <span className="flex items-center gap-2">
        <span
          className={`font-medium tabular-nums ${highlight ? "text-[#09ed2d]" : "text-white"}`}
        >
          {value}
        </span>
        {action}
      </span>
    </div>
  );
}
