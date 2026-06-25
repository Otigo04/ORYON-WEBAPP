import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { SubscriptionForm } from "@/components/admin/SubscriptionForm";
import { getAllCustomers } from "@/lib/admin/subscriptions";
import { SUBSCRIPTION_STATUS_LABELS } from "@/lib/subscription";

export default async function AdminSubscriptionsPage() {
  const customers = await getAllCustomers();

  return (
    <>
      <PageHeader
        title="Abonnements"
        subtitle="TAS-FLEET-Abos der Kunden einsehen und manuell freischalten. Solange der Stripe-Checkout noch nicht live ist, kannst du Abos hier setzen."
      />

      {customers.length === 0 ? (
        <EmptyState>
          Noch keine Kunden vorhanden. Sobald sich jemand registriert, erscheint er hier.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">
                    {customer.full_name || customer.email || "Unbenannter Kunde"}
                  </h3>
                  <p className="mt-0.5 text-sm text-white/50">
                    {customer.email}
                    {customer.company ? ` · ${customer.company}` : ""}
                  </p>
                </div>
                {customer.subscription ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#09ed2d]/40 bg-[#09ed2d]/10 px-3 py-1 text-xs font-semibold text-[#09ed2d]">
                    {customer.subscription.plan} ·{" "}
                    {SUBSCRIPTION_STATUS_LABELS[customer.subscription.status]}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white/50">
                    Kein Abo
                  </span>
                )}
              </div>

              <SubscriptionForm userId={customer.id} subscription={customer.subscription} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
