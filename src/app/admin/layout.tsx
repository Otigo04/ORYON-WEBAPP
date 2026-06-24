import type { Metadata } from "next";
import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { signOutAction } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin – TAS Webworks",
  description: "Internes Verwaltungs-Dashboard.",
  robots: { index: false, follow: false },
};

/**
 * Admin-Bereich (Superadmin). Serverseitige Zweitprüfung via requireAdmin()
 * zusätzlich zur Middleware. Dunkles, professionelles Layout mit fixer
 * Seitenleiste.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-6">
        {/* Seitenleiste */}
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:shrink-0">
          <div className="flex h-full flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between px-2 pt-1">
              <Link href="/admin" aria-label="Admin-Übersicht">
                <LogoWordmark className="h-6 w-auto" />
              </Link>
              <span className="rounded-full border border-[#09ed2d]/30 bg-[#09ed2d]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#09ed2d]">
                Admin
              </span>
            </div>

            <AdminSidebar />

            <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4">
              <Link
                href="/"
                className="rounded-xl px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                ← Zur Website
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                Kundenansicht
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Inhalt */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
