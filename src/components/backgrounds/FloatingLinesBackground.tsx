"use client";

import dynamic from "next/dynamic";

/**
 * SSR-sicherer Wrapper für die WebGL-FloatingLines (three.js).
 *
 * three.js braucht `window` und darf nicht serverseitig gerendert werden –
 * daher Laden über `next/dynamic` mit `ssr: false`. Die umgebende Seite bleibt
 * eine Server Component.
 */
const FloatingLines = dynamic(() => import("@/components/backgrounds/FloatingLines"), {
  ssr: false,
});

type Props = {
  className?: string;
};

export default function FloatingLinesBackground({ className = "" }: Props) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <FloatingLines
        enabledWaves={["bottom", "top", "middle"]}
        lineCount={[10, 15, 20]}
        lineDistance={[8, 6, 4]}
        bendRadius={4.5}
        bendStrength={-0.28}
        mouseDamping={0.06}
        interactive
        parallax
        parallaxStrength={0.1}
        linesGradient={["#175024", "#161d16", "#1b1414"]}
      />
    </div>
  );
}
