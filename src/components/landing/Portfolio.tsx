import Image from "next/image";
import { getProjects } from "@/lib/portfolio";

/**
 * Portfolio-Grid – lädt die besten Projekte serverseitig aus Supabase (RSC),
 * mit Dummy-Fallback. Kein Client-JS nötig.
 */
export async function Portfolio() {
  const projects = await getProjects();

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-black via-[#03100a] to-black px-6 py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-[#09ed2d]/[0.06] blur-[120px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <header className="mb-14 max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Portfolio
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projekte, die Ergebnisse liefern
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-[#09ed2d]/40"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-full w-full bg-gradient-to-br from-[#09ed2d]/20 via-black to-black"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-bold tracking-tight text-white/10">
                        {project.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[#09ed2d]">
                  {project.category}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
