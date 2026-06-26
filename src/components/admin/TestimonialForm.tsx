"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createTestimonial,
  updateTestimonial,
  type ActionState,
} from "@/lib/actions/admin/showcase";
import { Field, TextArea, Select, Checkbox, SubmitButton, FormError } from "@/components/admin/Fields";
import type { TestimonialRow } from "@/lib/testimonials";

const RATING_OPTIONS = [5, 4, 3, 2, 1].map((n) => ({
  value: String(n),
  label: `${n} Sterne`,
}));

export function TestimonialForm({ testimonial }: { testimonial?: TestimonialRow }) {
  const isEdit = !!testimonial;
  const action = isEdit ? updateTestimonial : createTestimonial;
  const [state, formAction] = useActionState<ActionState, FormData>(action, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.ok && !isEdit) router.push("/admin/bewertungen");
  }, [state, isEdit, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="id" value={testimonial.id} />}
      {state?.error && <FormError message={state.error} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="author"
          label="Name"
          defaultValue={testimonial?.author}
          placeholder="z. B. Lena Brandt"
          required
          error={state?.fieldErrors?.author?.[0]}
        />
        <Select
          name="rating"
          label="Bewertung"
          defaultValue={String(testimonial?.rating ?? 5)}
          options={RATING_OPTIONS}
        />
      </div>

      <Field
        name="role"
        label="Rolle / Firma"
        defaultValue={testimonial?.role}
        placeholder="z. B. Gründerin, NORDLICHT Studio"
        required
        error={state?.fieldErrors?.role?.[0]}
      />
      <TextArea
        name="quote"
        label="Zitat"
        defaultValue={testimonial?.quote ?? ""}
        placeholder="Die Aussage des Kunden …"
        rows={4}
        error={state?.fieldErrors?.quote?.[0]}
      />
      <Field
        name="sort_order"
        label="Reihenfolge (kleiner = weiter vorne)"
        type="number"
        min={0}
        defaultValue={testimonial?.sort_order ?? 0}
      />
      <Checkbox
        name="published"
        label="Veröffentlicht"
        defaultChecked={testimonial?.published ?? false}
        hint="Nur veröffentlichte Bewertungen erscheinen auf der Startseite."
      />

      <div className="flex justify-end">
        <SubmitButton pendingLabel="Speichern …">
          {isEdit ? "Speichern" : "Bewertung anlegen"}
        </SubmitButton>
      </div>
    </form>
  );
}
