import {
  BRIEF_STEPS,
  displayValue,
  isFieldVisible,
  type BriefData,
  type BriefSummary,
} from "@/lib/brief";
import { PRICING, type DesignType, type FeatureKey } from "@/lib/pricing";
import type { LineItem } from "@/lib/documents";

const mid = (a: number, b: number) => Math.round((a + b) / 2);

/**
 * Strukturelle Teilmenge eines Konfigurator-Briefs (siehe `@/lib/briefs`).
 * Bewusst lokal getypt, damit dieses client-sichere Modul nicht das
 * server-gebundene `briefs.ts` (Supabase) in den Browser-Bundle zieht.
 */
type BriefLike = {
  name: string;
  company: string | null;
  project_type: string | null;
  price_min: number | null;
  price_max: number | null;
  data: BriefData & { _summary?: BriefSummary };
};

/**
 * Schlägt einen Dokument-Titel aus einem Brief vor:
 * „<Projektart> – <Firma>", z. B. „Unternehmensseite – Mustermann GmbH".
 */
export function briefDocumentTitle(brief: BriefLike): string {
  const company =
    brief.company?.trim() ||
    (typeof brief.data?.companyName === "string" ? brief.data.companyName.trim() : "") ||
    brief.name;
  const pt = brief.data?._summary?.projectType ?? brief.project_type ?? undefined;
  const label =
    pt && pt in PRICING.projectTypes
      ? PRICING.projectTypes[pt as keyof typeof PRICING.projectTypes].label
      : undefined;
  return label ? `${label} – ${company}` : `Projekt – ${company}`;
}

/**
 * Baut eine lesbare Zusammenfassung aller im Konfigurator beantworteten Felder
 * (nach Schritten gruppiert, versteckte Felder ausgelassen) plus Richtwert.
 * Dient als Vorbefüllung für Konzept-Inhalt bzw. Angebots-Einleitung.
 */
export function briefToSummaryText(brief: BriefLike): string {
  const data = brief.data ?? {};
  const blocks: string[] = [];

  for (const step of BRIEF_STEPS) {
    const lines: string[] = [];
    for (const field of step.fields) {
      if (!isFieldVisible(field, data)) continue;
      const text = displayValue(data[field.name]);
      if (text && text !== "—") lines.push(`- ${field.label}: ${text}`);
    }
    if (lines.length) blocks.push(`## ${step.title}\n${lines.join("\n")}`);
  }

  if (brief.price_min != null && brief.price_max != null) {
    blocks.push(`## Richtwert\n- Geschätzte Spanne: ${brief.price_min}–${brief.price_max} €`);
  }

  return blocks.join("\n\n").trim();
}

/**
 * Wandelt eine Konfigurator-Anfrage (Brief) in konkrete Angebots-Positionen um.
 *
 * Preise sind im Rechner Spannen, fürs Angebot wird je Position der Mittelwert
 * angesetzt; einmalige Posten der Detailauswahl (z. B. zusätzliche Seiten) haben
 * feste Preise und werden direkt übernommen. Laufende Kosten (Hosting, Wartung)
 * bleiben bewusst außen vor, ein Angebot ist einmalig. Der Admin kann nach dem
 * Import jede Position frei anpassen.
 */
export function briefToLineItems(data: BriefData, summary: BriefSummary): LineItem[] {
  const items: LineItem[] = [];

  // 1) Basis aus Projektart × Design-Faktor.
  const pt = summary.projectType;
  if (pt && pt in PRICING.projectTypes) {
    const project = PRICING.projectTypes[pt as keyof typeof PRICING.projectTypes];
    const factor =
      summary.design && summary.design in PRICING.designMultiplier
        ? PRICING.designMultiplier[summary.design as DesignType]
        : 1;
    items.push({
      description: `${project.label} (Basis${summary.design === "template" ? " · Template" : ""})`,
      quantity: 1,
      unit_price: Math.round(mid(project.base[0], project.base[1]) * factor),
    });
  }

  // 2) Features aus der Paket-Vorauswahl.
  for (const f of summary.features ?? []) {
    if (f in PRICING.features) {
      const feat = PRICING.features[f as FeatureKey];
      items.push({ description: feat.label, quantity: 1, unit_price: mid(feat.price[0], feat.price[1]) });
    }
  }

  // 3) Weitere Sprachen.
  const langs = summary.extraLanguages ?? 0;
  if (langs > 0) {
    items.push({
      description: `Weitere Sprachen (${langs})`,
      quantity: langs,
      unit_price: mid(PRICING.extraLanguage.price[0], PRICING.extraLanguage.price[1]),
    });
  }

  // 4) Bepreiste Optionen aus der Detailauswahl (feste Einmalpreise).
  for (const step of BRIEF_STEPS) {
    for (const field of step.fields) {
      if (!field.prices || !isFieldVisible(field, data)) continue;
      const value = data[field.name];
      const selected = Array.isArray(value) ? value : value ? [value] : [];
      for (const opt of selected) {
        const price = field.prices[opt];
        if (price && price > 0) {
          items.push({ description: `${field.label}: ${opt}`, quantity: 1, unit_price: price });
        }
      }
    }
  }

  return items.length > 0 ? items : [{ description: "", quantity: 1, unit_price: 0 }];
}
