import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  author: string;
  role: string;
  quote: string;
  rating: number;
};

/**
 * Dummy-Bewertungen (alle 5 Sterne) als Fallback, falls die Supabase-Datenbank
 * leer oder nicht verbunden ist – so bleibt die Onepage immer befüllt.
 */
const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    author: "Lena Brandt",
    role: "Gründerin, NORDLICHT Studio",
    quote:
      "ORYON hat unsere Plattform in Rekordzeit umgesetzt. Schnell, sauber und messbar mehr Anfragen über die Seite.",
    rating: 5,
  },
  {
    id: "fallback-2",
    author: "Marco Vogel",
    role: "Geschäftsführer, Vogel Logistik",
    quote:
      "Vom ersten Entwurf bis zum Launch alles aus einer Hand. Das Team denkt mit und liefert verlässlich.",
    rating: 5,
  },
  {
    id: "fallback-3",
    author: "Sophie Keller",
    role: "Marketing-Lead, Helio GmbH",
    quote:
      "Die neue Landingpage performt herausragend. Ladezeiten, Design und Conversion – einfach top.",
    rating: 5,
  },
];

/**
 * Lädt Kundenbewertungen serverseitig aus Supabase (RLS-konform, nur
 * öffentlich freigegebene Einträge). Bei fehlender Konfiguration, leerer
 * Tabelle oder Fehlern wird auf die Dummy-Bewertungen zurückgegriffen.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const hasSupabaseEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!hasSupabaseEnv) {
    return fallbackTestimonials;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, author, role, quote, rating")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error || !data || data.length === 0) {
      return fallbackTestimonials;
    }

    return data as Testimonial[];
  } catch {
    return fallbackTestimonials;
  }
}
