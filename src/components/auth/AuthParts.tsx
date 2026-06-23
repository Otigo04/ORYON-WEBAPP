"use client";

import type { ReactNode } from "react";

/** Rote Status-Box für allgemeine Auth-Fehler. */
export function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
    >
      {message}
    </p>
  );
}

/** Grüne Status-Box für Erfolgsmeldungen (z. B. „E-Mail bestätigen"). */
export function AuthSuccess({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#09ed2d]/15 text-[#09ed2d]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="m5 13 4 4 10-10"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p className="text-sm leading-relaxed text-white/70">{message}</p>
    </div>
  );
}

/** Primärer Submit-Button mit Lade-Spinner. */
export function SubmitButton({
  pending,
  pendingLabel,
  children,
}: {
  pending: boolean;
  pendingLabel: string;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}
