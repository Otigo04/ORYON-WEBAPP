"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createInvoice, updateInvoice, type ActionState } from "@/lib/actions/admin/invoices";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { LineItemsEditor } from "@/components/admin/LineItemsEditor";
import { ConfiguratorPicker } from "@/components/admin/ConfiguratorPicker";
import { type Customer } from "@/lib/customer";
import { INVOICE_STATUS_LABELS, suggestDocumentNumber, type LineItem } from "@/lib/documents";
import { briefDocumentTitle, briefToLineItems, briefToSummaryText } from "@/lib/offer-import";
import type { Invoice } from "@/lib/invoices";
import type { Brief } from "@/lib/briefs";

const STATUS_OPTIONS = Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const today = () => new Date().toISOString().slice(0, 10);

export function InvoiceForm({
  invoice,
  customers,
  briefs = [],
}: {
  invoice?: Invoice;
  customers: Customer[];
  /** Konfigurator-Anfragen, aus denen Positionen importiert werden können. */
  briefs?: Brief[];
}) {
  const isEdit = !!invoice;
  const action = isEdit ? updateInvoice : createInvoice;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

  const [userId, setUserId] = useState(invoice?.user_id ?? "");
  const [title, setTitle] = useState(invoice?.title ?? "");
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [items, setItems] = useState<LineItem[]>(
    invoice?.items && invoice.items.length > 0
      ? invoice.items
      : [{ description: "", quantity: 1, unit_price: 0 }],
  );

  const importFromBrief = (brief: Brief) => {
    const summary = brief.data?._summary ?? { projectType: brief.project_type ?? undefined };
    setItems(briefToLineItems(brief.data ?? {}, summary));
    setTitle(briefDocumentTitle(brief));
    setNotes(briefToSummaryText(brief));
  };

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/rechnungen");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={invoice.id} />}
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
        <Select name="status" label="Status" defaultValue={invoice?.status ?? "draft"} options={STATUS_OPTIONS} />
        <Field name="number" label="Rechnungsnr." defaultValue={invoice?.number ?? suggestDocumentNumber("RE")} required error={state?.fieldErrors?.number?.[0]} />
        <Field name="title" label="Titel" value={title} onChange={setTitle} placeholder="z. B. Website-Erstellung" required error={state?.fieldErrors?.title?.[0]} />
        <Field name="issue_date" label="Rechnungsdatum" type="date" defaultValue={invoice?.issue_date ?? today()} required />
        <Field name="due_date" label="Fällig bis" type="date" defaultValue={invoice?.due_date ?? ""} />
        <Field name="tax_rate" label="MwSt. %" type="number" min={0} max={100} step="0.1" defaultValue={invoice?.tax_rate ?? 19} />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">Positionen</p>
        <LineItemsEditor value={items} onChange={setItems} taxRate={invoice?.tax_rate ?? 19} />
      </div>

      <TextArea name="notes" label="Hinweise (optional)" value={notes} onChange={setNotes} placeholder="Zahlungsbedingungen, Bankverbindung …" />

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">{isEdit ? "Speichern" : "Rechnung anlegen"}</SubmitButton>
      </div>
    </form>
  );
}
