import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal/LegalShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung von ${siteConfig.name} – Informationen zur Verarbeitung personenbezogener Daten nach DSGVO.`,
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

/**
 * Datenschutzerklärung – DSGVO-konformes Dummy. Deckt die in dieser App real
 * eingesetzten Verarbeitungen ab (Vercel-Hosting, Server-Logs, Supabase als
 * Auftragsverarbeiter für Auth & Leads, Kontakt-/Preisrechner-Formular). Die
 * Verantwortlichen-Angaben sind Platzhalter aus `siteConfig`.
 */
export default function DatenschutzPage() {
  const { address } = siteConfig;

  return (
    <LegalShell
      title="Datenschutzerklärung"
      intro="Der Schutz deiner personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir dich gemäß DSGVO über Art, Umfang und Zweck der Verarbeitung."
      updated="Juni 2026"
    >
      <LegalSection heading="1. Verantwortlicher">
        <p>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p>
          <strong>{siteConfig.name}</strong>
          <br />
          {siteConfig.founder}
          <br />
          {address.street}, {address.postalCode} {address.city}
          <br />
          E-Mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <br />
          Telefon: {siteConfig.telephone}
        </p>
        <p className="text-xs text-white/40">
          Hinweis: Platzhalter-Angaben – vor Veröffentlichung durch echte Daten
          ersetzen. Bei Verarbeitungen, die eine Pflicht zur Bestellung eines
          Datenschutzbeauftragten auslösen, sind dessen Kontaktdaten zu ergänzen.
        </p>
      </LegalSection>

      <LegalSection heading="2. Allgemeines zur Datenverarbeitung">
        <p>
          Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur,
          soweit dies zur Bereitstellung einer funktionsfähigen Website sowie
          unserer Inhalte und Leistungen erforderlich ist. Rechtsgrundlagen sind
          insbesondere Art. 6 Abs. 1 lit. a (Einwilligung), lit. b
          (Vertragserfüllung / vorvertragliche Maßnahmen) und lit. f (berechtigtes
          Interesse) DSGVO.
        </p>
      </LegalSection>

      <LegalSection heading="3. Hosting (Vercel)">
        <p>
          Diese Website wird bei der Vercel Inc. (340 S Lemon Ave #4133, Walnut,
          CA 91789, USA) gehostet. Vercel verarbeitet in unserem Auftrag Daten,
          die technisch zur Auslieferung der Website nötig sind. Rechtsgrundlage
          ist unser berechtigtes Interesse an einer sicheren und effizienten
          Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO). Mit dem Anbieter besteht
          ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO). Eine etwaige
          Datenübermittlung in die USA erfolgt auf Grundlage geeigneter Garantien
          (EU-Standardvertragsklauseln / Data Privacy Framework).
        </p>
      </LegalSection>

      <LegalSection heading="4. Server-Logfiles">
        <p>
          Bei jedem Aufruf werden automatisch Informationen vom Browser deines
          Endgeräts übermittelt und temporär in sogenannten Logfiles gespeichert:
          IP-Adresse (gekürzt/anonymisiert), Datum und Uhrzeit des Zugriffs,
          aufgerufene Seite, Referrer-URL, verwendeter Browser und Betriebssystem.
          Die Verarbeitung erfolgt zur Gewährleistung von Betrieb und Sicherheit
          (Art. 6 Abs. 1 lit. f DSGVO). Die Logs werden nach kurzer Zeit gelöscht.
        </p>
      </LegalSection>

      <LegalSection heading="5. Cookies">
        <p>
          Wir setzen technisch notwendige Cookies ein, die für den Betrieb und
          sichere Anmeldevorgänge erforderlich sind (z. B. Session-/Auth-Cookies).
          Diese sind nach § 25 Abs. 2 TTDSG einwilligungsfrei. Marketing- oder
          Tracking-Cookies, die eine Einwilligung erfordern würden, setzen wir
          derzeit nicht ein. Du kannst Cookies in deinen Browser-Einstellungen
          verwalten und löschen.
        </p>
      </LegalSection>

      <LegalSection heading="6. Kontaktaufnahme & Preisrechner-Anfragen">
        <p>
          Wenn du uns über den Preisrechner oder per E-Mail kontaktierst, werden
          die von dir angegebenen Daten (z. B. Name, E-Mail-Adresse, Telefon,
          Firma, Nachricht sowie deine Projektauswahl und der berechnete
          Richtpreis) zur Bearbeitung deiner Anfrage und für etwaige
          Anschlussfragen verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
          DSGVO (vorvertragliche Maßnahmen) bzw. lit. f DSGVO. Die Daten werden
          gelöscht, sobald sie für die Zweckerreichung nicht mehr erforderlich
          sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </LegalSection>

      <LegalSection heading="7. Kundenkonto & Authentifizierung (Supabase)">
        <p>
          Für Registrierung, Login und das Kundenportal nutzen wir Supabase
          (Supabase Inc., 970 Toa Payoh North, Singapur, mit Infrastruktur in der
          EU). Dabei werden Konto- und Anmeldedaten (E-Mail-Adresse, verschlüsselt
          gespeichertes Passwort, Session-Informationen) sowie die dir
          zugeordneten Anfragen verarbeitet. Der Zugriff auf deine Daten ist durch
          Row-Level-Security abgesichert – du siehst ausschließlich deine eigenen
          Datensätze. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Mit Supabase
          besteht ein Auftragsverarbeitungsvertrag.
        </p>
      </LegalSection>

      <LegalSection heading="8. Empfänger & Auftragsverarbeiter">
        <p>
          Eine Weitergabe deiner Daten an Dritte erfolgt nur, wenn dies gesetzlich
          erlaubt ist oder du eingewilligt hast. Eingesetzte Auftragsverarbeiter
          (Art. 28 DSGVO) sind insbesondere unsere Hosting- und
          Infrastruktur-Dienstleister (Vercel, Supabase).
        </p>
      </LegalSection>

      <LegalSection heading="9. Speicherdauer">
        <p>
          Wir verarbeiten und speichern personenbezogene Daten nur so lange, wie
          es für die Erreichung des jeweiligen Zwecks erforderlich ist oder
          gesetzliche Aufbewahrungsfristen (z. B. handels- und steuerrechtlich)
          dies vorsehen. Danach werden die Daten routinemäßig gelöscht.
        </p>
      </LegalSection>

      <LegalSection heading="10. Deine Rechte als betroffene Person">
        <p>Dir stehen nach der DSGVO insbesondere folgende Rechte zu:</p>
        <ul className="ml-5 flex list-disc flex-col gap-1.5">
          <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung („Recht auf Vergessenwerden", Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung deiner Rechte genügt eine formlose Nachricht an{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </LegalSection>

      <LegalSection heading="11. Beschwerderecht bei der Aufsichtsbehörde">
        <p>
          Unbeschadet anderweitiger Rechtsbehelfe hast du das Recht, dich bei
          einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für
          uns zuständig ist die Berliner Beauftragte für Datenschutz und
          Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin.
        </p>
      </LegalSection>

      <LegalSection heading="12. Aktualität dieser Datenschutzerklärung">
        <p>
          Wir passen diese Datenschutzerklärung an, sobald Änderungen unserer
          Datenverarbeitung dies erforderlich machen. Es gilt jeweils die hier
          veröffentlichte aktuelle Fassung.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
