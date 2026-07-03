"use client";

import dynamic from "next/dynamic";

/**
 * Client-Wrapper für die WebGL-LightPillar (three.js). Wird per `next/dynamic`
 * mit `ssr: false` nur im Browser geladen, damit die umgebende Seite eine
 * Server Component bleiben kann (SSR-/SEO-freundlich).
 */
const LightPillar = dynamic(() => import("@/components/backgrounds/LightPillar"), {
  ssr: false,
});

type Props = {
  className?: string;
};

export default function LightPillarBackground({ className = "" }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <LightPillar
        topColor="#22d3ee"
        bottomColor="#09ed2d"
        intensity={0.22}
        rotationSpeed={0.3}
        glowAmount={0.003}
        pillarWidth={3.0}
        pillarHeight={0.7}
        noiseIntensity={1.2}
        pillarRotation={113}
        interactive={false}
        mixBlendMode="screen"
      />
    </div>
  );
}
