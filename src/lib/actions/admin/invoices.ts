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
  status: z.enum(["draft", "sent", "paid", "cancelled"]),
  issue_date: z.string().min(1, "Datum fehlt."),
  due_date: z.string().optional().or(z.literal("")),
  tax_rate: z.coerce.number().min(0).max(100),
  notes: z.string().max(5000).optional(),
  items: z.string(),
});

function parseItems(raw: string) {
  try {
    const arr = JSON.parse(raw);
    return z.array(lineItemSchema).safeParse(arr);
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
    issue_date: formData.get("issue_date"),
    due_date: formData.get("due_date") ?? undefined,
    tax_rate: formData.get("tax_rate"),
    notes: formData.get("notes") ?? undefined,
    items: formData.get("items") ?? "[]",
  });
}

export async function createInvoice(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = readForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const items = parseItems(parsed.data.items);
  if (!items.success) {
    return { ok: false, error: "Positionen sind ungültig." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("invoices").insert({
      user_id: parsed.data.user_id,
      project_id: parsed.data.project_id || null,
      number: parsed.data.number,
      title: parsed.data.title,
      status: parsed.data.status,
      issue_date: parsed.data.issue_date,
      due_date: parsed.data.due_date || null,
      tax_rate: parsed.data.tax_rate,
      notes: parsed.data.notes || null,
      items: items.data,
    });
    if (error) return { ok: false, error: "Rechnung konnte nicht angelegt werden." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath("/admin/rechnungen");
  return { ok: true };
}

export async function updateInvoice(
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
  if (!items.success) {
    return { ok: false, error: "Positionen sind ungültig." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("invoices")
      .update({
        user_id: parsed.data.user_id,
        project_id: parsed.data.project_id || null,
        number: parsed.data.number,
        title: parsed.data.title,
        status: parsed.data.status,
        issue_date: parsed.data.issue_date,
        due_date: parsed.data.due_date || null,
        tax_rate: parsed.data.tax_rate,
        notes: parsed.data.notes || null,
        items: items.data,
      })
      .eq("id", id);
    if (error) return { ok: false, error: "Speichern fehlgeschlagen." };
  } catch {
    return { ok: false, error: "Unerwarteter Fehler." };
  }

  revalidatePath(`/admin/rechnungen/${id}`);
  revalidatePath("/admin/rechnungen");
  return { ok: true };
}
