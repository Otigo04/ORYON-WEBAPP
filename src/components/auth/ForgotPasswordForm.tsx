"use client";

import { useActionState } from "react";
import {
  requestPasswordResetAction,
  type AuthState,
} from "@/lib/actions/auth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthError, AuthSuccess, SubmitButton } from "@/components/auth/AuthParts";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    requestPasswordResetAction,
    null,
  );

  if (state?.success) {
    return <AuthSuccess message={state.success} />;
  }

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

      <SubmitButton pending={pending} pendingLabel="Link wird gesendet …">
        Link zum Zurücksetzen senden
      </SubmitButton>
    </form>
  );
}
