import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "TAS Webworks ist ein Einzelunternehmen aus Berlin. Hier erfährst du, wer hinter den Websites steht und wie die Zusammenarbeit abläuft.",
  alternates: { canonical: "/ueber-uns" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Über uns – TAS Webworks",
    description:
      "Einzelunternehmen aus Berlin: persönlich und transparent.",
    url: `${siteConfig.url}/ueber-uns`,
    type: "website",
  },
};

const values = [
  {
    title: "Preise vorab",
    body: "Du weißt vor Projektstart, womit du rechnen musst. Keine versteckten Posten auf der Rechnung.",
  },
  {
    title: "Persönlich",
    body: "Du sprichst direkt mit der Person, die deine Seite baut – kurze Wege und klare Absprachen.",
  },
  {
    title: "Solide Technik",
    body: "Ich setze auf etablierte Werkzeuge, damit deine Seite zuverlässig läuft und sich später erweitern lässt.",
  },
  {
    title: "Nutzen vor Effekt",
    body: "Eine Seite soll Besucher zu Anfragen machen – nicht nur gut aussehen.",
  },
];

const facts = [
  { label: "Gegründet", value: siteConfig.foundingYear },
  { label: "Standort", value: `${siteConfig.address.city}` },
  { label: "Inhaber", value: siteConfig.founder },
];

export default function UeberUnsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Über TAS Webworks",
    url: `${siteConfig.url}/ueber-uns`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      founder: { "@type": "Person", name: siteConfig.founder },
      foundingDate: siteConfig.foundingYear,
      url: siteConfig.url,
      ...(siteConfig.hasEmail ? { email: siteConfig.email } : {}),
      telephone: siteConfig.telephone,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        postalCode: siteConfig.address.postalCode,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.region,
        addressCountry: siteConfig.address.country,
      },
    },
  };

  return (
    <>
      <Navbar />
      <main className="bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-28 sm:pt-32">
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Über TAS Webworks
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          TAS Webworks ist ein Einzelunternehmen. Du hast einen festen
          Ansprechpartner, der dein Projekt von der ersten Idee bis zum Livegang
          begleitet.
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-white/40">
                {f.label}
              </dt>
              <dd className="mt-1 text-lg font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-white/10 p-8 sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Warum es TAS Webworks gibt</h2>
          <div className="mt-6 space-y-4 text-white/70">
            <p>
              Kleine Unternehmen brauchen eine Website, die funktioniert.
              Baukasten-Seiten sind schnell gemacht, stoßen aber oft an Grenzen.
            </p>
            <p>
              Deshalb baue ich Websites und Web-Apps selbst und rechne
              transparent ab: Im Preisrechner siehst du vorab, womit du rechnen
              musst.
            </p>
            <p>
              Ich bin {siteConfig.founder}. [PLATZHALTER: Kurzer persönlicher
              Hintergrund – Werdegang, Erfahrung, ggf. Foto]
            </p>
          </div>
        </div>
      </section>

      {/* Werte */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Wofür ich stehe</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-lg font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-white/70">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-white/15 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Du hast ein Projekt?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Berechne in einer Minute einen Richtpreis – unverbindlich.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#preisrechner"
              className="rounded-xl bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
            >
              Preis berechnen
            </Link>
            <Link
              href="/#kontakt"
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
