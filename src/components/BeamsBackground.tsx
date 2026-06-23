"use client";

import dynamic from "next/dynamic";

/**
 * Wiederverwendbarer Client-Wrapper für die WebGL-Beams.
 *
 * Three.js / @react-three/fiber benötigen das `window`-Objekt und dürfen daher
 * nicht serverseitig gerendert werden. Über `next/dynamic` mit `ssr: false`
 * wird die Komponente erst im Browser geladen – die umgebenden Sektionen
 * bleiben Server Components (SSR-/SEO-freundlich).
 */
const Beams = dynamic(() => import("@/components/Beams/Beams"), {
  ssr: false,
});

type BeamsBackgroundProps = {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
  /** Zusätzliche Klassen für den absolut positionierten Container. */
  className?: string;
};

export default function BeamsBackground({
  beamWidth = 2.2,
  beamHeight = 15,
  beamNumber = 27,
  lightColor = "#09ed2d",
  speed = 2.9,
  noiseIntensity = 1.2,
  scale = 0.25,
  rotation = 22,
  className = "",
}: BeamsBackgroundProps) {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <Beams
        beamWidth={beamWidth}
        beamHeight={beamHeight}
        beamNumber={beamNumber}
        lightColor={lightColor}
        speed={speed}
        noiseIntensity={noiseIntensity}
        scale={scale}
        rotation={rotation}
      />
    </div>
  );
}
