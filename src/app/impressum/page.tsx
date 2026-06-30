import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum von ${siteConfig.name}, Anbieterkennzeichnung gemäß § 5 TMG.`,
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

/**
 * Impressum (Anbieterkennzeichnung) nach § 5 TMG und § 18 Abs. 2 MStV.
 * Die personen-/firmenbezogenen Angaben werden zentral aus `siteConfig` bezogen.
 */
export default function ImpressumPage() {
  const { address } = siteConfig;

  return (
    <LegalShell
      title="Impressum"
      intro="Angaben gemäß § 5 TMG."
    >
      <LegalSection heading="Diensteanbieter">
        <p>
          <strong>{siteConfig.name}</strong>
          <br />
          Inhaber: {siteConfig.founder}
          <br />
          {address.street}
          <br />
          {address.postalCode} {address.city}
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <p>
          Telefon: {siteConfig.telephone}
          <br />
          E-Mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <br />
          Web: <a href={siteConfig.url}>{siteConfig.url.replace("https://", "")}</a>
        </p>
      </LegalSection>

      <LegalSection heading="Umsatzsteuer">
        <p>
          Gemäß § 19 Abs. 1 Umsatzsteuergesetz (UStG) wird als Kleinunternehmer
          keine Umsatzsteuer berechnet und daher auch nicht ausgewiesen.
        </p>
      </LegalSection>

      <LegalSection heading="Redaktionell verantwortlich (§ 18 Abs. 2 MStV)">
        <p>
          {siteConfig.founder}
          <br />
          {address.street}
          <br />
          {address.postalCode} {address.city}
        </p>
      </LegalSection>

      <LegalSection heading="EU-Streitschlichtung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse findest du oben im Impressum.
        </p>
      </LegalSection>

      <LegalSection heading="Verbraucherstreitbeilegung / Universalschlichtungsstelle">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Inhalte">
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
          übermittelte oder gespeicherte fremde Informationen zu überwachen oder
          nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
          hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
          Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
          Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
          verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir
          derartige Links umgehend entfernen.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
          sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
