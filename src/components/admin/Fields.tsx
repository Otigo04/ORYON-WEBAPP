"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

const inputBase =
  "w-full rounded-xl border border-white/12 bg-black/40 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#09ed2d]/60 focus:ring-2 focus:ring-[#09ed2d]/15";

function Label({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-white/50">
      {children}
    </label>
  );
}

export function Field({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder,
  required,
  error,
  step,
  min,
  max,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  error?: string;
  step?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        step={step}
        min={min}
        max={max}
        aria-invalid={!!error}
        className={inputBase}
      />
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

export function TextArea({
  name,
  label,
  defaultValue,
  placeholder,
  rows = 4,
  error,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={`${inputBase} resize-y`}
      />
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

export function Select({
  name,
  label,
  defaultValue,
  options,
  error,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className={`${inputBase} appearance-none`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-neutral-900">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-200">
      {message}
    </div>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-200">
      {message}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel,
}: {
  children: ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-[#09ed2d] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel ?? "Speichern …" : children}
    </button>
  );
}
