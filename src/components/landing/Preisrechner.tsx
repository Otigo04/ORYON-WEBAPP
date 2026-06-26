"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { BRIEF_STORAGE_KEY, emptyDraft, type BriefDraft } from "@/lib/brief";
import {
  PRICING,
  PROJECT_TYPES,
  FEATURE_KEYS,
  calculatePrice,
  maintenanceRangeFor,
  formatEuro,
  formatRange,
  type FeatureKey,
  type ProjectType,
  type DesignType,
} from "@/lib/pricing";

/**
 * Preisrechner-Vorauswahl (Client Component).
 *
 * Bewusst nur der erste, schnelle Schritt: Projektart, Design und Features
 * zusammenklicken und einen groben Richtwert (immer als Spanne) sehen. Die
 * eigentliche, genaue Kalkulation – inklusive Angebot/Kontakt – findet
 * ausschließlich im ausführlichen Konfigurator statt. „Weiter kalkulieren"
 * übergibt die Auswahl dorthin (localStorage), wo sie sichtbar und anpassbar ist.
 */
export function Preisrechner() {
  const router = useRouter();

  const [projectType, setProjectType] = useState<ProjectType>("onepager");
  const [design, setDesign] = useState<DesignType>("custom");
  const [features, setFeatures] = useState<FeatureKey[]>([]);
  const [extraLanguages, setExtraLanguages] = useState(0);
  const [maintenance, setMaintenance] = useState(false);

  const price = useMemo(
    () => calculatePrice({ projectType, design, features, extraLanguages, maintenance }),
    [projectType, design, features, extraLanguages, maintenance],
  );

  const maintenanceRange = maintenanceRangeFor(projectType);

  const toggleFeature = (key: FeatureKey) => {
    setFeatures((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));
  };

  const setLanguages = (n: number) => {
    setExtraLanguages(Math.max(0, Math.min(PRICING.extraLanguage.max, n)));
  };

  /**
   * Übergibt die aktuelle Auswahl an den ausführlichen Konfigurator: schreibt sie
   * in denselben Entwurfs-Speicher (localStorage), den der Konfigurator liest, und
   * navigiert dann dorthin. Vorhandene Detail-Eingaben bleiben erhalten – nur die
   * Paket-Zusammenfassung wird aktualisiert.
   */
  const goToConfigurator = () => {
    let existing: BriefDraft = emptyDraft();
    try {
      const raw = localStorage.getItem(BRIEF_STORAGE_KEY);
      if (raw) existing = { ...existing, ...(JSON.parse(raw) as BriefDraft) };
    } catch {
      /* kein/defekter Entwurf – mit leerem starten */
    }

    const next: BriefDraft = {
      data: existing.data ?? {},
      contact: existing.contact ?? emptyDraft().contact,
      summary: {
        projectType,
        design,
        features,
        extraLanguages,
        maintenance,
        priceMin: price.oneTimeMin,
        priceMax: price.oneTimeMax,
      },
    };

    try {
      localStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Speicher nicht verfügbar – Konfigurator startet dann leer */
    }
    router.push("/konfigurator");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Linke Spalte: Optionen */}
      <div className="flex flex-col gap-8 sm:gap-10">
        {/* Mobile-Preisvorschau: auf dem Handy oben sichtbar. Auf Desktop ausgeblendet. */}
        <div className="sticky top-20 z-20 -mt-2 rounded-2xl border border-[#09ed2d]/25 bg-black/80 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#09ed2d]">
              Grober Richtwert
            </span>
            <span className="text-lg font-semibold tabular-nums text-white">
              <AnimatedEuro value={price.oneTimeMin} /> – <AnimatedEuro value={price.oneTimeMax} />
            </span>
          </div>
        </div>

        <Fieldset legend="1 · Projektart" hint="Was möchtest du umsetzen?">
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECT_TYPES.map((key) => {
              const pt = PRICING.projectTypes[key];
              const active = projectType === key;
              return (
                <OptionCard
                  key={key}
                  active={active}
                  label={pt.label}
                  onSelect={() => setProjectType(key)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-white">{pt.label}</span>
                      <span className="text-xs text-white/50">
                        {pt.complex ? "Individuelle Planung" : `ab ${formatEuro(pt.base[0])}`}
                      </span>
                    </div>
                    <HelpTip label={pt.label} text={HELP.project[key]} />
                  </div>
                </OptionCard>
              );
            })}
          </div>
        </Fieldset>

        <Fieldset legend="2 · Design" hint="Maßgeschneidert oder auf Vorlagen-Basis?">
          <div className="grid grid-cols-2 gap-3">
            {(["custom", "template"] as const).map((key) => {
              const active = design === key;
              return (
                <OptionCard
                  key={key}
                  active={active}
                  label={PRICING.designLabel[key]}
                  onSelect={() => setDesign(key)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-white">{PRICING.designLabel[key]}</span>
                      <span className="text-xs text-white/50">
                        {key === "template" ? "günstiger (−20 %)" : "voller Funktionsumfang"}
                      </span>
                    </div>
                    <HelpTip label={PRICING.designLabel[key]} text={HELP.design[key]} />
                  </div>
                </OptionCard>
              );
            })}
          </div>
        </Fieldset>

        <Fieldset legend="3 · Features" hint="Optional – kombiniere, was du brauchst.">
          <div className="grid gap-3 sm:grid-cols-2">
            {FEATURE_KEYS.map((key) => {
              const feature = PRICING.features[key];
              const active = features.includes(key);
              return (
                <OptionCard
                  key={key}
                  active={active}
                  label={feature.label}
                  onSelect={() => toggleFeature(key)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border ${
                        active ? "border-[#09ed2d] bg-[#09ed2d] text-black" : "border-white/30"
                      }`}
                    >
                      {active && (
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
                          <path
                            d="m5 13 4 4 10-10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-white">{feature.label}</span>
                        <HelpTip label={feature.label} text={HELP.feature[key]} />
                      </span>
                      <span className="text-xs text-white/50">{feature.hint}</span>
                    </span>
                  </div>
                </OptionCard>
              );
            })}
          </div>

          {/* Sprachen-Stepper */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5 font-medium text-white">
                Weitere Sprachen
                <HelpTip label="Weitere Sprachen" text={HELP.languages} />
              </span>
              <span className="text-xs text-white/50">Mehrsprachigkeit · je Sprache mit Aufpreis</span>
            </div>
            <div className="flex items-center gap-3">
              <Stepper
                label="Weniger Sprachen"
                symbol="−"
                disabled={extraLanguages <= 0}
                onClick={() => setLanguages(extraLanguages - 1)}
              />
              <span className="w-6 text-center font-semibold text-white">{extraLanguages}</span>
              <Stepper
                label="Mehr Sprachen"
                symbol="+"
                disabled={extraLanguages >= PRICING.extraLanguage.max}
                onClick={() => setLanguages(extraLanguages + 1)}
              />
            </div>
          </div>

          {/* Wartung & Hosting (monatlich, projektabhängig) */}
          <div
            className={`relative mt-3 rounded-xl border p-4 transition ${
              maintenance
                ? "border-[#09ed2d] bg-[#09ed2d]/10"
                : "border-white/10 bg-white/5 hover:border-white/25"
            }`}
          >
            <button
              type="button"
              onClick={() => setMaintenance((m) => !m)}
              aria-pressed={maintenance}
              aria-label={PRICING.maintenance.label}
              className="absolute inset-0 z-0 rounded-xl"
            />
            <div className="pointer-events-none relative z-10 flex items-center justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1.5 font-medium text-white">
                  {PRICING.maintenance.label}
                  <HelpTip label={PRICING.maintenance.label} text={HELP.maintenance} />
                </span>
                <span className="text-xs text-white/50">
                  Monatlich · ab {formatEuro(maintenanceRange[0])}/Monat
                </span>
              </span>
              <span
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
                  maintenance ? "bg-[#09ed2d]" : "bg-white/15"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                    maintenance ? "left-[1.375rem]" : "left-0.5"
                  }`}
                />
              </span>
            </div>
          </div>
        </Fieldset>
      </div>

      {/* Rechte Spalte: grober Richtwert + Weiterleitung in den Konfigurator */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-[#09ed2d]/20 bg-gradient-to-br from-[#09ed2d]/10 via-white/[0.03] to-black p-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Grober Richtwert
          </span>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <p className="text-3xl font-semibold tracking-tight tabular-nums text-white">
              <AnimatedEuro value={price.oneTimeMin} /> – <AnimatedEuro value={price.oneTimeMax} />
            </p>
            <span className="text-xs text-white/45">einmalig</span>
          </div>

          {/* Laufende Kosten als Spanne */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">
              Laufende Kosten
            </p>
            <dl className="mt-2.5 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-white/70">
                  <Dot /> Hosting
                </dt>
                <dd className="tabular-nums text-white/80">
                  {formatRange(price.hostingMin, price.hostingMax)}/Mt.
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-white/70">
                  <Dot /> Wartung &amp; Pflege
                  {!maintenance && <span className="text-white/35">(optional)</span>}
                </dt>
                <dd className="tabular-nums text-white/80">
                  {maintenance ? (
                    <>+ {formatRange(price.maintenanceMin, price.maintenanceMax)}</>
                  ) : (
                    <span className="text-white/40">nicht gewählt</span>
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2.5">
              <span className="text-sm font-medium text-white">Summe / Monat</span>
              <span className="text-sm font-semibold tabular-nums text-[#09ed2d]">
                {formatRange(price.monthlyMin, price.monthlyMax)}
              </span>
            </div>
          </div>

          <ul className="mt-4 flex flex-col gap-1.5 text-xs text-white/60">
            <li className="flex items-center gap-2">
              <Dot /> SEO-Grundoptimierung inklusive
            </li>
            <li className="flex items-center gap-2">
              <Dot /> Unverbindliche Schätzung
            </li>
          </ul>

          {price.isComplex && (
            <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200/90">
              Komplexer Online-Shop: nur grobe Spanne. Den genauen Preis ermitteln
              wir im Konfigurator bzw. einem individuellen Planungsgespräch.
            </p>
          )}

          {/* Weiter in den ausführlichen Konfigurator */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="text-sm font-semibold text-white">Jetzt genau kalkulieren</h3>
            <p className="mt-1 text-xs text-white/50">
              Im Detail-Kalkulator gibst du dein Projekt Schritt für Schritt an,
              Firmenname, Domain, Seiten, Funktionen und mehr. Deine Auswahl von hier
              wird übernommen und bleibt anpassbar. Dort forderst du auch dein
              unverbindliches Angebot an.
            </p>
            <RainbowButton
              type="button"
              onClick={goToConfigurator}
              size="lg"
              className="mt-4 w-full"
            >
              Weiter kalkulieren →
            </RainbowButton>
          </div>
        </div>
      </aside>
    </div>
  );
}

/**
 * Kurze, laienverständliche Erklärungen je Punkt – erscheinen im "?"-Tooltip.
 */
const HELP: {
  project: Record<ProjectType, string>;
  design: Record<DesignType, string>;
  feature: Record<FeatureKey, string>;
  languages: string;
  maintenance: string;
} = {
  project: {
    onepager:
      "Eine einzelne, fokussierte Seite – ideal als digitale Visitenkarte oder für eine Kampagne.",
    website:
      "Mehrere Unterseiten (z. B. Start, Über uns, Leistungen, Kontakt) für einen vollständigen Auftritt.",
    shopSimple:
      "Online-Shop mit überschaubarem Sortiment, Warenkorb und sicherer Bezahlung.",
    shopComplex:
      "Großer Shop mit vielen Produkten, Varianten, Filtern und individuellen Funktionen.",
  },
  design: {
    custom:
      "Komplett individuell für deine Marke gestaltet – einzigartig und maßgeschneidert.",
    template:
      "Basiert auf einer bewährten Vorlage, an deine Marke angepasst – schneller und günstiger.",
  },
  feature: {
    content:
      "Wir schreiben professionelle, suchmaschinenoptimierte Texte für deine Seite.",
    booking:
      "Kunden buchen Termine rund um die Uhr online über einen integrierten Kalender.",
    blog: "Ein Redaktionssystem (CMS), mit dem du Beiträge und Inhalte selbst pflegen kannst.",
    branding:
      "Logo-Design und ein einheitliches Erscheinungsbild (Farben, Schriften, Corporate Identity).",
  },
  languages:
    "Deine Seite zusätzlich in weiteren Sprachen – der Preis gilt je zusätzlicher Sprache.",
  maintenance:
    "Laufende Pflege, Sicherheits-Updates, Backups und kleine Inhaltsanpassungen – monatlich. Optional, zusätzlich zum Hosting. Der Preis richtet sich nach der Projektart.",
};

function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="flex flex-col">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#09ed2d]">
          {legend}
        </span>
        {hint && <span className="mt-1 text-sm text-white/50">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function Stepper({
  label,
  symbol,
  disabled,
  onClick,
}: {
  label: string;
  symbol: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-lg leading-none text-white transition hover:border-[#09ed2d]/50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {symbol}
    </button>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#09ed2d]" aria-hidden="true" />;
}

/**
 * Auswahl-Karte mit voller Klickfläche.
 *
 * Der eigentliche Auswahl-Button liegt als unsichtbare Ebene über der gesamten
 * Karte (`absolute inset-0`); der sichtbare Inhalt ist `pointer-events-none`,
 * leitet Klicks also durch. Einzelne interaktive Elemente im Inhalt (z. B. der
 * "?"-Tooltip) reaktivieren ihre Klicks selbst – so liegt kein Button im Button
 * (valides, barrierefreies Markup) und die Karte bleibt komplett anklickbar.
 */
function OptionCard({
  active,
  label,
  onSelect,
  children,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#09ed2d] bg-[#09ed2d]/10"
          : "border-white/10 bg-white/5 hover:border-white/25"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        aria-label={label}
        className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#09ed2d]/50"
      />
      <div className="pointer-events-none relative z-10">{children}</div>
    </div>
  );
}

/**
 * "?"-Symbol mit Hover-/Fokus-Tooltip, das den jeweiligen Punkt in einfacher
 * Sprache erklärt. Reines CSS (group-hover / focus-within) – sofort & ohne
 * State. `pointer-events-auto` macht es auch in durchklickbaren Karten nutzbar.
 */
function HelpTip({ text, label }: { text: string; label: string }) {
  return (
    <span className="group/tip pointer-events-auto relative inline-flex flex-shrink-0">
      <button
        type="button"
        aria-label={`Erklärung: ${label}`}
        onClick={(e) => e.preventDefault()}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-white/25 text-[10px] font-bold leading-none text-white/50 transition hover:border-[#09ed2d]/60 hover:text-[#09ed2d] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#09ed2d]/60"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] right-0 z-50 w-48 translate-y-1 rounded-lg border border-[#09ed2d]/20 bg-black/95 px-3 py-2 text-left text-xs font-normal leading-relaxed text-white/80 opacity-0 shadow-[0_10px_30px_-12px_rgba(9,237,45,0.45)] backdrop-blur-sm transition-all duration-150 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

/**
 * Zählt einen Zahlenwert sanft hoch bzw. runter, wenn er sich ändert
 * (easeOutCubic) – für die lebendigen Live-Werte.
 */
function useCountUp(value: number, duration = 450) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (to - from) * eased);
      fromRef.current = current;
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        setDisplay(to);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return display;
}

function AnimatedEuro({ value }: { value: number }) {
  const display = useCountUp(value);
  return <>{formatEuro(display)}</>;
}
