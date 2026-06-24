"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createInvoice, updateInvoice, type ActionState } from "@/lib/actions/admin/invoices";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { LineItemsEditor } from "@/components/admin/LineItemsEditor";
import { customerLabel, type Customer } from "@/lib/customer";
import { INVOICE_STATUS_LABELS, suggestDocumentNumber } from "@/lib/documents";
import type { Invoice } from "@/lib/invoices";

const STATUS_OPTIONS = Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => ({ value, label }));

const today = () => new Date().toISOString().slice(0, 10);

export function InvoiceForm({ invoice, customers }: { invoice?: Invoice; customers: Customer[] }) {
  const isEdit = !!invoice;
  const action = isEdit ? updateInvoice : createInvoice;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/rechnungen");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={invoice.id} />}
      {state?.error && <FormError message={state.error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          name="user_id"
          label="Kunde"
          placeholder="Kunde auswählen …"
          defaultValue={invoice?.user_id}
          options={customers.map((c) => ({ value: c.id, label: customerLabel(c) }))}
          error={state?.fieldErrors?.user_id?.[0]}
        />
        <Select name="status" label="Status" defaultValue={invoice?.status ?? "draft"} options={STATUS_OPTIONS} />
        <Field name="number" label="Rechnungsnr." defaultValue={invoice?.number ?? suggestDocumentNumber("RE")} required error={state?.fieldErrors?.number?.[0]} />
        <Field name="title" label="Titel" defaultValue={invoice?.title} placeholder="z. B. Website-Erstellung" required error={state?.fieldErrors?.title?.[0]} />
        <Field name="issue_date" label="Rechnungsdatum" type="date" defaultValue={invoice?.issue_date ?? today()} required />
        <Field name="due_date" label="Fällig bis" type="date" defaultValue={invoice?.due_date ?? ""} />
        <Field name="tax_rate" label="MwSt. %" type="number" min={0} max={100} step="0.1" defaultValue={invoice?.tax_rate ?? 19} />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/50">Positionen</p>
        <LineItemsEditor defaultItems={invoice?.items} taxRate={invoice?.tax_rate ?? 19} />
      </div>

      <TextArea name="notes" label="Hinweise (optional)" defaultValue={invoice?.notes ?? ""} placeholder="Zahlungsbedingungen, Bankverbindung …" />

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">{isEdit ? "Speichern" : "Rechnung anlegen"}</SubmitButton>
      </div>
    </form>
  );
}
