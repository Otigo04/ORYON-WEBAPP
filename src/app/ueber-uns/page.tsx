import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "TAS Webworks ist eine inhabergeführte Webagentur aus Berlin. Lerne die Menschen, die Arbeitsweise und die Werte hinter blitzschnellen, conversion-starken Websites kennen.",
  alternates: { canonical: "/ueber-uns" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Über uns – TAS Webworks",
    description:
      "Inhabergeführte Webagentur aus Berlin: persönlich, transparent, technisch top.",
    url: `${siteConfig.url}/ueber-uns`,
    type: "website",
  },
};

const values = [
  {
    title: "Transparente Festpreise",
    body: "Du weißt vor Projektstart, was es kostet. Keine versteckten Posten, keine bösen Überraschungen auf der Rechnung.",
  },
  {
    title: "Persönlich statt Hotline",
    body: "Du sprichst direkt mit der Person, die deine Seite baut – kurze Wege, schnelle Antworten, ein Ansprechpartner.",
  },
  {
    title: "Technik mit Zukunft",
    body: "Next.js, TypeScript und moderne Infrastruktur. Deine Seite ist schnell, sicher und wächst mit deinem Unternehmen.",
  },
  {
    title: "Ergebnis vor Effekt",
    body: "Schön reicht nicht. Wir bauen Seiten, die Besucher zu Anfragen und Kunden machen – messbar.",
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
      email: siteConfig.email,
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
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
          Über uns
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Eine Webagentur aus Berlin, die mitdenkt –{" "}
          <span className="text-[#09ed2d]">nicht nur abliefert.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          TAS Webworks ist inhabergeführt. Das heißt: kein anonymes Agentur-Konstrukt,
          sondern ein fester Ansprechpartner, der dein Projekt von der ersten Idee bis zum
          Launch begleitet – und auch danach erreichbar bleibt.
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
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Warum es uns gibt</h2>
          <div className="mt-6 space-y-4 text-white/70">
            <p>
              Gute Websites waren lange ein Privileg großer Budgets. Kleine und mittlere
              Unternehmen bekamen entweder teure Agentur-Angebote oder Baukasten-Seiten, die
              langsam laden und bei Google untergehen.
            </p>
            <p>
              TAS Webworks schließt diese Lücke: Wir nutzen modernste Technik und
              automatisierte Abläufe, um Agentur-Qualität zu einem fairen Festpreis
              anzubieten. Schnell, suchmaschinenoptimiert und so gebaut, dass aus Besuchern
              echte Anfragen werden.
            </p>
            <p>
              Dahinter steht {siteConfig.founder} – mit dem Anspruch, Technik verständlich zu
              machen und Projekte ehrlich, planbar und persönlich umzusetzen.
            </p>
          </div>
        </div>
      </section>

      {/* Werte */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">Wofür wir stehen</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-lg font-semibold text-[#09ed2d]">{v.title}</h3>
              <p className="mt-2 text-sm text-white/70">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-[#09ed2d]/30 bg-[#09ed2d]/[0.06] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Lust auf ein Projekt mit klarem Preis?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Berechne in 60 Sekunden einen Richtpreis – unverbindlich und ohne versteckte
            Kosten.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#preisrechner"
              className="rounded-xl bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
            >
              Preis berechnen
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Direkt anfragen
            </a>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
