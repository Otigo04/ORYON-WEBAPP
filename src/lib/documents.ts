import { z } from "zod";

/**
 * Gemeinsame Typen & Berechnungen für Dokumente (Rechnungen & Angebote).
 * Eine Position besteht aus Beschreibung, Menge und Einzelpreis (in Euro).
 */
export const lineItemSchema = z.object({
  description: z.string().min(1, "Beschreibung fehlt.").max(300),
  quantity: z.coerce.number().min(0).max(100000),
  unit_price: z.coerce.number().min(0).max(10000000),
});

export type LineItem = z.infer<typeof lineItemSchema>;

export type DocumentTotals = {
  net: number;
  tax: number;
  gross: number;
};

/** Summiert Positionen und rechnet die Steuer (in Prozent) auf. */
export function computeTotals(items: LineItem[], taxRate: number): DocumentTotals {
  const net = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0,
  );
  const tax = (net * (Number(taxRate) || 0)) / 100;
  return { net, tax, gross: net + tax };
}

/** Formatiert einen Eurobetrag mit zwei Nachkommastellen (Dokumente). */
export function formatMoney(value: number, currency = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(value);
}

/** Erzeugt eine fortlaufende, lesbare Belegnummer als Default-Vorschlag. */
export function suggestDocumentNumber(prefix: "RE" | "AN"): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${stamp}-${rand}`;
}

// ---- Status-Label-Helfer (deutsch) -------------------------------------

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Entwurf",
  sent: "Versendet",
  paid: "Bezahlt",
  cancelled: "Storniert",
};

export const OFFER_STATUS_LABELS: Record<string, string> = {
  draft: "Entwurf",
  sent: "Versendet",
  accepted: "Angenommen",
  declined: "Abgelehnt",
  expired: "Abgelaufen",
};

export const CONCEPT_STATUS_LABELS: Record<string, string> = {
  draft: "Entwurf",
  shared: "Geteilt",
};

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  planning: "In Planung",
  in_progress: "In Arbeit",
  review: "In Abnahme",
  done: "Abgeschlossen",
  paused: "Pausiert",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  answered: "Beantwortet",
  closed: "Geschlossen",
};
