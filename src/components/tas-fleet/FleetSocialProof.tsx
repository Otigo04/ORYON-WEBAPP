import { FLEET_TESTIMONIALS } from "@/lib/tas-fleet";

/**
 * Social Proof: Referenzhinweis auf ON Mobility plus 5-Sterne-Stimmen aus dem
 * Betriebsalltag. Reine Server Component.
 */
export function FleetSocialProof() {
  return (
    <section
      id="referenzen"
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-black via-[#03100a] to-black px-6 py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#22d3ee]/[0.07] blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#22d3ee]">
            Referenzen
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Betriebe, die nicht mehr ohne TAS-FLEET arbeiten wollen
          </h2>
          <p className="mt-4 text-base text-white/60">
            Entwickelt in der Praxis, im täglichen Einsatz bei{" "}
            <span className="font-medium text-white/80">ON Mobility</span>.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {FLEET_TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.quote}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex gap-0.5 text-[#09ed2d]" aria-label={`${testimonial.rating} von 5 Sternen`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/75">
                {`„${testimonial.quote}“`}
              </blockquote>
              <figcaption className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold text-white">{testimonial.author}</p>
                <p className="text-xs text-white/50">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="m12 2 2.9 6.26L21.5 9.3l-4.75 4.42L18 21l-6-3.27L6 21l1.25-7.28L2.5 9.3l6.6-1.04L12 2Z" />
    </svg>
  );
}
