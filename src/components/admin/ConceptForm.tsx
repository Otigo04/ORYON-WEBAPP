"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createConcept, updateConcept, type ActionState } from "@/lib/actions/admin/concepts";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { ConfiguratorPicker } from "@/components/admin/ConfiguratorPicker";
import { type Customer } from "@/lib/customer";
import { CONCEPT_STATUS_LABELS } from "@/lib/documents";
import { briefDocumentTitle, briefToSummaryText } from "@/lib/offer-import";
import type { Concept } from "@/lib/concepts";
import type { Brief } from "@/lib/briefs";

const STATUS_OPTIONS = Object.entries(CONCEPT_STATUS_LABELS).map(([value, label]) => ({ value, label }));

export function ConceptForm({
  concept,
  customers,
  briefs = [],
}: {
  concept?: Concept;
  customers: Customer[];
  /** Konfigurator-Anfragen, aus denen Inhalt übernommen werden kann. */
  briefs?: Brief[];
}) {
  const isEdit = !!concept;
  const action = isEdit ? updateConcept : createConcept;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

  const [userId, setUserId] = useState(concept?.user_id ?? "");
  const [title, setTitle] = useState(concept?.title ?? "");
  const [content, setContent] = useState(concept?.content ?? "");

  const importFromBrief = (brief: Brief) => {
    setTitle(briefDocumentTitle(brief));
    setContent(briefToSummaryText(brief));
  };

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/konzepte");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={concept.id} />}
      {state?.error && <FormError message={state.error} />}

      <ConfiguratorPicker
        customers={customers}
        briefs={briefs}
        userId={userId}
        onUserChange={setUserId}
        onImport={importFromBrief}
        userError={state?.fieldErrors?.user_id?.[0]}
      />

      <Select
        name="status"
        label="Status"
        defaultValue={concept?.status ?? "draft"}
        options={STATUS_OPTIONS}
      />

      <Field name="title" label="Titel" value={title} onChange={setTitle} placeholder="z. B. Content-Konzept Startseite" required error={state?.fieldErrors?.title?.[0]} />

      <TextArea
        name="content"
        label="Inhalt"
        value={content}
        onChange={setContent}
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
