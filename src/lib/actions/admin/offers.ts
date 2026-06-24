"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { lineItemSchema } from "@/lib/documents";

export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

const baseSchema = z.object({
  user_id: z.string().uuid("Bitte einen Kunden auswählen."),
  project_id: z.string().uuid().optional().or(z.literal("")),
  number: z.string().min(1, "Belegnummer fehlt.").max(40),
  title: z.string().min(2, "Titel fehlt.").max(160),
  status: z.enum(["draft", "sent", "accepted", "declined", "expired"]),
  valid_until: z.string().optional().or(z.literal("")),
  tax_rate: z.coerce.number().min(0).max(100),
  content: z.string().max(10000).optional(),
  items: z.string(),
});

function parseItems(raw: string) {
  try {
    return z.array(lineItemSchema).safeParse(JSON.parse(raw));
  } catch {
    return { success: false } as const;
  }
}

function readForm(formData: FormData) {
  return baseSchema.safeParse({
    user_id: formData.get("user_id"),
    project_id: formData.get("project_id") ?? undefined,
    number: formData.get("number"),
    title: formData.get("title"),
    status: formData.get("status"),
    valid_until: formData.get("valid_until") ?? undefined,
    tax_rate: formData.get("tax_rate"),
    content: formData.get("content") ?? undefined,
    items: formData.get("items") ?? "[]",
  });
}

export async function createOffer(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const items = parseItems(parsed.data.items);
  if (!items.success) return { ok: false, error: "Positionen sind ungültig." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("offers").insert({
      user_id: parsed.data.user_id,
      project_id: parsed.data.project_id || null,
      number: parsed.data.number,
      title: parsed.data.title,
      status: parsed.data.status,
      valid_until: parsed.data.valid_until || null,
      tax_rate: parsed.data.tax_rate,
      content: parsed.data.content || null,
      items: items.data,
    });
    if (error) return { ok: false, error: "Angebot konnte nicht angelegt werden." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath("/admin/angebote");
  return { ok: true };
}

export async function updateOffer(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, error: "Ungültige Anfrage." };

  const parsed = readForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const items = parseItems(parsed.data.items);
  if (!items.success) return { ok: false, error: "Positionen sind ungültig." };

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("offers")
      .update({
        user_id: parsed.data.user_id,
        project_id: parsed.data.project_id || null,
        number: parsed.data.number,
        title: parsed.data.title,
        status: parsed.data.status,
        valid_until: parsed.data.valid_until || null,
        tax_rate: parsed.data.tax_rate,
        content: parsed.data.content || null,
        items: items.data,
      })
      .eq("id", id);
    if (error) return { ok: false, error: "Speichern fehlgeschlagen." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/angebote/${id}`);
  revalidatePath("/admin/angebote");
  return { ok: true };
}
