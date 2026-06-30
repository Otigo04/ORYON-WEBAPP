import { BrowserFrame } from "@/components/tas-fleet/BrowserFrame";
import { FLEET_MODULES } from "@/lib/tas-fleet";

/**
 * Feature-Deep-Dive: jedes TAS-FLEET-Modul wird mit Text und einem
 * Browser-Mockup vorgestellt, abwechselnd links/rechts. Reine Server Component -
 * nur die einzelnen {@link BrowserFrame} sind Client-Inseln.
 */
export function FleetFeatures() {
  return (
    <section
      id="module"
      className="relative scroll-mt-28 overflow-hidden bg-gradient-to-b from-black via-[#03100a] to-black px-6 py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#09ed2d]/[0.06] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto mb-20 max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#22d3ee]">
            Module
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Alles, was Ihr Betrieb braucht, an einem Ort
          </h2>
          <p className="mt-4 text-base text-white/60">
            Sechs aufeinander abgestimmte Module decken den kompletten Alltag Ihrer
            Flotte ab. Kein Tool-Wirrwarr, keine Medienbrüche.
          </p>
        </header>

        <div className="flex flex-col gap-24">
          {FLEET_MODULES.map((module, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={module.id}
                id={module.id}
                className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* Text */}
                <div className={reversed ? "lg:order-2" : ""}>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#22d3ee]">
                    {module.eyebrow}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {module.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/60">
                    {module.description}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {module.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#09ed2d]/15 text-[#09ed2d]">
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none">
                            <path
                              d="m5 13 4 4 10-10"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mockup */}
                <div className={reversed ? "lg:order-1" : ""}>
                  <BrowserFrame src={module.image} alt={module.title} mock={module.mock} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
