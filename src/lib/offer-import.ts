import {
  BRIEF_STEPS,
  computeBriefEstimate,
  displayValue,
  isFieldVisible,
  type BriefData,
  type BriefSummary,
} from "@/lib/brief";
import { PRICING, formatEuro, type DesignType, type FeatureKey } from "@/lib/pricing";
import { computeTotals, type LineItem } from "@/lib/documents";

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

/** Lesbares Label der Projektart, z. B. „One-Pager / Landingpage". */
function projectLabel(summary: BriefSummary): string | null {
  const pt = summary.projectType;
  return pt && pt in PRICING.projectTypes
    ? PRICING.projectTypes[pt as keyof typeof PRICING.projectTypes].label
    : null;
}

/**
 * Sammelt alle einmaligen Angebots-Positionen aus einem Brief.
 *
 * Preise sind im Rechner Spannen, fürs Angebot wird je Position der Mittelwert
 * angesetzt; einmalige Posten der Detailauswahl (z. B. zusätzliche Seiten) haben
 * feste Preise und werden direkt übernommen. Laufende Kosten (Hosting, Wartung)
 * bleiben bewusst außen vor, ein Angebot ist einmalig.
 */
function collectBriefLineItems(data: BriefData, summary: BriefSummary): LineItem[] {
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

  return items;
}

/**
 * Itemisierte Positionen (je Leistung ein Preis) — für Rechnungen, bei denen
 * die Aufschlüsselung gewünscht ist. Der Admin kann jede Position frei anpassen.
 */
export function briefToLineItems(data: BriefData, summary: BriefSummary): LineItem[] {
  const items = collectBriefLineItems(data, summary);
  return items.length > 0 ? items : [{ description: "", quantity: 1, unit_price: 0 }];
}

/**
 * Angebots-Positionen: bewusst KEINE Einzelpreise. Alle Leistungen werden
 * gebündelt als ein „Komplettpaket" mit einem einzigen Gesamtpreis ausgewiesen
 * (Summe der Einzel-Mittelwerte). Die enthaltenen Leistungen stehen im
 * Einleitungstext (`briefToOfferText`). Der Admin kann den Preis frei anpassen.
 */
export function briefToOfferLineItems(data: BriefData, summary: BriefSummary): LineItem[] {
  const items = collectBriefLineItems(data, summary);
  if (items.length === 0) return [{ description: "", quantity: 1, unit_price: 0 }];

  const total = computeTotals(items, 0).net;
  const label = projectLabel(summary);
  return [
    {
      description: label
        ? `${label} – Komplettpaket (alle Leistungen inklusive)`
        : "Website-Komplettpaket (alle Leistungen inklusive)",
      quantity: 1,
      unit_price: total,
    },
  ];
}

/**
 * Herzhafte, persönliche Angebots-Einleitung: begrüßt den Kunden, listet alle
 * enthaltenen Leistungen appetitlich auf und nennt den Gesamtpreis warm statt
 * als nüchterne Spanne. Wird beim Import automatisch ins Angebot übernommen.
 */
export function briefToOfferText(brief: BriefLike): string {
  const data = brief.data ?? {};
  const summary = brief.data?._summary ?? { projectType: brief.project_type ?? undefined };

  const firstName = (brief.name || "").trim().split(/\s+/)[0] || "";
  const company =
    brief.company?.trim() ||
    (typeof data.companyName === "string" ? data.companyName.trim() : "") ||
    "";
  const label = projectLabel(summary);

  const items = collectBriefLineItems(data, summary);
  const services = items.map((i) => i.description);
  const total = computeTotals(items, 0).net;
  const estimate = computeBriefEstimate(data, summary);

  const lines: string[] = [];

  lines.push(firstName ? `Hallo ${firstName},` : "Hallo,");
  lines.push("");
  lines.push(
    "vielen Dank für deine Anfrage über unseren Projekt-Konfigurator! Wir haben uns " +
      `deine Wünsche${company ? ` für ${company}` : ""} ganz genau angeschaut und daraus ein ` +
      `rundum sorgloses Komplettpaket${label ? ` als ${label}` : ""} geschnürt – ` +
      "maßgeschneidert, ohne Schnickschnack und ohne versteckte Kosten. 🚀",
  );

  if (services.length > 0) {
    lines.push("");
    lines.push("Das ist alles mit dabei:");
    for (const s of services) lines.push(`- ${s}`);
  }

  lines.push("");
  if (total > 0) {
    lines.push(
      `Alles zusammen, ein fairer Festpreis: ${formatEuro(total)} (einmalig, alle oben ` +
        "genannten Leistungen inklusive).",
    );
    if (estimate.monthlyMax > 0) {
      lines.push(
        `Hosting & Pflege halten deine Seite dauerhaft schnell und sicher – ab ` +
          `${formatEuro(estimate.monthlyMin)}/Monat, ganz transparent und jederzeit kündbar.`,
      );
    }
  }

  lines.push("");
  lines.push("Wir freuen uns riesig darauf, dein Projekt gemeinsam zum Leben zu erwecken!");

  return lines.join("\n").trim();
}
