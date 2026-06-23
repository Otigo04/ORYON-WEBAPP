"use client";

import { useActionState } from "react";
import Link from "next/link";
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

      <div className="-mt-1 flex justify-end">
        <Link
          href="/passwort-vergessen"
          className="text-xs text-white/50 transition hover:text-[#09ed2d]"
        >
          Passwort vergessen?
        </Link>
      </div>

      <SubmitButton pending={pending} pendingLabel="Anmelden …">
        Anmelden
      </SubmitButton>
    </form>
  );
}
