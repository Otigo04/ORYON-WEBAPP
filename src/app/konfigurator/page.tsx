import type { Metadata } from "next";
import FloatingLinesBackground from "@/components/backgrounds/FloatingLinesBackground";
import { Configurator } from "@/components/konfigurator/Configurator";

export const metadata: Metadata = {
  title: "Projekt konfigurieren – TAS Webworks",
  description:
    "Konfiguriere dein Webprojekt im Detail – Schritt für Schritt. Deine Angaben werden automatisch gespeichert.",
  robots: { index: false, follow: false },
};

/**
 * Detaillierter Projekt-Konfigurator. Server Component als schlanke Hülle:
 * lädt den FloatingLines-Hintergrund (Client, WebGL) und den eigentlichen
 * Wizard (Client). Übernommene Werte aus dem Preisrechner werden clientseitig
 * aus dem gespeicherten Entwurf gelesen.
 */
export default function KonfiguratorPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <FloatingLinesBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/45 to-black/70" />
      <Configurator />
    </main>
  );
}
