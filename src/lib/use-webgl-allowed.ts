"use client";

import { useEffect, useState } from "react";

type NetworkInformation = { saveData?: boolean };

/**
 * Entscheidet, ob ein dekorativer WebGL-Hintergrund geladen werden darf.
 *
 * three.js / ogl kosten auf dem Handy viel Download- und Hauptthread-Zeit (TBT)
 * und bringen dort kaum Nutzen. Daher nur auf großen Bildschirmen, ohne
 * "reduzierte Bewegung" und ohne Datensparmodus – und erst, wenn der Browser
 * im Leerlauf ist, damit der erste Inhalt (LCP) nicht blockiert wird.
 * Auf dem Server und beim ersten Render ist der Wert `false`.
 */
export function useWebglAllowed(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const connection = (navigator as Navigator & { connection?: NetworkInformation })
      .connection;
    if (!query.matches || connection?.saveData) return;

    const enable = () => setAllowed(true);
    // Safari kennt requestIdleCallback nicht → Fallback per Timeout.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(enable, 1500);
    return () => clearTimeout(id);
  }, []);

  return allowed;
}
