"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile, type UpdateProfileState } from "@/lib/actions/profile";
import type { Profile } from "@/lib/profile";

/**
 * Formular zum Bearbeiten der eigenen Stammdaten. Client-Insel mit
 * `useActionState`; die E-Mail wird nur angezeigt (Änderung läuft über den
 * Auth-Flow). Zeigt eine kurze Erfolgsmeldung nach dem Speichern.
 */
export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action] = useActionState<UpdateProfileState, FormData>(updateProfile, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="rounded-xl border border-[#09ed2d]/30 bg-[#09ed2d]/10 px-4 py-3 text-sm text-[#09ed2d]">
          {state.demo
            ? "Demo-Modus: Es ist keine Datenbank verbunden, daher wurde nichts gespeichert."
            : "Profil gespeichert."}
        </p>
      )}

      <TextField
        name="full_name"
        label="Vollständiger Name"
        defaultValue={profile?.full_name ?? ""}
        placeholder="Max Mustermann"
        required
        error={state?.fieldErrors?.full_name?.[0]}
      />
      <TextField
        name="company"
        label="Unternehmen"
        defaultValue={profile?.company ?? ""}
        placeholder="Muster Taxi GmbH"
        error={state?.fieldErrors?.company?.[0]}
      />
      <TextField
        name="phone"
        label="Telefon"
        type="tel"
        defaultValue={profile?.phone ?? ""}
        placeholder="+49 30 1234567"
        error={state?.fieldErrors?.phone?.[0]}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/70">E-Mail</label>
        <input
          type="email"
          value={profile?.email ?? ""}
          disabled
          className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white/50"
        />
        <p className="mt-1 text-xs text-white/40">
          Die E-Mail-Adresse ist mit deinem Login verknüpft und kann hier nicht geändert werden.
        </p>
      </div>

      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}

function TextField({
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

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-[#09ed2d] px-6 py-2.5 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Speichern …" : "Änderungen speichern"}
    </button>
  );
}
