import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";
import { siteConfig } from "@/lib/site";
import { DEPOSIT_RATE } from "@/lib/payment";

export const metadata: Metadata = {
  title: "AGB",
  description: `Allgemeine Geschäftsbedingungen von ${siteConfig.name} für Webdesign- und Webentwicklungsleistungen.`,
  alternates: { canonical: "/agb" },
  robots: { index: true, follow: true },
};

const depositPercent = Math.round(DEPOSIT_RATE * 100);

/**
 * Allgemeine Geschäftsbedingungen (AGB) für die Erbringung von Webdesign-,
 * Webentwicklungs- und damit verbundenen Dienstleistungen.
 *
 * HINWEIS: Branchenüblicher, sorgfältig formulierter Entwurf, ersetzt keine
 * Rechtsberatung. Vor dem Verlassen auf diese AGB anwaltlich prüfen lassen.
 */
export default function AgbPage() {
  const { address } = siteConfig;

  return (
    <LegalShell
      title="Allgemeine Geschäftsbedingungen"
      intro="Diese Bedingungen regeln die Zusammenarbeit zwischen TAS Webworks und ihren Kundinnen und Kunden."
      updated="Juni 2026"
    >
      <LegalSection heading="§ 1 Geltungsbereich">
        <p>
          Diese Allgemeinen Geschäftsbedingungen (nachfolgend &bdquo;AGB&ldquo;) gelten für
          alle Verträge zwischen <strong>{siteConfig.name}</strong>, Inhaber{" "}
          {siteConfig.founder}, {address.street}, {address.postalCode} {address.city}{" "}
          (nachfolgend &bdquo;Auftragnehmer&ldquo;) und seinen Auftraggebern (nachfolgend
          &bdquo;Auftraggeber&ldquo;) über die Erbringung von Webdesign-, Webentwicklungs-,
          Beratungs- und damit zusammenhängenden Leistungen.
        </p>
        <p>
          Abweichende oder ergänzende Bedingungen des Auftraggebers werden nur Vertragsbestandteil,
          soweit der Auftragnehmer ihnen ausdrücklich in Textform zustimmt.
        </p>
      </LegalSection>

      <LegalSection heading="§ 2 Vertragsgegenstand und Leistungen">
        <p>
          Gegenstand des Vertrags ist die im jeweiligen Angebot bzw. in der Projektkonfiguration
          konkret beschriebene Leistung, etwa die Konzeption, Gestaltung und Umsetzung von
          Websites, Web-Apps und Landingpages sowie optional Hosting, Wartung und Pflege.
        </p>
        <p>
          Maßgeblich für Art und Umfang der Leistung ist die schriftliche Leistungsbeschreibung
          im angenommenen Angebot. Der über den Preisrechner oder Konfigurator ermittelte Betrag
          ist eine unverbindliche Orientierung und stellt kein verbindliches Angebot dar.
        </p>
      </LegalSection>

      <LegalSection heading="§ 3 Vertragsschluss">
        <p>
          Anfragen über den Preisrechner, den Konfigurator oder per E-Mail sind unverbindlich.
          Auf Grundlage der Anfrage erstellt der Auftragnehmer ein verbindliches Angebot. Der
          Vertrag kommt zustande, wenn der Auftraggeber dieses Angebot annimmt, etwa über die
          Annahmefunktion im Kundenportal oder in Textform.
        </p>
      </LegalSection>

      <LegalSection heading="§ 4 Mitwirkungspflichten des Auftraggebers">
        <p>
          Der Auftraggeber stellt alle für die Durchführung erforderlichen Inhalte (Texte,
          Bilder, Logos, Zugangsdaten u. a.) rechtzeitig, vollständig und in geeigneter Form
          bereit. Er versichert, dass er an den überlassenen Inhalten über die erforderlichen
          Rechte verfügt, und stellt den Auftragnehmer insoweit von Ansprüchen Dritter frei.
        </p>
        <p>
          Verzögerungen, die auf einer unterlassenen oder verspäteten Mitwirkung beruhen, gehen
          nicht zulasten des Auftragnehmers und können vereinbarte Termine entsprechend verschieben.
        </p>
      </LegalSection>

      <LegalSection heading="§ 5 Preise und Zahlungsbedingungen">
        <p>
          Es gelten die im angenommenen Angebot ausgewiesenen Festpreise. Gemäß § 19 UStG
          (Kleinunternehmerregelung) wird keine Umsatzsteuer ausgewiesen.
        </p>
        <p>
          Sofern nicht anders vereinbart, ist bei Projektbeginn eine Anzahlung in Höhe von{" "}
          {depositPercent}&nbsp;% des Auftragswerts fällig; der Restbetrag wird mit Abnahme bzw.
          Fertigstellung in Rechnung gestellt. Rechnungen sind ohne Abzug innerhalb von 14 Tagen
          ab Rechnungsdatum zahlbar.
        </p>
        <p>
          Laufende Leistungen (z. B. Hosting, Wartung, Abonnements) werden im vereinbarten
          Abrechnungszeitraum im Voraus berechnet.
        </p>
      </LegalSection>

      <LegalSection heading="§ 6 Termine und Fristen">
        <p>
          Genannte Termine sind nur verbindlich, wenn sie ausdrücklich als verbindlich vereinbart
          wurden. Die Einhaltung von Terminen setzt die rechtzeitige Erfüllung der
          Mitwirkungspflichten des Auftraggebers voraus.
        </p>
      </LegalSection>

      <LegalSection heading="§ 7 Abnahme">
        <p>
          Nach Fertigstellung stellt der Auftragnehmer die Leistung zur Abnahme bereit. Der
          Auftraggeber prüft die Leistung und erklärt die Abnahme oder rügt wesentliche Mängel in
          Textform. Die Leistung gilt als abgenommen, wenn der Auftraggeber nicht innerhalb von
          14 Tagen nach Bereitstellung wesentliche Mängel anzeigt oder die Leistung in Gebrauch
          nimmt (z. B. Live-Schaltung).
        </p>
      </LegalSection>

      <LegalSection heading="§ 8 Nutzungsrechte">
        <p>
          Der Auftragnehmer räumt dem Auftraggeber die für den vereinbarten Zweck erforderlichen
          Nutzungsrechte an den erstellten Arbeitsergebnissen ein. Die Rechteübertragung steht
          unter der aufschiebenden Bedingung der vollständigen Bezahlung der vereinbarten Vergütung.
        </p>
        <p>
          An eingesetzten Drittkomponenten (z. B. Open-Source-Bibliotheken, Schriften, Stock-Material)
          gelten die jeweiligen Lizenzbedingungen der Dritten. Der Auftragnehmer ist berechtigt, das
          Projekt als Referenz zu nennen, sofern der Auftraggeber dem nicht in Textform widerspricht.
        </p>
      </LegalSection>

      <LegalSection heading="§ 9 Hosting, Wartung und laufende Leistungen">
        <p>
          Werden Hosting-, Wartungs- oder Abo-Leistungen vereinbart, richtet sich deren Umfang nach
          der jeweiligen Leistungsbeschreibung. Solche Dauerschuldverhältnisse können von beiden
          Seiten mit einer Frist von 30 Tagen zum Ende des jeweiligen Abrechnungszeitraums in
          Textform gekündigt werden, sofern nichts anderes vereinbart ist. Das Recht zur außer-
          ordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
        </p>
      </LegalSection>

      <LegalSection heading="§ 10 Gewährleistung">
        <p>
          Der Auftragnehmer gewährleistet die vertragsgemäße Erbringung der Leistung. Bei Mängeln
          hat der Auftraggeber zunächst Anspruch auf Nacherfüllung. Schlägt die Nacherfüllung
          fehl, kann der Auftraggeber die Vergütung mindern oder vom Vertrag zurücktreten.
        </p>
        <p>
          Keine Gewähr besteht für Mängel, die auf nachträglichen Änderungen durch den Auftraggeber
          oder Dritte, auf unsachgemäßer Nutzung oder auf Störungen außerhalb des Einflussbereichs
          des Auftragnehmers (z. B. Ausfälle von Drittanbietern) beruhen.
        </p>
      </LegalSection>

      <LegalSection heading="§ 11 Haftung">
        <p>
          Der Auftragnehmer haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des
          Körpers oder der Gesundheit sowie bei Vorsatz und grober Fahrlässigkeit. Bei einfacher
          Fahrlässigkeit haftet der Auftragnehmer nur für die Verletzung wesentlicher
          Vertragspflichten (Kardinalpflichten) und der Höhe nach begrenzt auf den vertrags-
          typischen, vorhersehbaren Schaden.
        </p>
        <p>
          Eine weitergehende Haftung ist ausgeschlossen. Die Haftung nach dem Produkthaftungsgesetz
          bleibt unberührt.
        </p>
      </LegalSection>

      <LegalSection heading="§ 12 Vertragslaufzeit und Kündigung">
        <p>
          Projektverträge enden mit vollständiger Erbringung und Abnahme der Leistung. Für
          Dauerschuldverhältnisse gilt § 9 dieser AGB. Kündigungen bedürfen mindestens der Textform.
        </p>
      </LegalSection>

      <LegalSection heading="§ 13 Schlussbestimmungen">
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ist
          der Auftraggeber Kaufmann, juristische Person des öffentlichen Rechts oder
          öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Auftragnehmers.
        </p>
        <p>
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
          Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
