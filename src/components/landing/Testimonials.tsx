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

/** Echte, veröffentlichte Bewertungen als cleanes Karten-Grid. */
function RealTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <>
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
    </>
  );
}

const promises = [
  {
    title: "Zufrieden oder wir bessern nach",
    body: "Wir liefern erst ab, wenn du wirklich glücklich mit deiner Seite bist. Faire Korrekturschleifen inklusive, kein Aufpreis.",
  },
  {
    title: "Fester Festpreis, vorab",
    body: "Der Preis steht vor dem ersten Klick. Keine Stundenzettel, keine Nachforderungen, keine Überraschung auf der Rechnung.",
  },
  {
    title: "Antwort in unter 24 Stunden",
    body: "Direkter Draht zum Entwickler in Berlin. Kein Callcenter, kein Ticket-Pingpong, kein Outsourcing ins Ausland.",
  },
  {
    title: "Daten sicher in der EU",
    body: "DSGVO-konformes Hosting, Row-Level-Security und verschlüsselte Verbindungen. Deine und die Daten deiner Kunden bleiben geschützt.",
  },
];

/**
 * Ehrliche „Versprechen"-Sektion, solange keine echten Kundenstimmen vorliegen.
 * Baut Vertrauen über konkrete Garantien statt über erfundene Testimonials –
 * plus ein transparentes Angebot, die erste Referenz zu werden.
 */
function FoundersPromise() {
  return (
    <>
      <header className="mb-14 max-w-2xl">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
          Unser Versprechen
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Kein Marketing-Gerede. Klare Zusagen.
        </h2>
        <p className="mt-4 text-base text-white/60">
          TAS Webworks ist jung und inhabergeführt, deshalb setzen wir auf ehrliche
          Garantien statt auf ausgedachte Bewertungen. Darauf kannst du dich verlassen:
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {promises.map((p, i) => (
          <div
            key={p.title}
            className="group relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#09ed2d]/40 hover:bg-white/[0.06]"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-[#09ed2d]/30 bg-[#09ed2d]/10 text-sm font-bold text-[#09ed2d]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ehrlicher „erste Referenz werden“-Aufruf statt Fake-Social-Proof */}
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#09ed2d]/30 bg-gradient-to-br from-[#09ed2d]/[0.12] via-white/[0.03] to-black p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#09ed2d]/20 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Werde eine unserer ersten Referenzen.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Frühe Projekte begleiten wir besonders eng und zu besonders fairen Konditionen.
              Deine Seite wird zum Aushängeschild, für dich und für uns.
            </p>
          </div>
          <a
            href="#preisrechner"
            className="whitespace-nowrap rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
          >
            Projekt starten
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * Server Component: lädt echte Bewertungen (RSC). Sind welche vorhanden, werden
 * sie als Karten-Grid gezeigt; andernfalls eine ehrliche „Versprechen"-Sektion
 * statt erfundener Stimmen. Der Anker #referenzen bleibt in beiden Fällen gültig.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials();
  const hasReal = testimonials.length > 0;

  return (
    <section
      id="referenzen"
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-black via-[#04120b] to-black py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#09ed2d]/[0.06] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        {hasReal ? (
          <RealTestimonials testimonials={testimonials} />
        ) : (
          <FoundersPromise />
        )}
      </div>
    </section>
  );
}
