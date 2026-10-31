import {
  ENTRY_PRICE,
  PRICING,
  SHOP_COMPLEX_PRICE,
  SHOP_PRICE,
  WEBSITE_PRICE,
  formatEuro,
} from "@/lib/pricing";

/**
 * Leistungen – drei Angebotsarten mit Einstiegspreis. Alle Preise stammen aus
 * `pricing.config.ts` (über `@/lib/pricing`). Reine Server Component.
 */
type Offer = {
  title: string;
  description: string;
  price: string;
};

const offers: Offer[] = [
  {
    title: "One-Pager & Landingpages",
    description:
      "Eine Seite mit allem Wichtigen: wer du bist, was du anbietest und wie man dich erreicht. Passend für Selbstständige und kleine Betriebe.",
    price: `ab ${formatEuro(ENTRY_PRICE)}`,
  },
  {
    title: "Mehrseitige Websites",
    description:
      "Mehrere Unterseiten wie Leistungen, Über uns und Kontakt. Auf Wunsch mit Blog, Online-Terminbuchung oder weiteren Sprachen.",
    price: `ab ${formatEuro(WEBSITE_PRICE)}`,
  },
  {
    title: "Online-Shops",
    description: `Produktverwaltung, Bestellabwicklung und Zahlungsanbindung. Größere Vorhaben mit individueller Planung ab ${formatEuro(SHOP_COMPLEX_PRICE)}.`,
    price: `ab ${formatEuro(SHOP_PRICE)}`,
  },
];

export function Services() {
  return (
    <section
      id="leistungen"
      className="border-t border-white/10 bg-black px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Was ich für dich baue
          </h2>
          <p className="mt-4 text-base text-white/60">
            Jede Seite wird individuell geplant und programmiert. Die Preise
            unten sind Einstiegspreise – was dein Projekt konkret kostet, zeigt
            der Preisrechner.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.title}
              className="flex flex-col rounded-xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{offer.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                {offer.description}
              </p>
              <p className="mt-6 text-sm font-semibold text-[#09ed2d]">{offer.price}</p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-xs text-white/40">
          {PRICING.vatNote} Hosting und Wartung kommen monatlich dazu.{" "}
          <a href="#preisrechner" className="underline underline-offset-2 hover:text-white/70">
            Zum Preisrechner
          </a>
        </p>
      </div>
    </section>
  );
}
