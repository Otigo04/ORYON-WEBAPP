"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

// Leere Strings aus optionalen Feldern zu undefined normalisieren.
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

// =====================================================================
// Referenzprojekte
// =====================================================================

const projectSchema = z.object({
  title: z.string().trim().min(2, "Titel fehlt.").max(160),
  category: z.string().trim().min(2, "Kategorie fehlt.").max(120),
  description: z.string().trim().min(2, "Beschreibung fehlt.").max(2000),
  image_url: optionalText.pipe(z.string().url("Bitte eine gültige URL angeben.").optional()),
  project_url: optionalText.pipe(z.string().url("Bitte eine gültige URL angeben.").optional()),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.coerce.boolean().default(false),
});

function readProject(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    image_url: formData.get("image_url") ?? undefined,
    project_url: formData.get("project_url") ?? undefined,
    sort_order: formData.get("sort_order") ?? 0,
    // Checkbox: vorhanden => "on"/"true", sonst null
    published: formData.get("published") != null,
  });
}

export async function createShowcaseProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = readProject(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("showcase_projects").insert({
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description,
      image_url: parsed.data.image_url ?? null,
      project_url: parsed.data.project_url ?? null,
      sort_order: parsed.data.sort_order,
      published: parsed.data.published,
    });
    if (error) return { ok: false, error: "Referenz konnte nicht angelegt werden." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath("/admin/referenzen");
  revalidatePath("/");
  return { ok: true };
}

export async function updateShowcaseProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, error: "Ungültige Anfrage." };

  const parsed = readProject(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("showcase_projects")
      .update({
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description,
        image_url: parsed.data.image_url ?? null,
        project_url: parsed.data.project_url ?? null,
        sort_order: parsed.data.sort_order,
        published: parsed.data.published,
      })
      .eq("id", id);
    if (error) return { ok: false, error: "Speichern fehlgeschlagen." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/referenzen/${id}`);
  revalidatePath("/admin/referenzen");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteShowcaseProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createClient();
  await supabase.from("showcase_projects").delete().eq("id", id);

  revalidatePath("/admin/referenzen");
  revalidatePath("/");
}

// =====================================================================
// Kundenbewertungen
// =====================================================================

const testimonialSchema = z.object({
  author: z.string().trim().min(2, "Name fehlt.").max(120),
  role: z.string().trim().min(2, "Rolle/Firma fehlt.").max(160),
  quote: z.string().trim().min(2, "Zitat fehlt.").max(1000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  published: z.coerce.boolean().default(false),
});

function readTestimonial(formData: FormData) {
  return testimonialSchema.safeParse({
    author: formData.get("author"),
    role: formData.get("role"),
    quote: formData.get("quote"),
    rating: formData.get("rating") ?? 5,
    sort_order: formData.get("sort_order") ?? 0,
    published: formData.get("published") != null,
  });
}

export async function createTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = readTestimonial(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").insert({
      author: parsed.data.author,
      role: parsed.data.role,
      quote: parsed.data.quote,
      rating: parsed.data.rating,
      sort_order: parsed.data.sort_order,
      published: parsed.data.published,
    });
    if (error) return { ok: false, error: "Bewertung konnte nicht angelegt werden." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath("/admin/bewertungen");
  revalidatePath("/");
  return { ok: true };
}

export async function updateTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, error: "Ungültige Anfrage." };

  const parsed = readTestimonial(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("testimonials")
      .update({
        author: parsed.data.author,
        role: parsed.data.role,
        quote: parsed.data.quote,
        rating: parsed.data.rating,
        sort_order: parsed.data.sort_order,
        published: parsed.data.published,
      })
      .eq("id", id);
    if (error) return { ok: false, error: "Speichern fehlgeschlagen." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/bewertungen/${id}`);
  revalidatePath("/admin/bewertungen");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);

  revalidatePath("/admin/bewertungen");
  revalidatePath("/");
}
