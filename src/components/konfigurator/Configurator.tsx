"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";
import { LivePreview } from "@/components/konfigurator/LivePreview";
import { createClient } from "@/lib/supabase/client";
import { saveBrief } from "@/lib/actions/brief";
import {
  BRIEF_STEPS,
  BRIEF_STORAGE_KEY,
  BRIEF_HANDOFF_KEY,
  emptyDraft,
  displayValue,
  computeBriefEstimate,
  isFieldVisible,
  type BriefDraft,
  type BriefField,
  type BriefValue,
} from "@/lib/brief";
import {
  PRICING,
  PROJECT_TYPES,
  FEATURE_KEYS,
  formatEuro,
  formatRange,
  maintenanceRangeFor,
  type ProjectType,
  type DesignType,
  type FeatureKey,
} from "@/lib/pricing";

// Schritt 0 = Paket-Vorauswahl, dann die Brief-Schritte, zuletzt Kontakt.
const TOTAL = BRIEF_STEPS.length + 2;

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function Configurator() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BriefDraft>(() => emptyDraft());
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Laden: lokaler Entwurf + (falls eingeloggt) Konto-Entwurf -----------
  useEffect(() => {
    let active = true;

    const local = readLocal();
    // Kam der Nutzer gerade frisch über den Landing-Preisrechner? Dann hat seine
    // lokale Auswahl Vorrang vor dem (evtl. älteren) Konto-Entwurf. Marker direkt
    // verbrauchen, damit ein späterer Direktaufruf wieder den Konto-Entwurf bevorzugt.
    const handoff = consumeHandoff();

    const init = async () => {
      let base = local ?? emptyDraft();

      if (hasSupabaseEnv()) {
        try {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            if (active) setUserId(user.id);
            const { data } = await supabase
              .from("brief_drafts")
              .select("data")
              .eq("user_id", user.id)
              .maybeSingle();
            const remote = data?.data as BriefDraft | undefined;
            // Standard: Konto-Entwurf hat Vorrang (geräteübergreifend), lokaler
            // füllt Lücken. Bei frischer Preisrechner-Übergabe (handoff) gewinnt
            // dagegen die lokale Auswahl, der Konto-Entwurf füllt nur Lücken.
            if (remote && remote.data) {
              base = mergeDrafts(remote, base, handoff);
            }
          }
        } catch {
          /* offline / kein Backend, lokaler Entwurf genügt */
        }
      }

      // Paket-Vorauswahl mit sinnvollen Defaults absichern, damit der erste
      // Schritt (und die Live-Kalkulation) auch ohne Preisrechner-Vorlauf greift.
      base = {
        ...base,
        summary: { projectType: "onepager", design: "custom", ...base.summary },
        data: withLockedOptions(base.data),
      };

      if (active) {
        setDraft(base);
        setLoaded(true);
      }
    };

    init();
    return () => {
      active = false;
    };
  }, []);

  // --- Speichern (debounced): lokal immer, Konto wenn eingeloggt -----------
  const persist = useCallback(
    (next: BriefDraft) => {
      try {
        localStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* Speicher voll / privat-Modus */
      }
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (userId && hasSupabaseEnv()) {
        saveTimer.current = setTimeout(async () => {
          try {
            const supabase = createClient();
            await supabase
              .from("brief_drafts")
              .upsert({ user_id: userId, data: next, updated_at: new Date().toISOString() });
          } catch {
            /* still ok, lokal ist gespeichert */
          }
        }, 800);
      }
    },
    [userId],
  );

  const update = useCallback(
    (mutate: (d: BriefDraft) => BriefDraft) => {
      setDraft((prev) => {
        const next = mutate(prev);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const setField = (name: string, value: BriefValue) =>
    update((d) => ({ ...d, data: { ...d.data, [name]: value } }));

  const setContact = (key: keyof BriefDraft["contact"], value: string) =>
    update((d) => ({ ...d, contact: { ...d.contact, [key]: value } }));

  const setSummary = (patch: Partial<BriefDraft["summary"]>) =>
    update((d) => ({ ...d, summary: { ...d.summary, ...patch } }));

  const goTo = (i: number) => {
    setStep(Math.max(0, Math.min(TOTAL - 1, i)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    const fieldErrors: { name?: string; email?: string } = {};
    if (draft.contact.name.trim().length < 2) fieldErrors.name = "Bitte gib deinen Namen an.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email))
      fieldErrors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitError(null);
    startTransition(async () => {
      const result = await saveBrief({
        contact: draft.contact,
        data: draft.data,
        summary: draft.summary,
      });
      if (result.ok) {
        try {
          localStorage.removeItem(BRIEF_STORAGE_KEY);
        } catch {
          /* egal */
        }
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(result.error ?? "Etwas ist schiefgelaufen.");
      }
    });
  };

  if (done) return <SuccessScreen draft={draft} />;

  const isPackageStep = step === 0;
  const isContactStep = step === BRIEF_STEPS.length + 1;
  const current = !isPackageStep && !isContactStep ? BRIEF_STEPS[step - 1] : null;

  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-5 sm:px-6">
      {/* Kopf */}
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="TAS Webworks, Startseite" className="flex items-center">
          <LogoWordmark className="h-11 w-auto sm:h-14" />
        </Link>
        <Link
          href="/#preisrechner"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white"
        >
          Abbrechen
        </Link>
      </header>

      {/* Titel */}
      <div className="mt-8 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
          Projekt-Konfigurator
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Erzähl uns alles über dein Projekt
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/55">
          Je genauer, desto besser dein Angebot. Du kannst jederzeit vor- und
          zurückspringen, deine Angaben werden automatisch gespeichert.
        </p>
      </div>

      {/* Fortschritt / Schritt-Navigation */}
      <Stepper step={step} onJump={goTo} />

      {/* Zweispaltig: links Eingaben (cleanes Schwarz), rechts Kosten-HUD.
          Auf Mobil per flex-col-reverse → Kosten-HUD oben, Eingaben darunter. */}
      <div className="mt-8 flex flex-col-reverse gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(440px,560px)] lg:items-start">
        {/* Linke Spalte: Eingaben */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-white/10 bg-black p-6 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.95)] sm:p-8">
            {!loaded ? (
              <div className="py-16 text-center text-sm text-white/40">Lädt …</div>
            ) : isPackageStep ? (
              <PackageStep summary={draft.summary} onChange={setSummary} />
            ) : isContactStep ? (
              <ContactStep draft={draft} errors={errors} onChange={setContact} />
            ) : current ? (
              <fieldset className="flex flex-col gap-6">
                <legend className="mb-2">
                  <h2 className="text-xl font-semibold text-white">{current.title}</h2>
                  <p className="mt-1 text-sm text-white/55">{current.description}</p>
                </legend>
                {current.fields
                  .filter((field) => isFieldVisible(field, draft.data))
                  .map((field) => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      value={draft.data[field.name]}
                      onChange={(v) => setField(field.name, v)}
                    />
                  ))}
              </fieldset>
            ) : null}

            {isContactStep && submitError && (
              <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                {submitError}
              </p>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Zurück
              </button>

              {isContactStep ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={isPending}
                  className="rounded-full bg-[#09ed2d] px-7 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Wird gesendet …" : "Anfrage absenden"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goTo(step + 1)}
                  className="rounded-full bg-[#09ed2d] px-7 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90"
                >
                  Weiter →
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-white/35">
            💾 Automatisch gespeichert{userId ? ", auch in deinem Konto" : ""}.
          </p>
        </div>

        {/* Rechte Spalte: Kosten-Anzeige + darunter die Live-Vorschau (nur Desktop) */}
        <aside className="flex flex-col gap-5">
          <CostCounter draft={draft} />

          <div className="hidden lg:block">
            <div className="mb-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#09ed2d]">
                Live-Vorschau
              </span>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                Nur ein Design-<strong className="text-white/75">Beispiel</strong>, es baut sich
                passend zu deiner Auswahl auf. <strong className="text-white/75">Alles ist frei
                anpassbar</strong>: Farben, Texte, Bilder, Aufbau und Stil legen wir gemeinsam fest.
              </p>
            </div>
            <LivePreview data={draft.data} />
          </div>
        </aside>
      </div>
    </div>
  );
}

// =========================================================================
// Schritt-Anzeige
// =========================================================================

function Stepper({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  const labels = ["Paket", ...BRIEF_STEPS.map((s) => s.title), "Kontakt"];
  return (
    <nav aria-label="Fortschritt" className="mt-8">
      <div className="flex items-center justify-between gap-1">
        {labels.map((label, i) => {
          const active = i === step;
          const completed = i < step;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onJump(i)}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                  active
                    ? "border-[#09ed2d] bg-[#09ed2d] text-black"
                    : completed
                      ? "border-[#09ed2d]/50 bg-[#09ed2d]/15 text-[#09ed2d]"
                      : "border-white/20 bg-white/5 text-white/50 group-hover:border-white/40"
                }`}
              >
                {completed ? "✓" : i + 1}
              </span>
              <span
                className={`hidden text-[11px] sm:block ${
                  active ? "text-white" : "text-white/40"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#09ed2d] transition-all duration-500"
          style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
        />
      </div>
    </nav>
  );
}

// =========================================================================
// Feld-Renderer
// =========================================================================

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: BriefField;
  value: BriefValue | undefined;
  onChange: (v: BriefValue) => void;
}) {
  const labelEl = (
    <span className="flex items-baseline gap-2 text-sm font-medium text-white">
      {field.label}
      {field.optional && <span className="text-xs font-normal text-white/35">(optional)</span>}
    </span>
  );

  if (field.type === "text") {
    return (
      <label className="flex flex-col gap-2">
        {labelEl}
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="flex flex-col gap-2">
        {labelEl}
        <textarea
          rows={3}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${inputClass} resize-none`}
        />
      </label>
    );
  }

  // select (einfach) & multi, als Chips
  const selected: string[] = Array.isArray(value) ? value : value ? [value] : [];
  const isMulti = field.type === "multi";
  const locked = field.lockedOptions ?? [];
  const isLocked = (opt: string) => locked.includes(opt);

  const toggle = (opt: string) => {
    if (isLocked(opt)) return; // inklusive, nicht abwählbar
    if (isMulti) {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt];
      onChange(next);
    } else {
      onChange(selected[0] === opt ? "" : opt);
    }
  };

  // Detailtexte der aktuell gewählten Optionen (klappen bei Auswahl auf).
  const detailedOptions = field.optionDetails
    ? selected.filter((opt) => field.optionDetails?.[opt])
    : [];

  return (
    <div className="flex flex-col gap-2">
      {labelEl}
      {field.hint && <span className="text-xs text-white/45">{field.hint}</span>}
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => {
          const locked = isLocked(opt);
          const active = locked || selected.includes(opt);
          const help = field.optionHelp?.[opt];
          // Einzelpreise werden bewusst nicht mehr ausgewiesen, der Gesamtwert
          // bleibt eine Spanne (siehe CostCounter). So bleibt die Auswahl clean.
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              aria-pressed={active}
              disabled={locked}
              title={locked ? "Inklusive, immer enthalten" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition ${
                active
                  ? "border-[#09ed2d] bg-[#09ed2d]/15 text-[#09ed2d]"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
              } ${locked ? "cursor-default opacity-90" : ""}`}
            >
              {active && isMulti && <span>✓</span>}
              <span>{opt}</span>
              {locked && (
                <span className="rounded-full bg-[#09ed2d]/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#09ed2d]">
                  inklusive
                </span>
              )}
              {help && <ChipHelp text={help} />}
            </button>
          );
        })}
      </div>

      {/* Detailtexte der gewählten Optionen, klappen bei Auswahl auf und
          erklären, was in die Seite/Funktion reinkommt bzw. wie sie aufgebaut wird. */}
      {detailedOptions.length > 0 && (
        <ul className="mt-1.5 flex flex-col gap-2">
          {detailedOptions.map((opt) => (
            <li
              key={opt}
              className="animate-detail-in rounded-xl border border-white/10 border-l-2 border-l-[#09ed2d]/50 bg-white/[0.03] px-3.5 py-2.5"
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold text-[#09ed2d]">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 flex-none">
                  <path
                    d="m5 13 4 4 10-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {opt}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                {field.optionDetails?.[opt]}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Kleines „?"-Symbol mit Hover-/Touch-Tooltip, das eine Option kurz erklärt.
 * Reine Spans (valides Markup im Chip-Button); `stopPropagation` verhindert,
 * dass das Antippen des „?" die Option umschaltet.
 */
function ChipHelp({
  text,
  placement = "top",
}: {
  text: string;
  placement?: "top" | "bottom";
}) {
  const pos =
    placement === "bottom"
      ? "top-[calc(100%+8px)] -translate-y-1 group-hover/tip:translate-y-0 group-active/tip:translate-y-0"
      : "bottom-[calc(100%+8px)] translate-y-1 group-hover/tip:translate-y-0 group-active/tip:translate-y-0";
  return (
    <span
      className="group/tip relative ml-0.5 inline-flex"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <span
        aria-hidden="true"
        className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-bold opacity-60"
      >
        ?
      </span>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-50 w-48 -translate-x-1/2 rounded-lg border border-[#09ed2d]/25 bg-black/95 px-3 py-2 text-center text-xs font-normal leading-relaxed text-white/85 opacity-0 shadow-[0_10px_30px_-12px_rgba(9,237,45,0.5)] transition-all duration-150 group-hover/tip:opacity-100 group-active/tip:opacity-100 ${pos}`}
      >
        {text}
      </span>
    </span>
  );
}

// =========================================================================
// Paket-Schritt, die aus dem Preisrechner übernommene Vorauswahl,
// hier sichtbar und jederzeit anpassbar.
// =========================================================================

function PackageStep({
  summary,
  onChange,
}: {
  summary: BriefDraft["summary"];
  onChange: (patch: Partial<BriefDraft["summary"]>) => void;
}) {
  const projectType = (summary.projectType ?? "onepager") as ProjectType;
  const design = (summary.design ?? "custom") as DesignType;
  const selectedFeatures = (summary.features ?? []) as FeatureKey[];
  const maintenance = summary.maintenance ?? false;
  const maintenanceRange = maintenanceRangeFor(projectType);

  const toggleFeature = (key: FeatureKey) =>
    onChange({
      features: selectedFeatures.includes(key)
        ? selectedFeatures.filter((f) => f !== key)
        : [...selectedFeatures, key],
    });

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-xl font-semibold text-white">Dein Paket</h2>
        <p className="mt-1 text-sm text-white/55">
          Das hast du im Preisrechner gewählt. Du kannst hier alles anpassen -
          die Kalkulation rechts aktualisiert sich sofort.
        </p>
      </div>

      {/* Projektart */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#09ed2d]">
          Projektart
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROJECT_TYPES.map((key) => {
            const pt = PRICING.projectTypes[key];
            const active = projectType === key;
            return (
              <PackageCard key={key} active={active} onSelect={() => onChange({ projectType: key })}>
                <span className="font-medium text-white">{pt.label}</span>
                <span className="text-xs text-white/50">
                  {pt.complex ? "Individuelle Planung" : `ab ${formatEuro(pt.base[0])}`}
                </span>
              </PackageCard>
            );
          })}
        </div>
      </div>

      {/* Design */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#09ed2d]">
          Design
        </span>
        <div className="grid grid-cols-2 gap-3">
          {(["custom", "template"] as const).map((key) => {
            const active = design === key;
            return (
              <PackageCard key={key} active={active} onSelect={() => onChange({ design: key })}>
                <span className="font-medium text-white">{PRICING.designLabel[key]}</span>
                <span className="text-xs text-white/50">
                  {key === "template" ? "günstiger (−20 %)" : "voller Funktionsumfang"}
                </span>
              </PackageCard>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#09ed2d]">
          Features
        </span>
        <div className="flex flex-wrap gap-2">
          {FEATURE_KEYS.map((key) => {
            const feature = PRICING.features[key];
            const active = selectedFeatures.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleFeature(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition ${
                  active
                    ? "border-[#09ed2d] bg-[#09ed2d]/15 text-[#09ed2d]"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                {active && <span>✓</span>}
                <span>{feature.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mehrsprachigkeit wird als Funktion im Schritt „Funktionen & Technik"
          gewählt, Deutsch ist immer inklusive. Daher hier kein Sprachen-Stepper. */}

      {/* Wartung & Pflege */}
      <button
        type="button"
        onClick={() => onChange({ maintenance: !maintenance })}
        aria-pressed={maintenance}
        className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${
          maintenance
            ? "border-[#09ed2d] bg-[#09ed2d]/10"
            : "border-white/10 bg-white/5 hover:border-white/25"
        }`}
      >
        <span className="flex flex-col gap-0.5">
          <span className="font-medium text-white">{PRICING.maintenance.label}</span>
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
      </button>
    </div>
  );
}

function PackageCard({
  active,
  onSelect,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#09ed2d] bg-[#09ed2d]/10"
          : "border-white/10 bg-white/5 hover:border-white/25"
      }`}
    >
      {children}
    </button>
  );
}

// =========================================================================
// Kontakt-Schritt (inkl. kompakter Zusammenfassung)
// =========================================================================

function ContactStep({
  draft,
  errors,
  onChange,
}: {
  draft: BriefDraft;
  errors: { name?: string; email?: string };
  onChange: (key: keyof BriefDraft["contact"], value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Fast geschafft!</h2>
        <p className="mt-1 text-sm text-white/55">
          Wohin dürfen wir dein persönliches Angebot schicken?
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white">Name</span>
          <input
            type="text"
            autoComplete="name"
            value={draft.contact.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Max Mustermann"
            className={inputClass}
          />
          {errors.name && <span className="text-xs text-red-300">{errors.name}</span>}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white">E-Mail</span>
          <input
            type="email"
            autoComplete="email"
            value={draft.contact.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="max@firma.de"
            className={inputClass}
          />
          {errors.email && <span className="text-xs text-red-300">{errors.email}</span>}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white">
            Telefon <span className="text-xs font-normal text-white/35">(optional)</span>
          </span>
          <input
            type="tel"
            autoComplete="tel"
            value={draft.contact.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+49 …"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white">
            Firma <span className="text-xs font-normal text-white/35">(optional)</span>
          </span>
          <input
            type="text"
            autoComplete="organization"
            value={draft.contact.company}
            onChange={(e) => onChange("company", e.target.value)}
            placeholder="Firma"
            className={inputClass}
          />
        </label>
      </div>

      <Summary draft={draft} />
    </div>
  );
}

function Summary({ draft }: { draft: BriefDraft }) {
  const s = draft.summary;
  const estimate = computeBriefEstimate(draft.data, draft.summary);
  const projectLabel =
    s.projectType && s.projectType in PRICING.projectTypes
      ? PRICING.projectTypes[s.projectType as keyof typeof PRICING.projectTypes].label
      : null;

  const answered = BRIEF_STEPS.flatMap((stepDef) =>
    stepDef.fields
      .filter((f) => isFieldVisible(f, draft.data))
      .map((f) => ({ label: f.label, value: draft.data[f.name] }))
      .filter((r) => {
        const v = r.value;
        return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim().length > 0;
      }),
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <h3 className="text-sm font-semibold text-white">Deine Angaben im Überblick</h3>

      {(projectLabel || s.priceMax) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {projectLabel && (
            <span className="rounded-full border border-[#09ed2d]/30 bg-[#09ed2d]/10 px-3 py-1 text-[#09ed2d]">
              {projectLabel}
            </span>
          )}
          {typeof s.priceMin === "number" && typeof s.priceMax === "number" && (
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70">
              Preisrechner: {formatEuro(s.priceMin)} bis {formatEuro(s.priceMax)}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 rounded-xl border border-[#09ed2d]/25 bg-[#09ed2d]/[0.06] px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-white/70">Geschätzte Gesamtkosten (mit Detailauswahl)</span>
          <span className="text-xl font-semibold tabular-nums text-[#09ed2d]">
            ca. {formatRange(estimate.oneTimeMin, estimate.oneTimeMax)}
            {estimate.oneTimeMax > estimate.oneTimeMin && <span className="text-[#09ed2d]/80">+</span>}
          </span>
        </div>
        {estimate.hosting > 0 && (
          <div className="mt-1 flex items-baseline justify-between gap-3 text-xs text-white/55">
            <span>Hosting</span>
            <span className="tabular-nums">+ {formatEuro(estimate.hosting)}/Monat</span>
          </div>
        )}
        {estimate.maintenanceMax > 0 && (
          <div className="mt-1 flex items-baseline justify-between gap-3 text-xs text-white/55">
            <span>Wartung &amp; Pflege</span>
            <span className="tabular-nums">
              + {formatRange(estimate.maintenanceMin, estimate.maintenanceMax)}/Monat
            </span>
          </div>
        )}
      </div>

      {answered.length > 0 ? (
        <dl className="mt-4 grid gap-2 sm:grid-cols-2">
          {answered.map((r) => (
            <div key={r.label} className="rounded-lg bg-white/[0.03] px-3 py-2">
              <dt className="text-[11px] uppercase tracking-wide text-white/35">{r.label}</dt>
              <dd className="mt-0.5 text-sm text-white/80">{displayValue(r.value)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-3 text-xs text-white/40">
          Du hast die Detailfragen übersprungen, das ist okay. Je mehr du ausfüllst,
          desto genauer wird dein Angebot.
        </p>
      )}
    </div>
  );
}

// =========================================================================
// Erfolg
// =========================================================================

function SuccessScreen({ draft }: { draft: BriefDraft }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#09ed2d]/15 text-[#09ed2d]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
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
      <h1 className="mt-6 text-3xl font-semibold">Anfrage erhalten!</h1>
      <p className="mt-3 text-white/60">
        Vielen Dank{draft.contact.name ? `, ${draft.contact.name.split(" ")[0]}` : ""}! Wir
        prüfen deine Konfiguration und melden uns innerhalb von 24 Stunden per E-Mail mit
        einem persönlichen Angebot.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Zur Startseite
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
        >
          Zum Dashboard
        </Link>
      </div>
    </div>
  );
}

// =========================================================================
// Helfer
// =========================================================================

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#09ed2d]/60 focus:ring-1 focus:ring-[#09ed2d]/40";

/** Spielerische „Level"-Stufe je nach geschätzter Investition. */
function projectLevel(oneTime: number): { label: string; emoji: string } {
  if (oneTime >= 7000) return { label: "Deluxe", emoji: "👑" };
  if (oneTime >= 4000) return { label: "Premium", emoji: "💎" };
  if (oneTime >= 2000) return { label: "Solide", emoji: "🚀" };
  return { label: "Starter", emoji: "🌱" };
}

/** Zählt gewählte vs. verfügbare bepreiste Optionen (für den „Ausstattung"-Balken). */
function countPricedOptions(data: BriefDraft["data"]): { chosen: number; total: number } {
  let total = 0;
  let chosen = 0;
  for (const step of BRIEF_STEPS) {
    for (const field of step.fields) {
      if (!field.prices || !isFieldVisible(field, data)) continue;
      const priced = Object.keys(field.prices);
      total += priced.length;
      const value = data[field.name];
      const selected = Array.isArray(value) ? value : value ? [value] : [];
      chosen += selected.filter((o) => priced.includes(o)).length;
    }
  }
  return { chosen, total };
}

/**
 * Live-Kosten-Zähler des Konfigurators. Bewusst ruhig & aufgeräumt: klare Summe
 * mit sanftem Pop bei Änderung, dezenter statischer Grün-Glow, „Ausstattung"-
 * Fortschritt, Level-Stufe und eine saubere Aufschlüsselung. Auf dem Desktop
 * sticky rechts, auf Mobil kompakt oben.
 */
function CostCounter({ draft }: { draft: BriefDraft }) {
  const estimate = computeBriefEstimate(draft.data, draft.summary);
  const pt = draft.summary.projectType;
  const ptLabel =
    pt && pt in PRICING.projectTypes
      ? PRICING.projectTypes[pt as keyof typeof PRICING.projectTypes].label
      : "—";

  const midpoint = Math.round((estimate.oneTimeMin + estimate.oneTimeMax) / 2);
  const level = projectLevel(midpoint);
  const { chosen, total } = countPricedOptions(draft.data);
  const fill = total > 0 ? Math.round((chosen / total) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#09ed2d]/25 bg-gradient-to-br from-[#0a2e15]/70 via-black to-black p-5 shadow-[0_0_40px_-14px_rgba(9,237,45,0.3)] sm:p-6">
      {/* Kopf: Titel + Level */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#09ed2d]">
          Deine Kalkulation
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#09ed2d]/30 bg-[#09ed2d]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#09ed2d]">
          <span aria-hidden="true">{level.emoji}</span>
          {level.label}
        </span>
      </div>

      {/* Summe, immer als unverbindliche Spanne */}
      <div className="mt-4">
        <span className="flex items-center gap-1 text-xs text-white/45">
          geschätzt, einmalig
          <ChipHelp
            placement="bottom"
            text="Grober Richtwert, keine Endsumme. Bei viel Aufwand (viele Seiten, Sonderfunktionen, aufwändiges Design) kann es auch mehr werden, daher das Plus. Den genauen Preis legen wir gemeinsam fest."
          />
        </span>
        <div key={`${estimate.oneTimeMin}-${estimate.oneTimeMax}`} className="animate-cost-pop mt-0.5 origin-left">
          <span className="text-[2rem] font-bold leading-none tabular-nums text-[#09ed2d] drop-shadow-[0_0_18px_rgba(9,237,45,0.35)] sm:text-[2.4rem]">
            ca. <AnimatedEuro value={estimate.oneTimeMin} />
            {estimate.oneTimeMax !== estimate.oneTimeMin && (
              <> bis <AnimatedEuro value={estimate.oneTimeMax} /></>
            )}
            <span className="text-white/80">+</span>
          </span>
        </div>
        {estimate.monthlyMax > 0 && (
          <p className="mt-2 text-sm text-white/60">
            +{" "}
            <span className="font-semibold text-white/85">
              {formatRange(estimate.monthlyMin, estimate.monthlyMax)}
            </span>
            /Monat <span className="text-white/40">· laufend</span>
          </p>
        )}
      </div>

      {/* Ausstattungs-Fortschritt */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] text-white/55">
          <span className="font-medium uppercase tracking-wide">Ausstattung</span>
          <span className="tabular-nums text-[#09ed2d]">
            {chosen}/{total}
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#09ed2d] transition-all duration-500 ease-out"
            style={{ width: `${fill}%` }}
          />
        </div>
      </div>

      {/* Aufschlüsselung */}
      <dl className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-white/50">Basis ({ptLabel})</dt>
          <dd className="tabular-nums text-white/80">
            {formatRange(estimate.baseMin, estimate.baseMax)}
          </dd>
        </div>
        {estimate.addOnsMax > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-white/50">Zusatz-Optionen</dt>
            <dd className="tabular-nums text-white/80">
              + {formatRange(estimate.addOnsMin, estimate.addOnsMax)}
            </dd>
          </div>
        )}
        {estimate.hosting > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-white/50">Hosting</dt>
            <dd className="tabular-nums text-white/80">{formatEuro(estimate.hosting)}/Mt.</dd>
          </div>
        )}
        {estimate.maintenanceMax > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-white/50">Wartung &amp; Pflege</dt>
            <dd className="tabular-nums text-white/80">
              {formatRange(estimate.maintenanceMin, estimate.maintenanceMax)}/Mt.
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-4 text-[11px] leading-relaxed text-white/40">
        Unverbindlicher Richtwert. Dein finales Angebot erstellen wir individuell.
      </p>
    </div>
  );
}

/** Zählt einen Wert sanft hoch/runter (easeOutCubic). */
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

/**
 * Sorgt dafür, dass immer-inklusive Optionen (z. B. „Startseite") in den
 * Antwortdaten enthalten sind, auch wenn der Nutzer das Feld noch nicht
 * angefasst hat. So sind sie sofort sichtbar ausgewählt und werden gespeichert.
 */
function withLockedOptions(data: BriefDraft["data"]): BriefDraft["data"] {
  const next = { ...data };
  for (const step of BRIEF_STEPS) {
    for (const field of step.fields) {
      if (!field.lockedOptions?.length) continue;
      const current = Array.isArray(next[field.name])
        ? (next[field.name] as string[])
        : [];
      const merged = [...current];
      for (const opt of field.lockedOptions) {
        if (!merged.includes(opt)) merged.unshift(opt);
      }
      next[field.name] = merged;
    }
  }
  return next;
}

function readLocal(): BriefDraft | null {
  try {
    const raw = localStorage.getItem(BRIEF_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BriefDraft>;
    return {
      data: parsed.data ?? {},
      contact: { name: "", email: "", phone: "", company: "", ...parsed.contact },
      summary: parsed.summary ?? {},
    };
  } catch {
    return null;
  }
}

/**
 * Verschmilzt Konto-Entwurf (remote) und lokalen Entwurf.
 *
 * Standard: Konto-Entwurf hat Vorrang (geräteübergreifend), lokaler füllt Lücken.
 * Bei `localWins` (frische Preisrechner-Übergabe) kehrt sich die Priorität um:
 * die gerade getroffene lokale Auswahl gewinnt, der Konto-Entwurf füllt nur Lücken.
 * Kontaktfelder nehmen jeweils den ersten nicht-leeren Wert.
 */
function mergeDrafts(remote: BriefDraft, local: BriefDraft, localWins = false): BriefDraft {
  const primary = localWins ? local : remote;
  const secondary = localWins ? remote : local;
  return {
    data: { ...secondary.data, ...primary.data },
    summary: { ...secondary.summary, ...primary.summary },
    contact: {
      name: primary.contact?.name || secondary.contact?.name || "",
      email: primary.contact?.email || secondary.contact?.email || "",
      phone: primary.contact?.phone || secondary.contact?.phone || "",
      company: primary.contact?.company || secondary.contact?.company || "",
    },
  };
}

/** Liest den Handoff-Marker und entfernt ihn sofort (einmalige Wirkung). */
function consumeHandoff(): boolean {
  try {
    const flag = localStorage.getItem(BRIEF_HANDOFF_KEY) === "1";
    if (flag) localStorage.removeItem(BRIEF_HANDOFF_KEY);
    return flag;
  } catch {
    return false;
  }
}
