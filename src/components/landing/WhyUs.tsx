/**
 * Zusammenarbeit – vier belegbare Punkte statt Superlativen. Reine Server
 * Component (kein Client-JS). Technik steht bewusst nur in der „Gebaut mit"-
 * Zeile im Footer.
 */
type Reason = {
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    title: "Ein Ansprechpartner",
    description:
      "Du sprichst direkt mit mir – kein Ticketsystem, kein Callcenter. Persönliche Termine in Berlin sind nach Absprache möglich.",
  },
  {
    title: "Preise vorab",
    description:
      "Im Preisrechner siehst du vor der Anfrage, womit du ungefähr rechnen musst. Danach bekommst du ein schriftliches Angebot zum Festpreis.",
  },
  {
    title: "Alles aus einer Hand",
    description:
      "Konzept, Gestaltung, Programmierung und Hosting kommen von derselben Person. Du musst nichts zwischen Dienstleistern koordinieren.",
  },
  {
    title: "Gut auffindbar",
    description:
      "Saubere Seitenstruktur, Mobilansicht und die SEO-Grundlagen sind bei jeder Seite dabei, damit Google deine Inhalte richtig versteht.",
  },
];

export function WhyUs() {
  return (
    <section
      id="zusammenarbeit"
      className="border-t border-white/10 bg-black px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            So arbeite ich
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="rounded-xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{reason.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
