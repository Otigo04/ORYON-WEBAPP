"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PRICING,
  PROJECT_TYPES,
  FEATURE_KEYS,
  calculatePrice,
  formatEuro,
  quoteLeadSchema,
  type QuoteLeadInput,
  type FeatureKey,
} from "@/lib/pricing";
import { saveQuoteLead, type SaveQuoteState } from "@/lib/actions/leads";

/**
 * Interaktiver Preisrechner (Client Component).
 *
 * Einseitiges Tool mit Live-Preisberechnung: Während der Nutzer Projektart,
 * Design und Features wählt, aktualisiert sich die Preisspanne sofort. Der Preis
 * ist jederzeit sichtbar – zum Absenden (= unverbindliches Angebot anfordern)
 * sind Kontaktdaten Pflicht. Validierung via Zod (Client) + erneut serverseitig
 * in der Server Action `saveQuoteLead`.
 */
export function Preisrechner() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<SaveQuoteState | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<QuoteLeadInput>({
    resolver: zodResolver(quoteLeadSchema),
    defaultValues: {
      projectType: "onepager",
      design: "custom",
      features: [],
      extraLanguages: 0,
      maintenance: false,
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  const projectType = useWatch({ control, name: "projectType" });
  const design = useWatch({ control, name: "design" });
  const features = useWatch({ control, name: "features" });
  const extraLanguages = useWatch({ control, name: "extraLanguages" });
  const maintenance = useWatch({ control, name: "maintenance" });

  const price = useMemo(
    () => calculatePrice({ projectType, design, features, extraLanguages, maintenance }),
    [projectType, design, features, extraLanguages, maintenance],
  );

  const toggleFeature = (key: FeatureKey) => {
    const next = features.includes(key)
      ? features.filter((f) => f !== key)
      : [...features, key];
    setValue("features", next, { shouldValidate: true });
  };

  const setLanguages = (n: number) => {
    const clamped = Math.max(0, Math.min(PRICING.extraLanguage.max, n));
    setValue("extraLanguages", clamped, { shouldValidate: true });
  };

  const onSubmit = handleSubmit((values) => {
    setState(null);
    startTransition(async () => {
      const result = await saveQuoteLead(values);
      if (!result.ok && result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof QuoteLeadInput, { message: messages[0] });
          }
        }
      }
      setState(result);
    });
  });

  if (state?.ok) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-[#09ed2d]/30 bg-gradient-to-br from-[#09ed2d]/10 via-white/[0.03] to-black p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#09ed2d]/15 text-[#09ed2d]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
            <path
              d="m5 13 4 4 10-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-white">Anfrage erhalten!</h2>
        <p className="mt-3 text-white/60">
          Danke! Wir melden uns innerhalb von 24 Stunden mit deinem unverbindlichen
          Angebot. Dein Richtpreis lag bei{" "}
          <span className="font-semibold text-white">
            {formatEuro(price.oneTimeMin)} – {formatEuro(price.oneTimeMax)}
          </span>
          .
        </p>
        {state.demo && (
          <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/40">
            Demo-Modus: Supabase ist nicht konfiguriert – die Anfrage wurde nicht
            gespeichert.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Linke Spalte: Optionen */}
      <div className="flex flex-col gap-10">
        <Fieldset legend="1 · Projektart" hint="Was möchtest du umsetzen?">
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECT_TYPES.map((key) => {
              const pt = PRICING.projectTypes[key];
              const active = projectType === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setValue("projectType", key, { shouldValidate: true })}
                  aria-pressed={active}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-[#09ed2d] bg-[#09ed2d]/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                >
                  <span className="font-medium text-white">{pt.label}</span>
                  <span className="text-xs text-white/50">
                    {pt.complex ? "Individuelle Planung" : `ab ${formatEuro(pt.base[0])}`}
                  </span>
                </button>
              );
            })}
          </div>
        </Fieldset>

        <Fieldset legend="2 · Design" hint="Maßgeschneidert oder auf Vorlagen-Basis?">
          <div className="grid grid-cols-2 gap-3">
            {(["custom", "template"] as const).map((key) => {
              const active = design === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setValue("design", key, { shouldValidate: true })}
                  aria-pressed={active}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-[#09ed2d] bg-[#09ed2d]/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                >
                  <span className="font-medium text-white">{PRICING.designLabel[key]}</span>
                  <span className="text-xs text-white/50">
                    {key === "template" ? "günstiger (−20 %)" : "voller Funktionsumfang"}
                  </span>
                </button>
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
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleFeature(key)}
                  aria-pressed={active}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-[#09ed2d] bg-[#09ed2d]/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                >
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
                  <span className="flex flex-col gap-0.5">
                    <span className="font-medium text-white">{feature.label}</span>
                    <span className="text-xs text-white/50">{feature.hint}</span>
                    <span className="text-xs text-[#09ed2d]">+ ab {formatEuro(feature.price[0])}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sprachen-Stepper */}
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-white">Weitere Sprachen</span>
              <span className="text-xs text-white/50">
                Mehrsprachigkeit · + ab {formatEuro(PRICING.extraLanguage.price[0])}/Sprache
              </span>
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

          {/* Wartung & Hosting (monatlich) */}
          <button
            type="button"
            onClick={() => setValue("maintenance", !maintenance, { shouldValidate: true })}
            aria-pressed={maintenance}
            className={`mt-3 flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
              maintenance
                ? "border-[#09ed2d] bg-[#09ed2d]/10"
                : "border-white/10 bg-white/5 hover:border-white/25"
            }`}
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-medium text-white">{PRICING.maintenance.label}</span>
              <span className="text-xs text-white/50">
                Monatlich · ab {formatEuro(PRICING.maintenance.price[0])}/Monat
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
          </button>
        </Fieldset>
      </div>

      {/* Rechte Spalte: Live-Preis + Kontakt */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl border border-[#09ed2d]/20 bg-gradient-to-br from-[#09ed2d]/10 via-white/[0.03] to-black p-6">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Dein Richtpreis
          </span>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-white">
            <AnimatedEuro value={price.oneTimeMin} /> – <AnimatedEuro value={price.oneTimeMax} />
          </p>
          {price.monthlyMax > 0 && (
            <p className="mt-1 text-sm tabular-nums text-white/70">
              + <AnimatedEuro value={price.monthlyMin} /> – <AnimatedEuro value={price.monthlyMax} /> /
              Monat (Wartung)
            </p>
          )}

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
              wir in einem individuellen Planungsgespräch.
            </p>
          )}

          {/* Kontaktformular (Pflicht zum Absenden) */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="text-sm font-semibold text-white">
              Unverbindliches Angebot anfordern
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Wir melden uns innerhalb von 24 Stunden.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Field label="Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                  placeholder="Max Mustermann"
                />
              </Field>
              <Field label="E-Mail" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  placeholder="max@firma.de"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Telefon" optional error={errors.phone?.message}>
                  <input
                    {...register("phone")}
                    type="tel"
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="+49 …"
                  />
                </Field>
                <Field label="Firma" optional error={errors.company?.message}>
                  <input
                    {...register("company")}
                    type="text"
                    autoComplete="organization"
                    className={inputClass}
                    placeholder="Firma"
                  />
                </Field>
              </div>
              <Field label="Nachricht" optional error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Worum geht es? (optional)"
                />
              </Field>
            </div>

            {state?.error && (
              <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Wird gesendet …" : "Angebot anfordern"}
            </button>
          </div>
        </div>
      </aside>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#09ed2d]/60 focus:ring-1 focus:ring-[#09ed2d]/40";

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

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="text-xs text-white/60">
        {label}
        {optional && <span className="text-white/30"> (optional)</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
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
 * Zählt einen Zahlenwert sanft hoch bzw. runter, wenn er sich ändert
 * (easeOutCubic). Sorgt für die "lebendigen", clean nach oben/unten laufenden
 * Live-Preise im Rechner.
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
