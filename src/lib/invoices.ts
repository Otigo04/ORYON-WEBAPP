import { createClient } from "@/lib/supabase/server";
import type { LineItem } from "@/lib/documents";

export type InvoiceStatus = "draft" | "sent" | "paid" | "cancelled";

export type Invoice = {
  id: string;
  created_at: string;
  user_id: string;
  project_id: string | null;
  number: string;
  title: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  items: LineItem[];
  tax_rate: number;
  currency: string;
  notes: string | null;
};

export type InvoiceWithCustomer = Invoice & {
  customer: { full_name: string | null; email: string | null } | null;
};

function hasSupabaseEnv() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

const COLS =
  "id, created_at, user_id, project_id, number, title, status, issue_date, due_date, items, tax_rate, currency, notes";

/** Rechnungen des eingeloggten Kunden (RLS: ohne Entwürfe). */
export async function getMyInvoices(): Promise<Invoice[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("invoices")
      .select(COLS)
      .order("issue_date", { ascending: false });

    if (error || !data) return [];
    return data as Invoice[];
  } catch {
    return [];
  }
}

/** Einzelne Rechnung (RLS-abgesichert). */
export async function getInvoice(id: string): Promise<Invoice | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("invoices")
      .select(COLS)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as Invoice;
  } catch {
    return null;
  }
}

/** Alle Rechnungen mit Kundenangabe (nur Admin). */
export async function getAllInvoices(): Promise<InvoiceWithCustomer[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("invoices")
      .select(`${COLS}, customer:profiles!invoices_user_id_fkey(full_name, email)`)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as unknown as InvoiceWithCustomer[];
  } catch {
    return [];
  }
}
