import { getTestimonials, type Testimonial } from "@/lib/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-[#09ed2d]" : "fill-white/15"}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.77l-5.2 2.73.99-5.78-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-[#09ed2d]/40 hover:bg-white/[0.07]">
      <div>
        <Stars rating={t.rating} />
        <blockquote className="mt-4 text-sm leading-relaxed text-white/80">
          „{t.quote}“
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-[#09ed2d]/30 to-[#22d3ee]/20 text-sm font-semibold text-[#09ed2d]"
        >
          {t.author.trim().charAt(0)}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{t.author}</p>
          <p className="text-xs text-white/50">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Server Component: lädt Bewertungen serverseitig (RSC) und zeigt sie als
 * cleanes, statisches Karten-Grid. Keine Animation, kein Client-JS.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section id="referenzen" className="border-t border-white/10 bg-black py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-14 max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Referenzen
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Das sagen unsere Kunden
          </h2>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
