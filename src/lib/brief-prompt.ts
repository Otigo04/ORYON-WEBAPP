import { BRIEF_STEPS, displayValue } from "@/lib/brief";
import type { BriefValue } from "@/lib/brief";
import type { Brief } from "@/lib/briefs";
import { formatEuro } from "@/lib/pricing";

/**
 * Wandelt eine Kunden-Konfiguration (Brief) in einen vollständigen,
 * gut strukturierten Text-Prompt um – fertig zum Kopieren oder als Datei,
 * den man direkt Claude geben kann, um an der Vision des Kunden zu arbeiten.
 *
 * Bewusst client-sicher (kein Server-Import), damit der Prompt sowohl
 * serverseitig vorberechnet als auch im Browser erzeugt werden kann.
 */
function isAnswered(value: BriefValue | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

export function buildBriefPrompt(brief: Brief): string {
  const lines: string[] = [];
  const title = brief.company || brief.name;

  lines.push(`# Projekt-Briefing – ${title}`);
  lines.push("");
  lines.push(
    "Du bist Web-Designer und Entwickler bei TAS Webworks. Unten steht die " +
      "vollständige Konfiguration, die der Kunde über unseren Projekt-Konfigurator " +
      "eingegeben hat. Arbeite auf dieser Basis an der Vision des Kunden: Schlage " +
      "Struktur, Inhalte und Umsetzung der Website vor und setze sie um.",
  );
  lines.push("");

  // --- Kontakt & Eckdaten ---
  lines.push("## Kontakt & Eckdaten");
  lines.push(`- **Name:** ${brief.name}`);
  lines.push(`- **E-Mail:** ${brief.email}`);
  if (brief.phone) lines.push(`- **Telefon:** ${brief.phone}`);
  if (brief.company) lines.push(`- **Firma:** ${brief.company}`);
  if (typeof brief.price_min === "number" && typeof brief.price_max === "number") {
    lines.push(
      `- **Kalkulierte Preisspanne:** ${formatEuro(brief.price_min)} – ${formatEuro(brief.price_max)}`,
    );
  }
  lines.push("");

  // --- Preisrechner-Zusammenfassung (falls vorhanden) ---
  const summary = brief.data?._summary;
  if (summary && (summary.projectType || summary.features?.length)) {
    lines.push("## Preisrechner-Auswahl");
    if (summary.projectType) lines.push(`- **Projektart:** ${summary.projectType}`);
    if (summary.design) lines.push(`- **Design:** ${summary.design}`);
    if (summary.features?.length) lines.push(`- **Features:** ${summary.features.join(", ")}`);
    if (typeof summary.extraLanguages === "number" && summary.extraLanguages > 0) {
      lines.push(`- **Zusatzsprachen:** ${summary.extraLanguages}`);
    }
    if (typeof summary.maintenance === "boolean") {
      lines.push(`- **Wartung:** ${summary.maintenance ? "Ja" : "Nein"}`);
    }
    lines.push("");
  }

  // --- Alle Konfigurator-Schritte ---
  for (const step of BRIEF_STEPS) {
    const answered = step.fields.filter((f) => isAnswered(brief.data?.[f.name]));
    if (answered.length === 0) continue;

    lines.push(`## ${step.title}`);
    for (const field of answered) {
      const value = brief.data[field.name];
      lines.push(`- **${field.label}:** ${displayValue(value)}`);

      // Erläuterungen zu ausgewählten Optionen (geben Claude Kontext, was die
      // jeweilige Auswahl konkret bedeutet).
      if (field.optionDetails) {
        const selected = Array.isArray(value) ? value : [value];
        for (const sel of selected) {
          const detail = field.optionDetails[sel];
          if (detail) lines.push(`  - _${sel}:_ ${detail}`);
        }
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}
