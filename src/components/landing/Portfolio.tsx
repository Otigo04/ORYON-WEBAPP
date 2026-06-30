import Image from "next/image";
import { getProjects, type Project } from "@/lib/portfolio";

/**
 * Portfolio-Grid: lädt die besten Projekte serverseitig aus Supabase (RSC),
 * mit Dummy-Fallback. Clean & hochwertig: jede Karte erscheint sanft gestaffelt
 * (CSS-Animation, kein Client-JS) und zeigt entweder ein echtes Bild oder einen
 * stilvollen Browser-Mockup als Platzhalter, damit das Grid immer erstklassig
 * aussieht, auch ohne hochauflösende Screenshots.
 */

/** Markentaugliche Verlauf-Paletten je Karte (rotierend). */
const GRADIENTS = [
  "from-[#09ed2d]/30 via-[#04140a] to-black",
  "from-[#22d3ee]/25 via-[#031016] to-black",
  "from-[#a855f7]/25 via-[#0c0614] to-black",
  "from-[#f59e0b]/25 via-[#140d03] to-black",
  "from-[#ec4899]/22 via-[#140310] to-black",
  "from-[#34f255]/28 via-[#04140a] to-black",
] as const;

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-[#22d3ee]/[0.05] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-14 max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            Portfolio
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projekte, die Ergebnisse liefern
          </h2>
          <p className="mt-4 text-base text-white/60">
            Ein Auszug aus unserer Arbeit: blitzschnell, clean und auf Conversion gebaut.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="animate-detail-in group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-[#09ed2d]/40 hover:shadow-[0_24px_60px_-30px_rgba(9,237,45,0.5)]"
              style={{ animationDelay: `${Math.min(i * 90, 540)}ms`, animationFillMode: "backwards" }}
            >
              <PreviewArea project={project} index={i} />

              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[#09ed2d]">
                  {project.category}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{project.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/40 transition group-hover:text-[#09ed2d]">
                  Projekt ansehen
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bildbereich: echtes Bild oder hochwertiger Browser-Mockup-Platzhalter. */
function PreviewArea({ project, index }: { project: Project; index: number }) {
  if (project.image_url) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  const gradient = GRADIENTS[index % GRADIENTS.length];
  const domain = project.title.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".de";

  return (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      {/* feines Raster für Tiefe */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      {/* Browser-Mockup */}
      <div className="absolute inset-x-5 top-5 bottom-0 rounded-t-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-amber-400/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          <span className="ml-2 truncate rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
            {domain}
          </span>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <span className="text-sm font-bold tracking-tight text-white/90">{project.title}</span>
          <span className="h-1.5 w-2/3 rounded-full bg-white/20" />
          <span className="h-1.5 w-1/2 rounded-full bg-white/10" />
          <div className="mt-2 grid grid-cols-3 gap-2">
            <span className="h-8 rounded-md bg-white/10" />
            <span className="h-8 rounded-md bg-white/10" />
            <span className="h-8 rounded-md bg-white/10" />
          </div>
          <span className="mt-1 h-6 w-24 rounded-full bg-[#09ed2d]/80" />
        </div>
      </div>
    </div>
  );
}
