"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOffer, updateOffer, type ActionState } from "@/lib/actions/admin/offers";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { LineItemsEditor } from "@/components/admin/LineItemsEditor";
import { customerLabel, type Customer } from "@/lib/customer";
import { OFFER_STATUS_LABELS, suggestDocumentNumber, type LineItem } from "@/lib/documents";
import { briefToLineItems } from "@/lib/offer-import";
import type { Offer } from "@/lib/offers";
import type { Brief } from "@/lib/briefs";

const STATUS_OPTIONS = Object.entries(OFFER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export function OfferForm({
  offer,
  customers,
  briefs = [],
}: {
  offer?: Offer;
  customers: Customer[];
  /** Konfigurator-Anfragen, aus denen Positionen importiert werden können. */
  briefs?: Brief[];
}) {
  const isEdit = !!offer;
  const action = isEdit ? updateOffer : createOffer;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

  const [items, setItems] = useState<LineItem[]>(
    offer?.items && offer.items.length > 0
      ? offer.items
      : [{ description: "", quantity: 1, unit_price: 0 }],
  );

  const importFromBrief = (id: string) => {
    const brief = briefs.find((b) => b.id === id);
    if (!brief) return;
    const summary = brief.data?._summary ?? { projectType: brief.project_type ?? undefined };
    setItems(briefToLineItems(brief.data ?? {}, summary));
  };

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/angebote");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={offer.id} />}
      {state?.error && <FormError message={state.error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          name="user_id"
          label="Kunde"
          placeholder="Kunde auswählen …"
          defaultValue={offer?.user_id}
          options={customers.map((c) => ({ value: c.id, label: customerLabel(c) }))}
          error={state?.fieldErrors?.user_id?.[0]}
        />
        <Select name="status" label="Status" defaultValue={offer?.status ?? "draft"} options={STATUS_OPTIONS} />
        <Field name="number" label="Angebotsnr." defaultValue={offer?.number ?? suggestDocumentNumber("AN")} required error={state?.fieldErrors?.number?.[0]} />
        <Field name="title" label="Titel" defaultValue={offer?.title} placeholder="z. B. Angebot Website-Relaunch" required error={state?.fieldErrors?.title?.[0]} />
        <Field name="valid_until" label="Gültig bis" type="date" defaultValue={offer?.valid_until ?? ""} />
        <Field name="tax_rate" label="MwSt. %" type="number" min={0} max={100} step="0.1" defaultValue={offer?.tax_rate ?? 19} />
      </div>

      <TextArea name="content" label="Einleitung / Beschreibung" defaultValue={offer?.content ?? ""} placeholder="Beschreibe Leistungsumfang und Rahmenbedingungen …" rows={5} />

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">Positionen</p>
          {briefs.length > 0 && (
            <label className="flex items-center gap-2 text-xs text-white/50">
              Aus Konfiguration importieren:
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) importFromBrief(e.target.value);
                  e.target.value = "";
                }}
                className="rounded-lg border border-white/12 bg-black/40 px-2 py-1.5 text-sm text-white outline-none focus:border-[#09ed2d]/60"
              >
                <option value="" disabled>
                  Anfrage wählen …
                </option>
                {briefs.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                    {b.company ? ` (${b.company})` : ""}
                    {b.price_min != null && b.price_max != null
                      ? ` · ${b.price_min}–${b.price_max} €`
                      : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <LineItemsEditor value={items} onChange={setItems} taxRate={offer?.tax_rate ?? 19} />
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">{isEdit ? "Speichern" : "Angebot anlegen"}</SubmitButton>
      </div>
    </form>
  );
}
