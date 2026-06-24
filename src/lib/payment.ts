/**
 * Zentrale Zahlungs-/Bankdaten.
 *
 * Aktuell sind Platzhalter hinterlegt – ersetze sie an dieser einen Stelle durch
 * eure echten Kontodaten. Eine echte Online-Zahlung (Stripe) ist noch nicht
 * angebunden; die UI zeigt die Überweisungsdaten und einen Hinweis „Online-
 * Zahlung folgt". Sobald Stripe aktiv ist, kann `ONLINE_PAYMENT_ENABLED` auf
 * `true` gestellt und der Checkout angebunden werden.
 */

export const BANK_DETAILS = {
  accountHolder: "TAS Webworks",
  iban: "DE00 0000 0000 0000 0000 00",
  bic: "XXXXXXXXXXX",
  bankName: "Musterbank",
} as const;

/** Branchenüblicher Anzahlungs-Anteil (50 % bei Projektstart). */
export const DEPOSIT_RATE = 0.5;

/** Schalter für eine spätere echte Online-Zahlung (Stripe). */
export const ONLINE_PAYMENT_ENABLED = false;

/** Erzeugt einen sprechenden Verwendungszweck für eine Überweisung. */
export function paymentReference(documentNumber: string): string {
  return `Angebot ${documentNumber}`;
}
