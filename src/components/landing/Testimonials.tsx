import { getTestimonials } from "@/lib/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} von 5 Sternen`}
    >
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

/**
 * Server Component: lädt Bewertungen serverseitig (RSC) – kein Client-JS nötig.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section
      id="referenzen"
      className="border-t border-white/10 bg-black px-6 py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Referenzen
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Das sagen unsere Kunden
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div>
                <Stars rating={t.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed text-white/80">
                  „{t.quote}“
                </blockquote>
              </div>
              <figcaption className="mt-6">
                <p className="text-sm font-semibold text-white">{t.author}</p>
                <p className="text-xs text-white/50">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
