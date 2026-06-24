"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProject,
  updateProject,
  type ActionState,
} from "@/lib/actions/admin/projects";
import { Field, Select, TextArea, SubmitButton, FormError } from "@/components/admin/Fields";
import { PROJECT_STATUS_LABELS } from "@/lib/documents";
import { customerLabel, type Customer } from "@/lib/customer";
import type { Project } from "@/lib/projects";

const STATUS_OPTIONS = Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function ProjectForm({
  project,
  customers,
}: {
  project?: Project;
  customers?: Customer[];
}) {
  const isEdit = !!project;
  const action = isEdit ? updateProject : createProject;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const [progress, setProgress] = useState(project?.progress ?? 0);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/projekte");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={project.id} />}
      {state?.error && <FormError message={state.error} />}

      {!isEdit && (
        <Select
          name="user_id"
          label="Kunde"
          placeholder="Kunde auswählen …"
          options={(customers ?? []).map((c) => ({ value: c.id, label: customerLabel(c) }))}
          error={state?.fieldErrors?.user_id?.[0]}
        />
      )}

      <Field
        name="title"
        label="Projekttitel"
        defaultValue={project?.title}
        placeholder="z. B. Relaunch Website"
        required
        error={state?.fieldErrors?.title?.[0]}
      />

      <TextArea
        name="description"
        label="Beschreibung"
        defaultValue={project?.description ?? ""}
        placeholder="Worum geht es in diesem Projekt?"
        error={state?.fieldErrors?.description?.[0]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          name="status"
          label="Status"
          defaultValue={project?.status ?? "planning"}
          options={STATUS_OPTIONS}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="progress" className="text-xs font-medium uppercase tracking-wide text-white/50">
            Fortschritt: {progress}%
          </label>
          <input
            id="progress"
            name="progress"
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="accent-[#09ed2d]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">
          {isEdit ? "Änderungen speichern" : "Projekt anlegen"}
        </SubmitButton>
      </div>
    </form>
  );
}
