import { siteConfig } from "@/lib/site";

/**
 * Leichtgewichtige E-Mail-Benachrichtigung über die Resend-REST-API.
 *
 * Bewusst ohne SDK-Abhängigkeit (nur `fetch`), damit der Build schlank bleibt
 * und die Funktion bei fehlender Konfiguration einfach nichts tut.
 *
 * Konfiguration (alle optional – ohne `RESEND_API_KEY` ist Versand deaktiviert):
 * - `RESEND_API_KEY`        – API-Key von resend.com
 * - `LEAD_NOTIFICATION_TO`  – Empfänger (Fallback: siteConfig.email)
 * - `LEAD_NOTIFICATION_FROM`– Absender, Domain muss bei Resend verifiziert sein
 *                             (Fallback: "TAS Webworks <noreply@tas-webworks.de>")
 *
 * WICHTIG: Diese Funktion wirft niemals. Ein fehlgeschlagener Mailversand darf
 * das Speichern eines Leads nie verhindern.
 */
export type LeadNotification = {
  /** Quelle der Anfrage – steuert nur die Betreffzeile. */
  source: "Preisrechner" | "Konfigurator";
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  projectType?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  message?: string | null;
};

function formatEur(value?: number | null): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildHtml(lead: LeadNotification): string {
  const adminUrl = `${siteConfig.url}/admin/anfragen`;
  const priceMin = formatEur(lead.priceMin);
  const priceMax = formatEur(lead.priceMax);
  const priceRange =
    priceMin && priceMax ? `${priceMin} – ${priceMax}` : priceMin ?? priceMax ?? "–";

  const row = (label: string, value?: string | null) =>
    value
      ? `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0;color:#111">${value}</td></tr>`
      : "";

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto">
    <h2 style="margin:0 0 4px">Neue Anfrage über den ${lead.source}</h2>
    <p style="margin:0 0 16px;color:#666">Eingegangen am ${new Date().toLocaleString("de-DE")}</p>
    <table style="border-collapse:collapse;font-size:14px;width:100%">
      ${row("Name", lead.name)}
      ${row("E-Mail", `<a href="mailto:${lead.email}">${lead.email}</a>`)}
      ${row("Telefon", lead.phone)}
      ${row("Firma", lead.company)}
      ${row("Projektart", lead.projectType)}
      ${row("Preisspanne", priceRange)}
      ${row("Nachricht", lead.message)}
    </table>
    <p style="margin:24px 0 0">
      <a href="${adminUrl}" style="background:#09ed2d;color:#000;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Im Admin öffnen</a>
    </p>
  </div>`;
}

export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Versand deaktiviert – stillschweigend überspringen.

  const to = process.env.LEAD_NOTIFICATION_TO || siteConfig.email;
  const from =
    process.env.LEAD_NOTIFICATION_FROM || "TAS Webworks <noreply@tas-webworks.de>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: lead.email,
        subject: `Neue ${lead.source}-Anfrage von ${lead.name}`,
        html: buildHtml(lead),
      }),
    });

    if (!res.ok) {
      console.error(
        "[notifyNewLead] Resend antwortete mit Status",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    // Niemals werfen – der Lead ist bereits gespeichert.
    console.error("[notifyNewLead] Versand fehlgeschlagen:", err);
  }
}
