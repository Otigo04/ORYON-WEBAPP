import Link from "next/link";
import type { ReactNode } from "react";

/** Einheitlicher Seitenkopf im Admin-Bereich. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#09ed2d] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
        >
          + {action.label}
        </Link>
      )}
    </div>
  );
}

/** Karten-Container im Glas-Look. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

/** Leerzustand für Listen. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-sm text-white/50">
      {children}
    </div>
  );
}
