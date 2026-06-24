/**
 * Client-sichere Kunden-Typen & -Helfer (kein Server-Import).
 * Wird sowohl in Client-Formularen als auch serverseitig genutzt.
 */
export type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
};

/** Anzeigename eines Kunden für Dropdowns/Listen. */
export function customerLabel(c: {
  full_name: string | null;
  email: string | null;
}): string {
  return c.full_name?.trim() || c.email || "Unbekannter Kunde";
}
