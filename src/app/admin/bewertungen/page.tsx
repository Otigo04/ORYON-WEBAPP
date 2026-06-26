import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { getAllTestimonials } from "@/lib/testimonials";

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" });

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <>
      <PageHeader
        title="Bewertungen"
        subtitle="Kundenstimmen für die Startseite pflegen."
        action={{ href: "/admin/bewertungen/neu", label: "Neue Bewertung" }}
      />

      {testimonials.length === 0 ? (
        <EmptyState>
          Noch keine Bewertungen. Solange keine veröffentlicht ist, zeigt die Startseite
          Beispiel-Stimmen.
        </EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-white/10">
            {testimonials.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/admin/bewertungen/${t.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {t.author} <span className="text-white/30">·</span>{" "}
                      <span className="text-[#09ed2d]">{"★".repeat(t.rating)}</span>
                    </p>
                    <p className="truncate text-xs text-white/40">
                      {t.role} · {df.format(new Date(t.created_at))}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      t.published
                        ? "bg-[#09ed2d]/15 text-[#09ed2d]"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {t.published ? "Veröffentlicht" : "Entwurf"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
