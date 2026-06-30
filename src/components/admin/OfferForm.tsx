"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOffer, updateOffer, type ActionState } from "@/lib/actions/admin/offers";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { LineItemsEditor } from "@/components/admin/LineItemsEditor";
import { ConfiguratorPicker } from "@/components/admin/ConfiguratorPicker";
import { type Customer } from "@/lib/customer";
import { OFFER_STATUS_LABELS, suggestDocumentNumber, type LineItem } from "@/lib/documents";
import { briefDocumentTitle, briefToOfferLineItems, briefToOfferText } from "@/lib/offer-import";
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

  const [userId, setUserId] = useState(offer?.user_id ?? "");
  const [title, setTitle] = useState(offer?.title ?? "");
  const [content, setContent] = useState(offer?.content ?? "");
  const [items, setItems] = useState<LineItem[]>(
    offer?.items && offer.items.length > 0
      ? offer.items
      : [{ description: "", quantity: 1, unit_price: 0 }],
  );

  const importFromBrief = (brief: Brief) => {
    const summary = brief.data?._summary ?? { projectType: brief.project_type ?? undefined };
    setItems(briefToOfferLineItems(brief.data ?? {}, summary));
    setTitle(briefDocumentTitle(brief));
    setContent(briefToOfferText(brief));
  };

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/angebote");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={offer.id} />}
      {state?.error && <FormError message={state.error} />}

      <ConfiguratorPicker
        customers={customers}
        briefs={briefs}
        userId={userId}
        onUserChange={setUserId}
        onImport={importFromBrief}
        userError={state?.fieldErrors?.user_id?.[0]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select name="status" label="Status" defaultValue={offer?.status ?? "draft"} options={STATUS_OPTIONS} />
        <Field name="number" label="Angebotsnr." defaultValue={offer?.number ?? suggestDocumentNumber("AN")} required error={state?.fieldErrors?.number?.[0]} />
        <Field name="title" label="Titel" value={title} onChange={setTitle} placeholder="z. B. Angebot Website-Relaunch" required error={state?.fieldErrors?.title?.[0]} />
        <Field name="valid_until" label="Gültig bis" type="date" defaultValue={offer?.valid_until ?? ""} />
        <Field name="tax_rate" label="MwSt. %" type="number" min={0} max={100} step="0.1" defaultValue={offer?.tax_rate ?? 19} />
      </div>

      <TextArea name="content" label="Einleitung / Beschreibung" value={content} onChange={setContent} placeholder="Beschreibe Leistungsumfang und Rahmenbedingungen …" rows={5} />

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">Positionen</p>
        <LineItemsEditor value={items} onChange={setItems} taxRate={offer?.tax_rate ?? 19} />
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">{isEdit ? "Speichern" : "Angebot anlegen"}</SubmitButton>
      </div>
    </form>
  );
}
