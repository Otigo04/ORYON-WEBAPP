import { caseStudy } from "@/lib/case-study";

/**
 * Case Study (ersetzt das frühere Portfolio mit Beispielprojekten).
 * Ausgangslage → Lösung → Technik. Offene Fakten stehen als sichtbare
 * Platzhalter in `src/lib/case-study.ts`. Reine Server Component.
 */
export function CaseStudy() {
  return (
    <section
      id="projekt"
      className="border-t border-white/10 bg-black px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ein Projekt aus der Praxis
          </h2>
          <p className="mt-3 text-base text-white/60">{caseStudy.title}</p>
          <p className="mt-1 text-sm text-white/40">{caseStudy.client}</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white">Ausgangslage</h3>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/60">
              {caseStudy.situation.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white">Lösung</h3>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/60">
              {caseStudy.solution.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white">Eingesetzte Technik</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{caseStudy.tech}</p>
          </article>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-6 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-dashed border-white/15 p-5">
            <dt className="font-medium text-white/80">Ergebnis</dt>
            <dd className="mt-2 text-white/50">{caseStudy.result}</dd>
          </div>
          <div className="rounded-xl border border-dashed border-white/15 p-5">
            <dt className="font-medium text-white/80">Kundenstimme</dt>
            <dd className="mt-2 text-white/50">{caseStudy.quote}</dd>
          </div>
          <div className="rounded-xl border border-dashed border-white/15 p-5">
            <dt className="font-medium text-white/80">Bild</dt>
            <dd className="mt-2 text-white/50">{caseStudy.image}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
