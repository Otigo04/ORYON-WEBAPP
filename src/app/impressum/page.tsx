import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum von ${siteConfig.name} – Anbieterkennzeichnung nach § 5 DDG.`,
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

/**
 * Impressum (Anbieterkennzeichnung) nach § 5 DDG und § 18 Abs. 2 MStV.
 * Angaben kommen zentral aus `siteConfig`. Noch offene Angaben stehen als
 * sichtbarer [PLATZHALTER].
 */
export default function ImpressumPage() {
  const { address } = siteConfig;

  return (
    <LegalShell title="Impressum" intro="Angaben nach § 5 Digitale-Dienste-Gesetz (DDG).">
      <LegalSection heading="Anbieter">
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
          E-Mail: {siteConfig.email}
        </p>
      </LegalSection>

      <LegalSection heading="Umsatzsteuer">
        {siteConfig.smallBusiness ? (
          <p>
            Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
            Eine Umsatzsteuer-Identifikationsnummer wird nicht geführt.
          </p>
        ) : (
          <p>
            Umsatzsteuer-Identifikationsnummer nach § 27a UStG:{" "}
            {siteConfig.vatId ?? "[PLATZHALTER: USt-IdNr.]"}
          </p>
        )}
      </LegalSection>

      <LegalSection heading="Verantwortlich für Inhalte (§ 18 Abs. 2 MStV)">
        <p>
          {siteConfig.founder}
          <br />
          {address.street}, {address.postalCode} {address.city}
        </p>
      </LegalSection>

      <LegalSection heading="Streitbeilegung">
        <p>
          [PLATZHALTER: Hinweis zur außergerichtlichen Streitbeilegung – rechtliche Prüfung
          ausstehend. Offen ist u. a., ob und wie auf die frühere EU-Plattform zur
          Online-Streitbeilegung hingewiesen wird und ob Bereitschaft zur Teilnahme an einem
          Verbraucherschlichtungsverfahren besteht.]
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Inhalte">
        <p>
          Für eigene Inhalte auf dieser Website bin ich nach den allgemeinen Gesetzen
          verantwortlich (§ 7 Abs. 1 DDG). Fremde Informationen, die ich übermittle oder
          speichere, bin ich nach §§ 8 bis 10 DDG nicht verpflichtet zu überwachen. Wird mir
          eine Rechtsverletzung bekannt, entferne ich die betroffenen Inhalte umgehend.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <p>
          Diese Website kann auf externe Seiten verweisen, auf deren Inhalte ich keinen Einfluss
          habe. Verantwortlich ist immer der jeweilige Betreiber. Bei bekannt werdenden
          Rechtsverletzungen entferne ich den Link.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <p>
          Texte, Gestaltung und Quellcode dieser Website unterliegen dem deutschen Urheberrecht.
          Eine Nutzung außerhalb der gesetzlichen Grenzen bedarf meiner schriftlichen Zustimmung.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
