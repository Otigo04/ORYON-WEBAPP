"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createFleetOrder, type FleetOrderState } from "@/lib/actions/fleet-order";
import type { Profile } from "@/lib/profile";
import type { FleetInterval, FleetPlanId } from "@/lib/tas-fleet";

/**
 * Bestellformular für einen TAS-FLEET-Tarif. Der Kunde gibt seine
 * Rechnungs-/Firmendaten ein; die Server Action legt Rechnung + (inaktives) Abo
 * an und leitet zur Rechnung weiter. Tarif & Intervall kommen als Hidden-Felder
 * aus der Tarifauswahl.
 */
export function FleetOrderForm({
  plan,
  interval,
  profile,
}: {
  plan: FleetPlanId;
  interval: FleetInterval;
  profile: Profile | null;
}) {
  const [state, action] = useActionState<FleetOrderState, FormData>(createFleetOrder, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="interval" value={interval} />

      {state?.error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <Field
        name="company"
        label="Firmenname"
        defaultValue={profile?.company ?? ""}
        placeholder="Muster Taxi GmbH"
        required
        error={state?.fieldErrors?.company?.[0]}
      />
      <Field
        name="contact_name"
        label="Ansprechpartner"
        defaultValue={profile?.full_name ?? ""}
        placeholder="Max Mustermann"
        required
        error={state?.fieldErrors?.contact_name?.[0]}
      />
      <Field
        name="street"
        label="Straße & Hausnummer"
        defaultValue={profile?.street ?? ""}
        placeholder="Musterstraße 12"
        required
        error={state?.fieldErrors?.street?.[0]}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_2fr]">
        <Field
          name="postal_code"
          label="PLZ"
          defaultValue={profile?.postal_code ?? ""}
          placeholder="13507"
          required
          error={state?.fieldErrors?.postal_code?.[0]}
        />
        <Field
          name="city"
          label="Ort"
          defaultValue={profile?.city ?? ""}
          placeholder="Berlin"
          required
          error={state?.fieldErrors?.city?.[0]}
        />
      </div>
      <Field
        name="country"
        label="Land"
        defaultValue={profile?.country ?? "Deutschland"}
        placeholder="Deutschland"
        error={state?.fieldErrors?.country?.[0]}
      />
      <Field
        name="vat_id"
        label="USt-IdNr. (optional)"
        defaultValue={profile?.vat_id ?? ""}
        placeholder="DE123456789"
        error={state?.fieldErrors?.vat_id?.[0]}
      />
      <Field
        name="phone"
        label="Telefon (optional)"
        type="tel"
        defaultValue={profile?.phone ?? ""}
        placeholder="+49 30 1234567"
        error={state?.fieldErrors?.phone?.[0]}
      />

      <p className="text-xs text-white/45">
        Mit dem Absenden erstellen wir Ihre Rechnung zur Überweisung. Nach Zahlungseingang
        richten wir Ihren Zugang innerhalb von 12 Stunden ein und senden Ihnen die Zugangsdaten
        per E-Mail.
      </p>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  required,
  error,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/70">
        {label} {required && <span className="text-[#09ed2d]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition focus:border-[#09ed2d]/50 focus:outline-none focus:ring-1 focus:ring-[#09ed2d]/40"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-[#09ed2d] px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Rechnung wird erstellt …" : "Zahlungspflichtig bestellen"}
    </button>
  );
}
