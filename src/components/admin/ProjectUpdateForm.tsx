"use client";

import { useActionState, useRef, useEffect } from "react";
import { addProjectUpdate, type ActionState } from "@/lib/actions/admin/projects";
import { Field, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";

export function ProjectUpdateForm({ projectId }: { projectId: string }) {
  const [state, action] = useActionState<ActionState, FormData>(addProjectUpdate, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Nach erfolgreichem Speichern Formular leeren.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="project_id" value={projectId} />
      {state?.error && <FormError message={state.error} />}

      <Field
        name="title"
        label="Update-Titel"
        placeholder="z. B. Design-Entwurf fertiggestellt"
        required
        error={state?.fieldErrors?.title?.[0]}
      />
      <TextArea
        name="body"
        label="Details (optional)"
        placeholder="Was wurde gemacht? Was kommt als Nächstes?"
        rows={3}
      />
      <div className="flex justify-end">
        <SubmitButton pendingLabel="Posten …">Update posten</SubmitButton>
      </div>
    </form>
  );
}
