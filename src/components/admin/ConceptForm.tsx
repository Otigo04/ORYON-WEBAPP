"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createConcept, updateConcept, type ActionState } from "@/lib/actions/admin/concepts";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { customerLabel, type Customer } from "@/lib/customer";
import { CONCEPT_STATUS_LABELS } from "@/lib/documents";
import type { Concept } from "@/lib/concepts";

const STATUS_OPTIONS = Object.entries(CONCEPT_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export function ConceptForm({ concept, customers }: { concept?: Concept; customers: Customer[] }) {
  const isEdit = !!concept;
  const action = isEdit ? updateConcept : createConcept;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/konzepte");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={concept.id} />}
      {state?.error && <FormError message={state.error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          name="user_id"
          label="Kunde"
          placeholder="Kunde auswählen …"
          defaultValue={concept?.user_id}
          options={customers.map((c) => ({ value: c.id, label: customerLabel(c) }))}
          error={state?.fieldErrors?.user_id?.[0]}
        />
        <Select
          name="status"
          label="Status"
          defaultValue={concept?.status ?? "draft"}
          options={STATUS_OPTIONS}
        />
      </div>

      <Field name="title" label="Titel" defaultValue={concept?.title} placeholder="z. B. Content-Konzept Startseite" required error={state?.fieldErrors?.title?.[0]} />

      <TextArea
        name="content"
        label="Inhalt"
        defaultValue={concept?.content ?? ""}
        placeholder="Konzept ausführlich beschreiben … (Markdown-Format wird als Text dargestellt)"
        rows={14}
      />
      <p className="-mt-2 text-xs text-white/40">
        Tipp: Status &bdquo;Geteilt&ldquo; macht das Konzept für den Kunden im Dashboard sichtbar.
      </p>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">{isEdit ? "Speichern" : "Konzept anlegen"}</SubmitButton>
      </div>
    </form>
  );
}
