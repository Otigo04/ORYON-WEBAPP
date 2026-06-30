import type { Metadata } from "next";
import FloatingLinesBackground from "@/components/backgrounds/FloatingLinesBackground";
import { Configurator } from "@/components/konfigurator/Configurator";

export const metadata: Metadata = {
  title: "Projekt konfigurieren, TAS Webworks",
  description:
    "Konfiguriere dein Webprojekt im Detail, Schritt für Schritt. Deine Angaben werden automatisch gespeichert.",
  robots: { index: false, follow: false },
};

/**
 * Detaillierter Projekt-Konfigurator. Server Component als schlanke Hülle.
 *
 * Der animierte WebGL-Hintergrund (FloatingLines, grüne „Rohre") läuft bewusst
 * OHNE `mix-blend-mode: screen`: Auf schwarzem Grund ist screen optisch identisch
 * mit normal (screen(x,0)=x), erspart aber das teure Verrechnen mit dem gesamten
 * Seiten-Backdrop jeden Frame – das war die eigentliche FPS-Bremse.
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
