import type { ReactNode } from "react";
import Link from "next/link";
import BeamsBackground from "@/components/BeamsBackground";
import { LogoWordmark } from "@/components/Logo";

/**
 * Gemeinsamer, hochwertiger Rahmen für Login & Registrierung.
 *
 * Server Component: WebGL-Hintergrund (Client-Insel) + animierte Glas-Karte.
 * Die eigentlichen Formulare werden als `children` (Client) eingehängt.
 */
export function AuthShell({
  badge,
  title,
  subtitle,
  children,
  footer,
}: {
  badge: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-16">
      <BeamsBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/65 to-black/90"
      />

      <div className="animate-auth-rise relative z-10 w-full max-w-md">
        <div className="flex justify-center">
          <Link href="/" aria-label="TAS Webworks – Startseite" className="inline-flex">
            <LogoWordmark className="h-8 w-auto" />
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_90px_-30px_rgba(9,237,45,0.4)] backdrop-blur-xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#09ed2d]/25 bg-[#09ed2d]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#09ed2d]">
              {badge}
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{subtitle}</p>
          </div>

          <div className="mt-8">{children}</div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-white/50">{footer}</p>
        )}
      </div>
    </main>
  );
}
