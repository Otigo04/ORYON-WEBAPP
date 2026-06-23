import { createClient } from "@/lib/supabase/server";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Optionaler Bild-URL; ist keiner gesetzt, rendert die UI einen Verlauf. */
  image_url: string | null;
};

/**
 * Dummy-Projekte als Fallback, falls die Supabase-Datenbank leer oder nicht
 * verbunden ist – so bleibt das Portfolio-Grid immer befüllt.
 */
const fallbackProjects: Project[] = [
  {
    id: "fallback-1",
    title: "NORDLICHT Studio",
    category: "Webdesign & Branding",
    description:
      "Repräsentative Onepage mit Buchungsstrecke. +40 % qualifizierte Anfragen im ersten Quartal.",
    image_url: null,
  },
  {
    id: "fallback-2",
    title: "Vogel Logistik Portal",
    category: "Web-App & Dashboard",
    description:
      "Kundenportal mit Echtzeit-Sendungsverfolgung und abgesichertem Login via Supabase Auth.",
    image_url: null,
  },
  {
    id: "fallback-3",
    title: "Helio Shop",
    category: "E-Commerce",
    description:
      "Performanter Headless-Store. Ladezeit unter 1 s, Conversion-Rate verdoppelt.",
    image_url: null,
  },
  {
    id: "fallback-4",
    title: "Meridian Beratung",
    category: "Corporate Website",
    description:
      "SEO-optimierte Mehrseiten-Präsenz mit CMS-Anbindung und Lead-Formularen.",
    image_url: null,
  },
];

/**
 * Lädt Portfolio-Projekte serverseitig aus Supabase (RLS-konform, nur
 * öffentlich freigegebene Einträge). Bei fehlender Konfiguration, leerer
 * Tabelle oder Fehlern wird auf die Dummy-Projekte zurückgegriffen.
 */
export async function getProjects(): Promise<Project[]> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!hasSupabaseEnv) {
    return fallbackProjects;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, category, description, image_url")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error || !data || data.length === 0) {
      return fallbackProjects;
    }

    return data as Project[];
  } catch {
    return fallbackProjects;
  }
}
