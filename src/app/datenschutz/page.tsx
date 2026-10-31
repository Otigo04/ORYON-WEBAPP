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
 * Datenschutzerklärung. Beschreibt nur Verarbeitungen, die im Code dieser App
 * tatsächlich vorkommen. Alles, was sich aus dem Code nicht belegen lässt
 * (Speicherfristen, Produktiv-Einstellungen, Vertragsdetails), steht als
 * sichtbarer [PLATZHALTER]. Vor dem Livegang rechtlich prüfen lassen.
 */
export default function DatenschutzPage() {
  const { address } = siteConfig;

  return (
    <LegalShell
      title="Datenschutzerklärung"
      intro="Hier erfährst du, welche personenbezogenen Daten bei der Nutzung dieser Website verarbeitet werden und welche Rechte du hast."
      updated="Oktober 2026"
    >
      <LegalSection heading="1. Verantwortlicher">
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <p>
          <strong>{siteConfig.name}</strong>
          <br />
          Inhaber: {siteConfig.founder}
          <br />
          {address.street}, {address.postalCode} {address.city}
          <br />
          Telefon: {siteConfig.telephone}
          <br />
          E-Mail: {siteConfig.email}
        </p>
      </LegalSection>

      <LegalSection heading="2. Rechtsgrundlagen">
        <p>
          Ich verarbeite personenbezogene Daten nur, wenn dafür eine Rechtsgrundlage besteht:
          deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Durchführung vorvertraglicher
          Maßnahmen oder eines Vertrags (lit. b), eine rechtliche Pflicht (lit. c) oder mein
          berechtigtes Interesse an einem sicheren und funktionierenden Betrieb der Website
          (lit. f).
        </p>
      </LegalSection>

      <LegalSection heading="3. Hosting (Vercel)">
        <p>
          Diese Website wird bei Vercel gehostet. Beim Aufruf verarbeitet der Hosting-Anbieter
          die technisch notwendigen Verbindungsdaten, zum Beispiel IP-Adresse, Datum und Uhrzeit,
          aufgerufene Seite und Browser-Informationen, um die Seite auszuliefern und den Betrieb
          abzusichern (Art. 6 Abs. 1 lit. f DSGVO). Die Server-Region liegt in der EU. Mit dem
          Anbieter besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO).
        </p>
        <p>
          [PLATZHALTER: Vertragspartner und Anschrift laut AVV; Speicherdauer der Logfiles;
          Hinweis zu einer möglichen Datenübermittlung in Drittländer, da Vercel ein US-Unternehmen
          ist – rechtliche Prüfung ausstehend]
        </p>
      </LegalSection>

      <LegalSection heading="4. Cookies und lokaler Speicher">
        <p>
          Diese Website setzt keine Tracking- oder Marketing-Cookies und bindet keine
          Analyse-Dienste ein. Im Code vorhanden sind nur technisch notwendige Speicherzugriffe:
        </p>
        <ul className="ml-5 flex list-disc flex-col gap-1.5">
          <li>
            Session-Cookies für die Anmeldung, die nur gesetzt werden, wenn sich jemand anmeldet.
          </li>
          <li>
            Ein lokaler Entwurf im Browser (Local Storage), damit deine Angaben im Konfigurator
            nicht verloren gehen. Er bleibt auf deinem Gerät, bis du ihn löschst.
          </li>
        </ul>
        <p>
          Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG. Die Schriften werden von der eigenen
          Website ausgeliefert, nicht von einem externen Server.
        </p>
      </LegalSection>

      <LegalSection heading="5. Preisrechner und Konfigurator">
        <p>
          Die Preisberechnung läuft in deinem Browser. Dabei werden keine Angaben an mich
          übertragen. Das Absenden einer Anfrage über den Konfigurator ist derzeit abgeschaltet;
          Anfragen laufen per E-Mail ({siteConfig.email}).
        </p>
        <p>
          Sobald das Absenden aktiv ist, werden die von dir eingegebenen Daten (Name, E-Mail,
          optional Telefon und Firma sowie deine Projektangaben und der berechnete Richtwert)
          gespeichert, um deine Anfrage zu bearbeiten (Art. 6 Abs. 1 lit. b DSGVO).
        </p>
        <p>[PLATZHALTER: Löschfristen für Anfragen, die nicht zu einem Auftrag führen]</p>
      </LegalSection>

      <LegalSection heading="6. Kontaktaufnahme per E-Mail oder Telefon">
        <p>
          Wenn du mich kontaktierst, verarbeite ich deine Angaben, um dein Anliegen zu
          beantworten (Art. 6 Abs. 1 lit. b oder f DSGVO). Ich lösche sie, sobald der Zweck
          entfällt und keine gesetzliche Aufbewahrungspflicht besteht.
        </p>
      </LegalSection>

      <LegalSection heading="7. Anmeldung und Datenbank (Supabase)">
        <p>
          Für die Anmeldung und die Speicherung von Anfragen und Projektdaten nutze ich Supabase.
          Verarbeitet werden dabei Anmeldedaten (E-Mail-Adresse, Passwort in verschlüsselter Form,
          Session-Informationen) und die dir zugeordneten Daten. Der Zugriff ist durch
          Row-Level-Security auf die jeweils eigenen Datensätze beschränkt. Die Daten liegen in
          der EU. Mit dem Anbieter besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO).
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p>
          Das Kundenportal ist zurzeit nicht öffentlich; eine Registrierung ist nicht möglich.
        </p>
        <p>[PLATZHALTER: Vertragspartner und Anschrift laut AVV]</p>
      </LegalSection>

      <LegalSection heading="8. Zahlungsabwicklung (Stripe)">
        <p>
          Für künftige Online-Zahlungen ist Stripe technisch vorbereitet. Im Code ist die
          Zahlungsfunktion standardmäßig ausgeschaltet und wird nur über eine Einstellung
          aktiviert. Wird sie genutzt, verarbeitet Stripe die für die Zahlung nötigen Daten
          (zum Beispiel Zahlungsmittel, Betrag, Zahlungsreferenz, Kontaktdaten) als eigenständiger
          Dienstleister, um die Zahlung durchzuführen (Art. 6 Abs. 1 lit. b DSGVO).
        </p>
        <p>
          [PLATZHALTER: rechtliche Prüfung ausstehend – ob Online-Zahlung zum Livegang aktiv ist,
          Vertragspartner und Rolle von Stripe (Auftragsverarbeiter oder eigener Verantwortlicher),
          Datenübermittlung in Drittländer, Verweis auf die Datenschutzerklärung von Stripe]
        </p>
      </LegalSection>

      <LegalSection heading="9. E-Mail-Versand (Resend)">
        <p>
          Für Benachrichtigungen über neue Anfragen ist der E-Mail-Dienst Resend im Code
          vorgesehen. Er versendet nur, wenn ein Zugangsschlüssel hinterlegt ist, und ist
          andernfalls ausgeschaltet. Würde er genutzt, würden die Inhalte einer Anfrage (Name,
          E-Mail-Adresse, Telefon, Firma, Nachricht, Projektangaben) über Resend an mich
          zugestellt (Art. 6 Abs. 1 lit. b und f DSGVO).
        </p>
        <p>
          [PLATZHALTER: rechtliche Prüfung ausstehend – ob der Dienst zum Livegang aktiv ist,
          Vertragspartner, Serverstandort, Auftragsverarbeitungsvertrag, Datenübermittlung in
          Drittländer]
        </p>
      </LegalSection>

      <LegalSection heading="10. Speicherdauer">
        <p>
          Ich speichere personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck nötig
          ist oder gesetzliche Aufbewahrungsfristen es verlangen.
        </p>
        <p>[PLATZHALTER: konkrete Fristen, z. B. für Anfragen, Rechnungen und Kundenkonten]</p>
      </LegalSection>

      <LegalSection heading="11. Deine Rechte">
        <p>Du hast nach der DSGVO folgende Rechte:</p>
        <ul className="ml-5 flex list-disc flex-col gap-1.5">
          <li>Auskunft über deine gespeicherten Daten (Art. 15)</li>
          <li>Berichtigung falscher Daten (Art. 16)</li>
          <li>Löschung (Art. 17)</li>
          <li>Einschränkung der Verarbeitung (Art. 18)</li>
          <li>Datenübertragbarkeit (Art. 20)</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21)</li>
          <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3)</li>
        </ul>
        <p>
          Dafür genügt eine formlose Nachricht an {siteConfig.email}.
        </p>
      </LegalSection>

      <LegalSection heading="12. Beschwerde bei einer Aufsichtsbehörde">
        <p>
          Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).
          Zuständig ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit,
          Alt-Moabit 59–61, 10555 Berlin.
        </p>
      </LegalSection>

      <LegalSection heading="13. Änderungen">
        <p>
          Ich passe diese Erklärung an, wenn sich die Datenverarbeitung ändert. Es gilt die jeweils
          hier veröffentlichte Fassung.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
