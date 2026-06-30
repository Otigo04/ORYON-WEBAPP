import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SideRaysBackground from "@/components/backgrounds/SideRaysBackground";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FleetOrderForm } from "@/components/tas-fleet/FleetOrderForm";
import { isAdmin } from "@/lib/auth";
import { formatMoney } from "@/lib/documents";
import { getMyProfile } from "@/lib/profile";
import {
  fleetInvoiceAmount,
  getFleetTier,
  type FleetInterval,
  type FleetPlanId,
} from "@/lib/tas-fleet";

export const metadata: Metadata = {
  title: "TAS-FLEET bestellen, TAS Webworks",
  description: "Schließen Sie Ihren TAS-FLEET-Tarif ab und erhalten Sie Ihre Rechnung.",
  robots: { index: false, follow: false },
};

const PLANS: FleetPlanId[] = ["starter", "professional", "enterprise"];

export default async function FleetOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}) {
  const sp = await searchParams;
  const plan = (sp.plan ?? "") as FleetPlanId;
  if (!PLANS.includes(plan)) notFound();
  const interval: FleetInterval = sp.interval === "monthly" ? "monthly" : "yearly";

  const tier = getFleetTier(plan);
  if (!tier) notFound();

  const [profile, admin] = await Promise.all([getMyProfile(), isAdmin()]);
  const amount = fleetInvoiceAmount(plan, interval);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <SideRaysBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/45 to-black/85" />

      <DashboardHeader isAdmin={admin} />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 pb-16 pt-10">
        <header className="flex flex-col gap-2">
          <Link
            href="/leistungen/tas-fleet#preise"
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
            Zurück zu den Tarifen
          </Link>
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Bestellung
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            TAS-FLEET {tier.name}
          </h1>
          <p className="max-w-xl text-base text-white/70">
            Geben Sie Ihre Firmendaten ein. Im Anschluss erhalten Sie sofort Ihre Rechnung zur
            Überweisung.
          </p>
        </header>

        {/* Zusammenfassung */}
        <div className="rounded-2xl border border-[#09ed2d]/25 bg-[#09ed2d]/[0.06] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">TAS-FLEET {tier.name}</p>
              <p className="text-sm text-white/60">
                {interval === "yearly"
                  ? "Jahreslizenz · 12 Monate im Voraus"
                  : "Monatslizenz · monatlich kündbar"}{" "}
                · {tier.vehicles}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#09ed2d]">{formatMoney(amount)}</p>
              <p className="text-xs text-white/45">
                {interval === "yearly" ? "pro Jahr" : "pro Monat"}
              </p>
            </div>
          </div>
          <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/45">
            Kleinunternehmer gemäß § 19 UStG – es wird keine Umsatzsteuer ausgewiesen.
          </p>
        </div>

        {/* Formular */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <FleetOrderForm plan={plan} interval={interval} profile={profile} />
        </div>
      </div>
    </main>
  );
}
