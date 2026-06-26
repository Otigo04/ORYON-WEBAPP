"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createShowcaseProject,
  updateShowcaseProject,
  type ActionState,
} from "@/lib/actions/admin/showcase";
import { Field, TextArea, Checkbox, SubmitButton, FormError } from "@/components/admin/Fields";
import type { ShowcaseProject } from "@/lib/portfolio";

export function ShowcaseProjectForm({ project }: { project?: ShowcaseProject }) {
  const isEdit = !!project;
  const action = isEdit ? updateShowcaseProject : createShowcaseProject;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/referenzen");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={project.id} />}
      {state?.error && <FormError message={state.error} />}

      <Field
        name="title"
        label="Titel"
        defaultValue={project?.title}
        placeholder="z. B. NORDLICHT Studio"
        required
        error={state?.fieldErrors?.title?.[0]}
      />
      <Field
        name="category"
        label="Kategorie"
        defaultValue={project?.category}
        placeholder="z. B. Webdesign & Branding"
        required
        error={state?.fieldErrors?.category?.[0]}
      />
      <TextArea
        name="description"
        label="Beschreibung"
        defaultValue={project?.description ?? ""}
        placeholder="Kurzer Ergebnis-/Wirkungssatz, z. B. +40 % qualifizierte Anfragen im ersten Quartal."
        rows={4}
        error={state?.fieldErrors?.description?.[0]}
      />
      <Field
        name="image_url"
        label="Bild-URL (optional)"
        type="url"
        defaultValue={project?.image_url ?? ""}
        placeholder="https://…/storage/v1/object/public/showcase/projekt.jpg"
        error={state?.fieldErrors?.image_url?.[0]}
      />
      <p className="-mt-2 text-xs text-white/40">
        Tipp: Bild im Supabase-Storage-Bucket <code>showcase</code> ablegen und die öffentliche URL
        einfügen. Ohne Bild rendert die Seite einen Verlauf.
      </p>
      <Field
        name="project_url"
        label="Projekt-Link (optional)"
        type="url"
        defaultValue={project?.project_url ?? ""}
        placeholder="https://kunde.de"
        error={state?.fieldErrors?.project_url?.[0]}
      />
      <Field
        name="sort_order"
        label="Reihenfolge (kleiner = weiter vorne)"
        type="number"
        min={0}
        defaultValue={project?.sort_order ?? 0}
      />
      <Checkbox
        name="published"
        label="Veröffentlicht"
        defaultChecked={project?.published ?? false}
        hint="Nur veröffentlichte Referenzen erscheinen im Portfolio auf der Startseite."
      />

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">
          {isEdit ? "Speichern" : "Referenz anlegen"}
        </SubmitButton>
      </div>
    </form>
  );
}
