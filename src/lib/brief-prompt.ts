import { BRIEF_STEPS, displayValue } from "@/lib/brief";
import type { BriefValue } from "@/lib/brief";
import type { Brief } from "@/lib/briefs";
import { formatEuro } from "@/lib/pricing";

/**
 * Wandelt eine Kunden-Konfiguration (Brief) in einen vollständigen,
 * gut strukturierten Text-Prompt um, fertig zum Kopieren oder als Datei,
 * den man direkt Claude geben kann, um an der Vision des Kunden zu arbeiten.
 *
 * Bewusst client-sicher (kein Server-Import), damit der Prompt sowohl
 * serverseitig vorberechnet als auch im Browser erzeugt werden kann.
 */
function isAnswered(value: BriefValue | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

// --- Automatische Konflikt- & Lücken-Erkennung -------------------------
// Leitet aus den Angaben mögliche Widersprüche (z. B. Shop-Wunsch ohne
// Shop-Funktion), Lücken (genannt, aber nicht angehakt) und Hinweise (fehlende
// Infos für die Umsetzung) ab. Bewusst deterministisch & keyword-basiert; kann
// Fehltreffer haben, deshalb im Output als „bitte bestätigen" gekennzeichnet.

type BriefIssueKind = "Konflikt" | "Lücke" | "Hinweis";
type BriefIssue = { kind: BriefIssueKind; text: string };

const FREE_TEXT_FIELDS = [
  "businessDescription",
  "usp",
  "projectVision",
  "featureNotes",
  "notes",
  "materials",
  "slogan",
  "targetAudience",
  "references",
  "dislikes",
  "competitors",
  "styleOther",
];

function asArray(value: BriefValue | undefined): string[] {
  if (Array.isArray(value)) return value;
  return typeof value === "string" && value.trim() ? [value] : [];
}

function firstMatch(haystack: string, needles: string[]): string | null {
  for (const n of needles) if (haystack.includes(n)) return n;
  return null;
}

export function detectBriefIssues(brief: Brief): BriefIssue[] {
  const data = brief.data ?? {};
  const issues: BriefIssue[] = [];

  const freeText = FREE_TEXT_FIELDS.map((f) =>
    typeof data[f] === "string" ? (data[f] as string) : "",
  )
    .join("\n")
    .toLowerCase();

  const features = asArray(data.features);
  const pages = asArray(data.pages);
  const integrations = asArray(data.integrations);

  // Konflikt: Shop/Verkauf/Abo im Freitext, aber Konfigurator hat keine
  // Shop-Funktion → unbaubar aus der Auswahl, Umfang/Preis/Zeit betroffen.
  const shopHit = firstMatch(freeText, [
    "onlineshop",
    "online-shop",
    "online shop",
    "e-commerce",
    "ecommerce",
    "warenkorb",
    "checkout",
    "bestellung",
    "bestellen",
    "verkauf",
    "abonnent",
    "abonnement",
    "subscription",
  ]);
  if (shopHit) {
    issues.push({
      kind: "Konflikt",
      text:
        `Freitext deutet auf Shop/Verkauf/Abo hin (Stichwort „${shopHit}“), aber ` +
        `der Konfigurator bietet keine Shop-Funktion. Vor Start klären, ob ein ` +
        `Shop gewünscht ist — ändert Umfang, Preis und Zeitrahmen deutlich.`,
    });
  }

  // Konflikt: Buchhaltungs-Anbindung genannt, keine passende Integration.
  const acctHit = firstMatch(freeText, ["buchhaltung", "lexoffice", "sevdesk", "datev"]);
  if (acctHit) {
    issues.push({
      kind: "Konflikt",
      text:
        `Freitext nennt Buchhaltungs-Anbindung („${acctHit}“) — dafür ist keine ` +
        `Integration konfiguriert (max. „CRM-Anbindung“). Als Zusatzmodul klären.`,
    });
  }

  // Lücke: interaktives Tool (Quiz/Finder) genannt, nicht als Funktion gewählt.
  const quizHit = firstMatch(freeText, ["quiz", "fragebogen", "finder", "berater"]);
  if (quizHit) {
    issues.push({
      kind: "Lücke",
      text:
        `Freitext deutet auf ein interaktives Tool hin („${quizHit}“) — nicht in ` +
        `den Funktionen angehakt. Aufwand separat einplanen/klären.`,
    });
  }

  // Lücke: DSGVO/Cookie-Banner gewünscht — keine Konfigurator-Funktion.
  const dsgvoHit = firstMatch(freeText, ["cookie", "dsgvo", "consent"]);
  if (dsgvoHit) {
    issues.push({
      kind: "Lücke",
      text:
        `DSGVO/Cookie-Banner ausdrücklich erwähnt („${dsgvoHit}“) — Consent-Banner ` +
        `fest einplanen (steht nicht im Funktionskatalog).`,
    });
  }

  // Lücke: Kontakt-Seite, aber kein Kontaktformular angehakt.
  if (pages.includes("Kontakt") && !features.includes("Kontaktformular")) {
    issues.push({
      kind: "Lücke",
      text:
        `Kontakt-Seite gewählt, aber „Kontaktformular“ nicht als Funktion ` +
        `angehakt — Formular wahrscheinlich gewünscht, klären.`,
    });
  }

  // Hinweis: Performance ausdrücklich erfolgskritisch.
  const perfHit = firstMatch(freeText, ["core web vitals", "ladezeit", "pagespeed", "performance"]);
  if (perfHit) {
    issues.push({
      kind: "Hinweis",
      text:
        `Performance ausdrücklich wichtig („${perfHit}“) — Bilder optimieren, ` +
        `Lazy-Loading, Lighthouse-Check vor Abnahme.`,
    });
  }

  // Hinweis: Mehrsprachigkeit ohne genannte Sprachen.
  if (features.includes("Mehrsprachigkeit") && !asArray(data.languages).length) {
    issues.push({
      kind: "Hinweis",
      text: `„Mehrsprachigkeit“ gewählt, aber keine Sprachen genannt — welche?`,
    });
  }

  // Hinweis: Newsletter braucht Tool + Zugang.
  if (features.includes("Newsletter-Anmeldung")) {
    issues.push({
      kind: "Hinweis",
      text: `Newsletter gewählt — Tool (Mailchimp/Brevo) + Double-Opt-in-Zugang klären.`,
    });
  }

  // Hinweis: Bewertungen — Quelle offen.
  if (features.includes("Bewertungen")) {
    issues.push({
      kind: "Hinweis",
      text: `Bewertungen gewählt — Quelle klären: manuell gepflegt oder Google (Place-ID/API)?`,
    });
  }

  // Hinweis: Google Maps braucht API-Key + Adresse.
  if (integrations.includes("Google Maps")) {
    issues.push({
      kind: "Hinweis",
      text: `Google Maps gewählt — API-Key + genaue Standort-Adresse nötig.`,
    });
  }

  // Hinweis: Materialien vorhanden → zuerst Asset-Ordner anlegen.
  const hasAssets =
    data.logoStatus === "Ja, vorhanden" ||
    (typeof data.materials === "string" && data.materials.trim().length > 0);
  if (hasAssets) {
    issues.push({
      kind: "Hinweis",
      text:
        `Materialien lt. Briefing vorhanden (Logo/Fotos/Texte) — vor dem Bauen ` +
        `Asset-Ordner anlegen und befüllen lassen (siehe Arbeitsanweisung 2).`,
    });
  }

  const order: Record<BriefIssueKind, number> = { Konflikt: 0, Lücke: 1, Hinweis: 2 };
  issues.sort((a, b) => order[a.kind] - order[b.kind]);
  return issues;
}

export function buildBriefPrompt(brief: Brief): string {
  const lines: string[] = [];
  const title = brief.company || brief.name;

  lines.push(`# Projekt-Briefing: ${title}`);
  lines.push("");
  lines.push(
    "Du bist Web-Designer und Entwickler bei TAS Webworks. Unten steht die " +
      "vollständige Konfiguration, die der Kunde über unseren Projekt-Konfigurator " +
      "eingegeben hat. Arbeite auf dieser Basis an der Vision des Kunden: Schlage " +
      "Struktur, Inhalte und Umsetzung der Website vor und setze sie um.",
  );
  lines.push("");

  // --- Stehende Arbeitsanweisungen (gelten für jedes Projekt) ---
  lines.push("## Arbeitsanweisungen (immer beachten)");
  lines.push(
    "1. **Projektverzeichnis = Repo.** Das aktuelle Arbeitsverzeichnis ist das " +
      "neue, eigenständige Projekt-Repo dieses Kunden. Nicht nach einem Pfad fragen.",
  );
  lines.push(
    "2. **Assets zuerst.** Wenn das Briefing sagt, dass Materialien bereits " +
      "vorhanden sind (Logo, Fotos, Texte), lege ZUERST die passenden " +
      "Verzeichnisse an (z. B. `public/assets/logo`, `public/assets/produkte`), " +
      "sage kurz welche Datei wohin gehört, und pausiere, bis die Dateien " +
      "eingelegt sind. Erst danach weiterbauen. Niemals auf Platzhalter-Pfade bauen.",
  );
  lines.push(
    "3. **Widersprüche prüfen.** Vergleiche Preisrechner-Auswahl, gewünschte " +
      "Funktionen und die Freitext-Wünsche. Bei Konflikten (z. B. \"Kein Shop\" " +
      "vs. \"Onlineshop\"-Wunsch, oder Budget/Zeit passt nicht zum Umfang) NICHT " +
      "raten — zuerst auflisten und klären lassen.",
  );
  lines.push(
    "4. **Lücken erkennen.** Prüfe, ob aus den Freitexten Funktionen oder Seiten " +
      "hervorgehen, die nicht angehakt wurden (z. B. Cookie-Banner, Quiz, " +
      "Integrationen). Schlage fehlende Punkte aktiv vor.",
  );
  lines.push(
    "5. **TAS-Webworks-Footer (Pflicht).** Auf JEDER Seite ganz unten dezent: " +
      "`Realisiert von TAS Webworks · tas-webworks.de`, klein und gedämpft " +
      "(niedrige Opacity, passend zum Theme), Domain verlinkt auf " +
      "https://tas-webworks.de (target=\"_blank\", rel=\"noopener\"). " +
      "Global in einer Footer-Komponente, damit es auf allen Seiten erscheint.",
  );
  lines.push(
    "6. **Fehlende Infos erfragen.** Bevor du baust, hole konkret fehlende " +
      "Inhalte ein (echte Texte, Farb-Hex, Schrift, Produkt-/Leistungsliste, " +
      "Kontaktdaten/Adresse, Social-Links). Lieber einmal gezielt fragen als " +
      "annehmen.",
  );
  lines.push("");

  // --- Automatisch erkannte Konflikte & Lücken ---
  const issues = detectBriefIssues(brief);
  if (issues.length > 0) {
    lines.push("## Automatisch erkannt: Konflikte & Lücken");
    lines.push(
      "_Aus den Angaben heuristisch abgeleitet — vor der Umsetzung mit Kunde/Team " +
        "bestätigen, kann Fehltreffer enthalten._",
    );
    for (const issue of issues) {
      lines.push(`- **${issue.kind}:** ${issue.text}`);
    }
    lines.push("");
  }

  // --- Kontakt & Eckdaten ---
  lines.push("## Kontakt & Eckdaten");
  lines.push(`- **Name:** ${brief.name}`);
  lines.push(`- **E-Mail:** ${brief.email}`);
  if (brief.phone) lines.push(`- **Telefon:** ${brief.phone}`);
  if (brief.company) lines.push(`- **Firma:** ${brief.company}`);
  if (typeof brief.price_min === "number" && typeof brief.price_max === "number") {
    lines.push(
      `- **Kalkulierte Preisspanne:** ${formatEuro(brief.price_min)} bis ${formatEuro(brief.price_max)}`,
    );
  }
  lines.push("");

  // --- Preisrechner-Zusammenfassung (falls vorhanden) ---
  const summary = brief.data?._summary;
  if (summary && (summary.projectType || summary.features?.length)) {
    lines.push("## Preisrechner-Auswahl");
    if (summary.projectType) lines.push(`- **Projektart:** ${summary.projectType}`);
    if (summary.design) lines.push(`- **Design:** ${summary.design}`);
    if (summary.features?.length) lines.push(`- **Features:** ${summary.features.join(", ")}`);
    if (typeof summary.extraLanguages === "number" && summary.extraLanguages > 0) {
      lines.push(`- **Zusatzsprachen:** ${summary.extraLanguages}`);
    }
    if (typeof summary.maintenance === "boolean") {
      lines.push(`- **Wartung:** ${summary.maintenance ? "Ja" : "Nein"}`);
    }
    lines.push("");
  }

  // --- Alle Konfigurator-Schritte ---
  for (const step of BRIEF_STEPS) {
    const answered = step.fields.filter((f) => isAnswered(brief.data?.[f.name]));
    if (answered.length === 0) continue;

    lines.push(`## ${step.title}`);
    for (const field of answered) {
      const value = brief.data[field.name];
      lines.push(`- **${field.label}:** ${displayValue(value)}`);

      // Erläuterungen zu ausgewählten Optionen (geben Claude Kontext, was die
      // jeweilige Auswahl konkret bedeutet).
      if (field.optionDetails) {
        const selected = Array.isArray(value) ? value : [value];
        for (const sel of selected) {
          const detail = field.optionDetails[sel];
          if (detail) lines.push(`  - _${sel}:_ ${detail}`);
        }
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}
