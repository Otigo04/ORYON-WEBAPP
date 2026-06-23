"use client";

import { useState } from "react";

/**
 * Eingabefeld mit animiertem Floating-Label und sanften Fokus-Effekten.
 * Für Passwörter optional mit Anzeigen/Verbergen-Umschalter.
 */
export function AuthField({
  name,
  label,
  type = "text",
  autoComplete,
  error,
  defaultValue,
  reveal = false,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  defaultValue?: string;
  /** Bei true: Passwort-Sichtbarkeit umschaltbar. */
  reveal?: boolean;
}) {
  const [show, setShow] = useState(false);
  const inputType = reveal ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="group relative">
        <input
          id={name}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          placeholder=" "
          aria-invalid={!!error}
          className={`peer w-full rounded-xl border bg-black/40 px-4 pb-2 pt-5 text-sm text-white outline-none transition-all duration-200 ${
            reveal ? "pr-12" : ""
          } ${
            error
              ? "border-red-400/50 focus:border-red-400/70 focus:ring-2 focus:ring-red-400/15"
              : "border-white/12 focus:border-[#09ed2d]/60 focus:ring-2 focus:ring-[#09ed2d]/15"
          }`}
        />
        <label
          htmlFor={name}
          className="pointer-events-none absolute left-4 top-3.5 text-sm text-white/40 transition-all duration-200 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#09ed2d] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>

        {reveal && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Passwort verbergen" : "Passwort anzeigen"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/40 transition hover:text-white/80"
          >
            {show ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.6 9.6 0 0112 5c5 0 9 4.5 10 7-.4 1-1.3 2.4-2.7 3.6M6.6 6.6C4.6 7.9 3.3 9.7 2 12c1 2.5 5 7 10 7 1 0 2-.2 2.9-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M2 12c1.5-3.5 5.5-7 10-7s8.5 3.5 10 7c-1.5 3.5-5.5 7-10 7s-8.5-3.5-10-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="px-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}
