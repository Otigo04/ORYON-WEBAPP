/**
 * Zentrale Zahlungs-/Bankdaten.
 *
 * Die Werte kommen aus Umgebungsvariablen (in Vercel bzw. .env.local setzen),
 * damit echte Kontodaten nicht im Code stehen. Ohne gesetzte Variablen greifen
 * neutrale Platzhalter.
 *
 * Diese Datei wird auch in Client-Komponenten (PaymentBox) importiert – daher
 * ausschließlich `NEXT_PUBLIC_*`-Variablen verwenden. Die Bankdaten werden dem
 * Kunden ohnehin angezeigt; sie sind nicht geheim.
 */

export const BANK_DETAILS = {
  accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || "TAS Webworks",
  iban: process.env.NEXT_PUBLIC_BANK_IBAN || "DE00 0000 0000 0000 0000 00",
  bic: process.env.NEXT_PUBLIC_BANK_BIC || "XXXXXXXXXXX",
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Musterbank",
} as const;

/** Branchenüblicher Anzahlungs-Anteil (50 % bei Projektstart). */
export const DEPOSIT_RATE = 0.5;

/**
 * Schalter für die echte Online-Zahlung (Stripe).
 * Aktiviert über `NEXT_PUBLIC_ONLINE_PAYMENT_ENABLED=true`, sobald die
 * Stripe-Keys hinterlegt und getestet sind.
 */
export const ONLINE_PAYMENT_ENABLED =
  process.env.NEXT_PUBLIC_ONLINE_PAYMENT_ENABLED === "true";

/** Erzeugt einen sprechenden Verwendungszweck für eine Überweisung. */
export function paymentReference(documentNumber: string): string {
  return `Angebot ${documentNumber}`;
}
