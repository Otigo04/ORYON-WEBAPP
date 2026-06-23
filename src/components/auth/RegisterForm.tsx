"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthState } from "@/lib/actions/auth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthError, AuthSuccess, SubmitButton } from "@/components/auth/AuthParts";

export function RegisterForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUpAction,
    null,
  );

  if (state?.success) {
    return <AuthSuccess message={state.success} />;
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthError message={state?.error} />

      <AuthField
        name="name"
        label="Name"
        autoComplete="name"
        error={state?.fieldErrors?.name?.[0]}
      />
      <AuthField
        name="email"
        label="E-Mail-Adresse"
        type="email"
        autoComplete="email"
        error={state?.fieldErrors?.email?.[0]}
      />
      <AuthField
        name="password"
        label="Passwort (mind. 8 Zeichen)"
        reveal
        autoComplete="new-password"
        error={state?.fieldErrors?.password?.[0]}
      />

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-white/55">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#09ed2d]"
        />
        <span>
          Ich habe die{" "}
          <Link href="/datenschutz" className="text-[#09ed2d] hover:underline">
            Datenschutzerklärung
          </Link>{" "}
          gelesen und stimme der Verarbeitung meiner Daten zu.
        </span>
      </label>

      <SubmitButton pending={pending} pendingLabel="Konto wird erstellt …">
        Konto erstellen
      </SubmitButton>
    </form>
  );
}
