/**
 * Zentrale Zahlungs-/Bankdaten für Angebote und Rechnungen.
 *
 * Es gibt bewusst keine Online-Zahlung (kein Stripe). Angebote und Rechnungen
 * werden als PDF erstellt und per E-Mail versendet; bezahlt wird per Überweisung.
 * Die Werte kommen aus Umgebungsvariablen (in Vercel bzw. .env.local setzen),
 * damit echte Kontodaten nicht im Code stehen. Ohne gesetzte Variablen greifen
 * neutrale Platzhalter.
 */

export const BANK_DETAILS = {
  accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || "TAS Webworks",
  iban: process.env.NEXT_PUBLIC_BANK_IBAN || "DE00 0000 0000 0000 0000 00",
  bic: process.env.NEXT_PUBLIC_BANK_BIC || "XXXXXXXXXXX",
  bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Musterbank",
} as const;

/** Branchenüblicher Anzahlungs-Anteil (50 % bei Projektstart). */
export const DEPOSIT_RATE = 0.5;

/** Erzeugt einen sprechenden Verwendungszweck für eine Überweisung. */
export function paymentReference(documentNumber: string): string {
  return `Angebot ${documentNumber}`;
}
