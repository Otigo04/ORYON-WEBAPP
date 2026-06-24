"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOffer, updateOffer, type ActionState } from "@/lib/actions/admin/offers";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { LineItemsEditor } from "@/components/admin/LineItemsEditor";
import { customerLabel, type Customer } from "@/lib/customer";
import { OFFER_STATUS_LABELS, suggestDocumentNumber } from "@/lib/documents";
import type { Offer } from "@/lib/offers";

const STATUS_OPTIONS = Object.entries(OFFER_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export function OfferForm({ offer, customers }: { offer?: Offer; customers: Customer[] }) {
  const isEdit = !!offer;
  const action = isEdit ? updateOffer : createOffer;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

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
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">Positionen</p>
        <LineItemsEditor defaultItems={offer?.items} taxRate={offer?.tax_rate ?? 19} />
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">{isEdit ? "Speichern" : "Angebot anlegen"}</SubmitButton>
      </div>
    </form>
  );
}
