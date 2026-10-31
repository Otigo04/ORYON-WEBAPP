import { pricingConfig } from "../../pricing.config";

/**
 * Preislogik des TAS-Preisrechners (Berechnung + Formatierung).
 *
 * Reines Modul ohne "use client"/"use server" und ohne zod, damit es im
 * Client-Bundle klein bleibt. Die Validierungs-Schemas stehen in
 * `pricing-schemas.ts` (nur Server/Formulare).
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

/** Einstiegspreise für Texte auf der Website – ausschließlich aus der Config. */
export const ENTRY_PRICE = PRICING.projectTypes.onepager.base[0];
export const WEBSITE_PRICE = PRICING.projectTypes.website.base[0];
export const BOOKING_PRICE = PRICING.projectTypes.booking.base[0];
export const PORTFOLIO_PRICE = PRICING.projectTypes.portfolio.base[0];
export const WEBAPP_PRICE = PRICING.projectTypes.webapp.base[0];

export type ProjectType = keyof typeof PRICING.projectTypes;
export type DesignType = keyof typeof PRICING.designLabel;
export type FeatureKey = keyof typeof PRICING.features;

export const PROJECT_TYPES = Object.keys(PRICING.projectTypes) as ProjectType[];
export const FEATURE_KEYS = Object.keys(PRICING.features) as FeatureKey[];

/** Auswahl des Preisrechners (Client + Server). Zod-Schema: `pricing-schemas.ts`. */
export type QuoteSelection = {
  projectType: ProjectType;
  design: DesignType;
  features: FeatureKey[];
  extraLanguages: number;
  maintenance: boolean;
};

// ---------------------------------------------------------------------------
// Berechnung
// ---------------------------------------------------------------------------

export type PriceResult = {
  oneTimeMin: number;
  oneTimeMax: number;
  /** Hosting – fällt immer an (eigener, dauerhaft sichtbarer Posten). */
  hostingMin: number;
  hostingMax: number;
  /** Wartung & Pflege – nur wenn gewählt (sonst 0). */
  maintenanceMin: number;
  maintenanceMax: number;
  /** Gesamte monatliche Spanne (Hosting + ggf. Wartung). */
  monthlyMin: number;
  monthlyMax: number;
  /** True bei komplexer Web-App → grobe Spanne + Planungs-Hinweis. */
  isComplex: boolean;
};

/** Auf den in der Config gesetzten Wert runden (saubere Beträge). */
const roundTo = (value: number) => {
  const step = PRICING.roundTo;
  return step > 0 ? Math.round(value / step) * step : Math.round(value);
};

export function calculatePrice(selection: QuoteSelection): PriceResult {
  const project = PRICING.projectTypes[selection.projectType];

  const base: Range = project.base;
  let min = base[0];
  let max = base[1];

  for (const feature of selection.features) {
    const [fMin, fMax] = PRICING.features[feature].price;
    min += fMin;
    max += fMax;
  }

  min += selection.extraLanguages * PRICING.extraLanguage.price[0];
  max += selection.extraLanguages * PRICING.extraLanguage.price[1];

  // Laufende Kosten je Projektart: Hosting immer, Wartung nur wenn gewählt.
  const hostingRange = PRICING.hosting.byProjectType[selection.projectType];
  const maintenanceRange = PRICING.maintenance.byProjectType[selection.projectType];

  const maintenanceMin = selection.maintenance ? maintenanceRange[0] : 0;
  const maintenanceMax = selection.maintenance ? maintenanceRange[1] : 0;

  return {
    oneTimeMin: roundTo(min),
    oneTimeMax: roundTo(max),
    hostingMin: hostingRange[0],
    hostingMax: hostingRange[1],
    maintenanceMin,
    maintenanceMax,
    monthlyMin: hostingRange[0] + maintenanceMin,
    monthlyMax: hostingRange[1] + maintenanceMax,
    isComplex: project.complex,
  };
}

/** Hosting-Spanne für eine Projektart (eigener, dauerhaft sichtbarer Posten). */
export function hostingRangeFor(projectType: ProjectType): Range {
  return PRICING.hosting.byProjectType[projectType];
}

/** Wartungs-/Pflege-Spanne für eine Projektart (für die Live-Anzeige). */
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

/**
 * Formatiert eine Preisspanne. Sind Min und Max gleich (z. B. wenn keine
 * Spanne nötig ist), wird nur ein einzelner Betrag ausgegeben – sonst die
 * Spanne „min – max". Zentral, damit alle Anzeigen einheitlich mit Ranges
 * arbeiten.
 */
export function formatRange(min: number, max: number): string {
  return min === max ? formatEuro(min) : `${formatEuro(min)} – ${formatEuro(max)}`;
}
