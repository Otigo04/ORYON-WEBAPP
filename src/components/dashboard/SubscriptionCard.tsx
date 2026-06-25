import Link from "next/link";
import {
  type Subscription,
  SUBSCRIPTION_STATUS_LABELS,
  BILLING_INTERVAL_LABELS,
  isSubscriptionUsable,
} from "@/lib/subscription";
import { getFleetTier } from "@/lib/tas-fleet";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/**
 * Zeigt den TAS-FLEET-Abo-Status des Kunden. Bei aktivem Abo: Tarif, Status,
 * Laufzeit und Flotten-Limit. Ohne Abo: Hinweis + CTA zu den Tarifen.
 * Reine Server Component.
 */
export function SubscriptionCard({ subscription }: { subscription: Subscription | null }) {
  if (!subscription) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white">Kein aktives Abo</h2>
        <p className="mt-2 text-sm text-white/60">
          Du hast aktuell kein TAS-FLEET-Abonnement. Wähle einen Tarif, um deine
          Flotte digital zu verwalten.
        </p>
        <Link
          href="/leistungen/tas-fleet#preise"
          className="mt-5 inline-flex rounded-full bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] px-6 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Tarife ansehen
        </Link>
      </div>
    );
  }

  const tier = getFleetTier(subscription.plan);
  const usable = isSubscriptionUsable(subscription);
  const limit =
    subscription.vehicle_limit === null
      ? "Unbegrenzt"
      : `${subscription.vehicle_limit} Fahrzeuge`;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#09ed2d]/25 bg-gradient-to-br from-[#09ed2d]/[0.08] via-white/[0.03] to-[#22d3ee]/[0.06] p-6 backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#22d3ee]">
            TAS-FLEET Abonnement
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {tier?.name ?? subscription.plan}
          </h2>
        </div>
        <StatusBadge usable={usable} label={SUBSCRIPTION_STATUS_LABELS[subscription.status]} />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
        <Detail label="Abrechnung" value={BILLING_INTERVAL_LABELS[subscription.billing_interval]} />
        <Detail label="Flotten-Limit" value={limit} />
        <Detail
          label={subscription.cancel_at_period_end ? "Läuft aus am" : "Verlängert am"}
          value={
            subscription.current_period_end
              ? dateFormatter.format(new Date(subscription.current_period_end))
              : "—"
          }
        />
        <Detail
          label="Seit"
          value={dateFormatter.format(new Date(subscription.created_at))}
        />
      </dl>

      {subscription.status === "past_due" && (
        <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Deine letzte Zahlung ist offen. Bitte aktualisiere deine Zahlungsdaten, damit dein Zugang
          erhalten bleibt.
        </p>
      )}
      {subscription.cancel_at_period_end && subscription.status === "active" && (
        <p className="mt-5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/60">
          Dein Abo endet zum Periodenende. Bis dahin bleibt dein Zugang vollständig erhalten.
        </p>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-white/40">{label}</dt>
      <dd className="mt-0.5 font-medium text-white">{value}</dd>
    </div>
  );
}

function StatusBadge({ usable, label }: { usable: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        usable
          ? "border-[#09ed2d]/40 bg-[#09ed2d]/10 text-[#09ed2d]"
          : "border-white/20 bg-white/5 text-white/60"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${usable ? "bg-[#09ed2d]" : "bg-white/40"}`}
      />
      {label}
    </span>
  );
}
