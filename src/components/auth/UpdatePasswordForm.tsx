"use client";

import { useActionState } from "react";
import { updatePasswordAction, type AuthState } from "@/lib/actions/auth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthError, SubmitButton } from "@/components/auth/AuthParts";

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePasswordAction,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthError message={state?.error} />

      <AuthField
        name="password"
        label="Neues Passwort (mind. 8 Zeichen)"
        reveal
        autoComplete="new-password"
        error={state?.fieldErrors?.password?.[0]}
      />
      <AuthField
        name="confirm"
        label="Passwort wiederholen"
        reveal
        autoComplete="new-password"
        error={state?.fieldErrors?.confirm?.[0]}
      />

      <SubmitButton pending={pending} pendingLabel="Passwort wird gespeichert …">
        Passwort speichern
      </SubmitButton>
    </form>
  );
}
