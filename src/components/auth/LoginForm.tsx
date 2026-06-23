"use client";

import { useActionState } from "react";
import { signInAction, type AuthState } from "@/lib/actions/auth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthError, SubmitButton } from "@/components/auth/AuthParts";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signInAction,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthError message={state?.error} />

      <AuthField
        name="email"
        label="E-Mail-Adresse"
        type="email"
        autoComplete="email"
        error={state?.fieldErrors?.email?.[0]}
      />
      <AuthField
        name="password"
        label="Passwort"
        reveal
        autoComplete="current-password"
        error={state?.fieldErrors?.password?.[0]}
      />

      <SubmitButton pending={pending} pendingLabel="Anmelden …">
        Anmelden
      </SubmitButton>
    </form>
  );
}
