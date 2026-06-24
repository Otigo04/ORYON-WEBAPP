"use client";

import { useActionState } from "react";
import { respondToLead, type ActionState } from "@/lib/actions/admin/leads";
import { Select, TextArea, SubmitButton, FormError, FormSuccess } from "@/components/admin/Fields";
import { LEAD_STATUS_LABELS } from "@/lib/documents";

const STATUS_OPTIONS = Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function LeadResponseForm({
  id,
  status,
  adminNote,
}: {
  id: string;
  status: string;
  adminNote: string | null;
}) {
  const [state, action] = useActionState<ActionState, FormData>(respondToLead, null);

  return (
    <form action={action} className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
      <input type="hidden" name="id" value={id} />
      {state?.error && <FormError message={state.error} />}
      {state?.ok && <FormSuccess message="Gespeichert." />}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr] sm:items-start">
        <Select name="status" label="Status" defaultValue={status} options={STATUS_OPTIONS} />
        <TextArea
          name="admin_note"
          label="Interne Notiz"
          defaultValue={adminNote ?? ""}
          placeholder="Notiz zur Bearbeitung, Antworttext, nächste Schritte …"
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">Status speichern</SubmitButton>
      </div>
    </form>
  );
}
