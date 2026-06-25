"use client";

import { useActionState } from "react";
import {
  setSubscription,
  removeSubscription,
  type ActionState,
} from "@/lib/actions/admin/subscriptions";
import { Select, Field, SubmitButton, FormError, FormSuccess } from "@/components/admin/Fields";
import { FLEET_TIERS } from "@/lib/tas-fleet";
import { SUBSCRIPTION_STATUS_LABELS, BILLING_INTERVAL_LABELS } from "@/lib/subscription";
import type { CustomerSubscription } from "@/lib/admin/subscriptions";

const PLAN_OPTIONS = FLEET_TIERS.map((t) => ({ value: t.id, label: t.name }));
const STATUS_OPTIONS = Object.entries(SUBSCRIPTION_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
const INTERVAL_OPTIONS = Object.entries(BILLING_INTERVAL_LABELS).map(([value, label]) => ({
  value,
  label,
}));

/** Datum (ISO) → YYYY-MM-DD für das <input type="date">. */
function toDateInput(value: string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function SubscriptionForm({
  userId,
  subscription,
}: {
  userId: string;
  subscription: CustomerSubscription | null;
}) {
  const [state, action] = useActionState<ActionState, FormData>(setSubscription, null);
  const [removeState, removeAction] = useActionState<ActionState, FormData>(
    removeSubscription,
    null,
  );

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
      {state?.error && <FormError message={state.error} />}
      {state?.ok && <FormSuccess message="Abo gespeichert." />}
      {removeState?.error && <FormError message={removeState.error} />}

      {/* Tarif setzen / aktualisieren */}
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="user_id" value={userId} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            name="plan"
            label="Tarif"
            defaultValue={subscription?.plan ?? "professional"}
            options={PLAN_OPTIONS}
          />
          <Select
            name="status"
            label="Status"
            defaultValue={subscription?.status ?? "active"}
            options={STATUS_OPTIONS}
          />
          <Select
            name="billing_interval"
            label="Abrechnung"
            defaultValue={subscription?.billing_interval ?? "monthly"}
            options={INTERVAL_OPTIONS}
          />
          <Field
            name="current_period_end"
            label="Läuft bis (optional)"
            type="date"
            defaultValue={toDateInput(subscription?.current_period_end ?? null)}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton pendingLabel="Speichern …">
            {subscription ? "Abo aktualisieren" : "Abo freischalten"}
          </SubmitButton>
        </div>
      </form>

      {/* Abo entfernen – eigenständiges Formular (keine verschachtelten Forms) */}
      {subscription && (
        <form action={removeAction} className="flex justify-end">
          <input type="hidden" name="user_id" value={userId} />
          <button
            type="submit"
            className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-400/20"
          >
            Abo entfernen
          </button>
        </form>
      )}
    </div>
  );
}
