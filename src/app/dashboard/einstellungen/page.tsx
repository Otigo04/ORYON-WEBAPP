import type { Metadata } from "next";
import Link from "next/link";
import SideRaysBackground from "@/components/backgrounds/SideRaysBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { getMyProfile } from "@/lib/profile";
import { getMySubscription } from "@/lib/subscription";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Einstellungen, TAS Webworks",
  description: "Verwalte dein Profil und dein TAS-FLEET-Abonnement.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const [profile, subscription, admin] = await Promise.all([
    getMyProfile(),
    getMySubscription(),
    isAdmin(),
  ]);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <SideRaysBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/45 to-black/85" />

      <DashboardHeader isAdmin={admin} />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-16 pt-10">
        <header className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
              <path
                d="m10 4-4 4 4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Zurück zum Dashboard
          </Link>
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Einstellungen
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Dein Konto</h1>
          <p className="max-w-xl text-base text-white/70">
            Verwalte deine Stammdaten und behalte dein TAS-FLEET-Abonnement im Blick.
          </p>
        </header>

        {/* Abo-Status */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Abonnement</h2>
          <SubscriptionCard subscription={subscription} />
        </section>

        {/* Profil */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Profil</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ProfileForm profile={profile} />
          </div>
        </section>
      </div>
    </main>
  );
}
