import {
  BOOKING_PRICE,
  ENTRY_PRICE,
  PORTFOLIO_PRICE,
  PRICING,
  WEBAPP_PRICE,
  WEBSITE_PRICE,
  formatEuro,
} from "@/lib/pricing";

/**
 * Häufige Fragen – sichtbar auf der Landingpage UND als FAQ-JSON-LD (Rich
 * Results). Alle Preise kommen aus `pricing.config.ts` (über `@/lib/pricing`),
 * damit Text und Preisrechner nie auseinanderlaufen.
 */
const hostingPrices = Object.values(PRICING.hosting.byProjectType);
const hostingFrom = Math.min(...hostingPrices.map(([min]) => min));
const maintenanceFrom = Math.min(
  ...Object.values(PRICING.maintenance.byProjectType).map(([min]) => min),
);

export const faqs = [
  {
    question: "Was kostet eine Website?",
    answer: `Das hängt von Umfang und Ausstattung ab. Richtwerte: One-Pager ab ${formatEuro(ENTRY_PRICE)}, mehrseitige Website ab ${formatEuro(WEBSITE_PRICE)}, Portfolio-Seite ab ${formatEuro(PORTFOLIO_PRICE)}, Buchungsseite ab ${formatEuro(BOOKING_PRICE)}, individuelle Web-App ab ${formatEuro(WEBAPP_PRICE)}. ${PRICING.vatNote} Im Preisrechner siehst du in einer Minute, wo du ungefähr liegst – unverbindlich.`,
  },
  {
    question: "Bekomme ich einen verbindlichen Festpreis?",
    answer:
      "Ja. Der Preisrechner liefert einen Richtwert. Nach deiner Anfrage bespreche ich das Projekt mit dir und du erhältst ein schriftliches Angebot zum Festpreis – ohne versteckte Stundensätze.",
  },
  {
    question: "Welche laufenden Kosten gibt es?",
    answer: `Für den Betrieb deiner Seite fällt eine monatliche Hosting-Pauschale an, je nach Projektart ab ${formatEuro(hostingFrom)} pro Monat. Wartung und Pflege (Updates, Backups, kleine Anpassungen) ist optional und beginnt ab ${formatEuro(maintenanceFrom)} pro Monat. ${PRICING.vatNote}`,
  },
  {
    question: "Wo sitzt TAS Webworks?",
    answer:
      "In Berlin. Ich arbeite für Kundinnen und Kunden in ganz Deutschland, per Telefon und Videocall.",
  },
  {
    question: "Ist Suchmaschinenoptimierung (SEO) dabei?",
    answer:
      "Die technische Grundlage ist bei jeder Seite dabei: saubere Seitenstruktur, Titel und Beschreibungen, Mobilansicht und strukturierte Daten. Eine bestimmte Platzierung bei Google kann allerdings niemand garantieren.",
  },
  {
    question: "Wie lange dauert die Umsetzung?",
    answer:
      "Das hängt vom Umfang ab. Einen realistischen Zeitrahmen nenne ich dir im Erstgespräch, bevor du dich entscheidest.",
  },
] as const;
