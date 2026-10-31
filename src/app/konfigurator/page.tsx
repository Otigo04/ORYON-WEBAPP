import type { Metadata } from "next";
import { Configurator } from "@/components/konfigurator/Configurator";

export const metadata: Metadata = {
  title: "Projekt konfigurieren – TAS Webworks",
  description:
    "Konfiguriere dein Webprojekt im Detail – Schritt für Schritt.",
  robots: { index: false, follow: false },
};

/**
 * Detaillierter Projekt-Konfigurator. Server Component als schlanke Hülle um den
 * eigentlichen Wizard (Client), im Stil der Startseite (schwarz, flach). Übernommene Werte aus dem Preisrechner werden clientseitig
 * aus dem gespeicherten Entwurf gelesen.
 */
export default function KonfiguratorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Configurator />
    </main>
  );
}
