import { z } from "zod";
import { pricingConfig } from "../../pricing.config";

/**
 * Preislogik des OTIGO-Preisrechners.
 *
 * Eine einzige Quelle der Wahrheit für Validierung UND Berechnung – genutzt
 * sowohl im Client (Live-Berechnung, React-Hook-Form) als auch in der Server
 * Action (erneute Validierung + Speicherung). Reines Modul ohne
 * "use client"/"use server", damit beide Seiten es importieren können.
 *
 * Die eigentlichen Preise stehen bewusst in `pricing.config.ts` im
 * Projekt-Hauptverzeichnis und können dort ohne Code-Kenntnisse angepasst
 * werden. Dieses Modul stellt nur die Typisierung, Validierung und Rechenlogik
 * darum bereit.
 */

/** Einmalpreis-Spanne bzw. monatliche Spanne als [min, max] in Euro. */
type Range = readonly [number, number];

/** Preise & Labels stammen aus der editierbaren Root-Konfiguration. */
export const PRICING = {
  /** SEO-Grundoptimierung ist immer inklusive (Standardqualität). */
  seoIncluded: true,
  ...pricingConfig,
} as const;

export type ProjectType = keyof typeof PRICING.projectTypes;
export type DesignType = keyof typeof PRICING.designMultiplier;
export type FeatureKey = keyof typeof PRICING.features;

export const PROJECT_TYPES = Object.keys(PRICING.projectTypes) as ProjectType[];
export const FEATURE_KEYS = Object.keys(PRICING.features) as FeatureKey[];

// ---------------------------------------------------------------------------
// Validierung (Zod) – identisch im Client (RHF) und auf dem Server.
// ---------------------------------------------------------------------------

export const quoteSelectionSchema = z.object({
  projectType: z.enum(PROJECT_TYPES as [ProjectType, ...ProjectType[]]),
  design: z.enum(["custom", "template"]),
  features: z.array(z.enum(FEATURE_KEYS as [FeatureKey, ...FeatureKey[]])),
  extraLanguages: z.number().int().min(0).max(PRICING.extraLanguage.max),
  maintenance: z.boolean(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen an."),
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an."),
  phone: z.string().max(40).optional(),
  company: z.string().max(120).optional(),
  message: z.string().max(1000).optional(),
});

/** Vollständige Eingabe, die an die Server Action gesendet wird. */
export const quoteLeadSchema = quoteSelectionSchema.extend(contactSchema.shape);

export type QuoteSelection = z.infer<typeof quoteSelectionSchema>;
export type QuoteLeadInput = z.infer<typeof quoteLeadSchema>;

// ---------------------------------------------------------------------------
// Berechnung
// ---------------------------------------------------------------------------

export type PriceResult = {
  oneTimeMin: number;
  oneTimeMax: number;
  monthlyMin: number;
  monthlyMax: number;
  /** True bei "komplexem Online-Shop" → grobe Spanne + Planungs-Hinweis. */
  isComplex: boolean;
};

/** Auf den in der Config gesetzten Wert runden (saubere Beträge). */
const roundTo = (value: number) => {
  const step = PRICING.roundTo;
  return step > 0 ? Math.round(value / step) * step : Math.round(value);
};

export function calculatePrice(selection: QuoteSelection): PriceResult {
  const project = PRICING.projectTypes[selection.projectType];
  const factor = PRICING.designMultiplier[selection.design];

  const base: Range = project.base;
  let min = base[0] * factor;
  let max = base[1] * factor;

  for (const feature of selection.features) {
    const [fMin, fMax] = PRICING.features[feature].price;
    min += fMin;
    max += fMax;
  }

  min += selection.extraLanguages * PRICING.extraLanguage.price[0];
  max += selection.extraLanguages * PRICING.extraLanguage.price[1];

  // Wartung & Hosting ist pro Projektart gestaffelt.
  const maintenanceRange = PRICING.maintenance.byProjectType[selection.projectType];

  return {
    oneTimeMin: roundTo(min),
    oneTimeMax: roundTo(max),
    monthlyMin: selection.maintenance ? maintenanceRange[0] : 0,
    monthlyMax: selection.maintenance ? maintenanceRange[1] : 0,
    isComplex: project.complex,
  };
}

/** Wartungs-/Hosting-Spanne für eine Projektart (für die Live-Anzeige). */
export function maintenanceRangeFor(projectType: ProjectType): Range {
  return PRICING.maintenance.byProjectType[projectType];
}

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuro(value: number): string {
  return euroFormatter.format(value);
}
