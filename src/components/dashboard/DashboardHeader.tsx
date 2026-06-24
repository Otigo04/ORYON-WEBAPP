import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";
import { signOutAction } from "@/lib/actions/auth";

/**
 * Schlanke Kopfzeile des Kundenportals.
 *
 * Greift den Glas-Look der öffentlichen Navbar auf (Konsistenz zur Hauptseite)
 * und stellt den Weg zurück zur Website bereit: Logo und „Zur Website" führen
 * zur Startseite, „Abmelden" beendet die Session per Server-Action.
 *
 * `isAdmin` blendet für Superadmins einen Direktlink ins Admin-Panel ein.
 */
export function DashboardHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <header className="relative z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav
        aria-label="Portal-Navigation"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_4px_30px_-12px_rgba(9,237,45,0.25)] backdrop-blur-xl sm:px-6"
      >
        <Link
          href="/"
          aria-label="TAS Webworks – Startseite"
          className="flex items-center"
        >
          <LogoWordmark className="h-9 w-auto sm:h-10" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#09ed2d]/30 bg-[#09ed2d]/10 px-3 py-2 text-sm font-semibold text-[#09ed2d] transition hover:bg-[#09ed2d]/20"
            >
              <ShieldIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin-Bereich</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
              <path
                d="M9.5 3.5 5 8l4.5 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Zur Website</span>
          </Link>

          <span aria-hidden="true" className="h-5 w-px bg-white/15" />

          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Abmelden
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 3 4.5 6v5.5c0 4.3 3.2 7.6 7.5 9 4.3-1.4 7.5-4.7 7.5-9V6L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
