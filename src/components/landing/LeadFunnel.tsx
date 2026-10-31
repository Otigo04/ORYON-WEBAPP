import { siteConfig } from "@/lib/site";

/**
 * Abschluss-Sektion – zwei Wege zur Anfrage: Preisrechner oder Anruf. Die
 * Kontakt-E-Mail ist noch ein Platzhalter (siehe `siteConfig.hasEmail`), daher
 * gibt es hier bewusst keinen mailto-Link. Reine Server Component.
 */
const promises = [
  "Antwort innerhalb von 24 Stunden",
  "Unverbindliches Erstgespräch",
];

export function LeadFunnel() {
  const telHref = `tel:${siteConfig.telephone.replace(/\s+/g, "")}`;

  return (
    <section id="kontakt" className="border-t border-white/10 bg-black px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Dein Projekt starten
        </h2>
        <p className="mt-4 text-pretty text-base text-white/70 sm:text-lg">
          Berechne in einer Minute einen unverbindlichen Richtpreis oder ruf
          einfach an. Ich melde mich mit den nächsten Schritten.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#preisrechner"
            className="w-full rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
          >
            Preis berechnen
          </a>
          <a
            href={telHref}
            className="w-full rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            {siteConfig.telephone}
          </a>
        </div>

        <p className="mt-6 text-sm text-white/50">
          E-Mail: {siteConfig.email}
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
          {promises.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
