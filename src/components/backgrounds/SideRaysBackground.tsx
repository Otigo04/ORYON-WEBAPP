"use client";

import dynamic from "next/dynamic";

/**
 * SSR-sicherer Wrapper für die WebGL-SideRays (ogl).
 *
 * Wird – wie BeamsBackground – nur im Browser geladen (`ssr: false`), damit die
 * umgebende Seite eine Server Component bleiben kann.
 */
const SideRays = dynamic(() => import("@/components/backgrounds/SideRays"), {
  ssr: false,
});

type Props = {
  className?: string;
};

export default function SideRaysBackground({ className = "" }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <SideRays
        speed={0.9}
        rayColor1="#00ff1a"
        rayColor2="#ffffff"
        intensity={0.95}
        spread={3}
        origin="top-right"
        tilt={0}
        saturation={8}
        blend={0.59}
        falloff={3}
        opacity={0.38}
      />
    </div>
  );
}
