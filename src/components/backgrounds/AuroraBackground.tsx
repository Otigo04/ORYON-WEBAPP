/**
 * Leichtgewichtiger, cleaner Hintergrund ohne WebGL.
 *
 * Reine CSS-Schichten (Grid + zwei weiche Glows), die genau einmal gerastert
 * werden. Die dezente Bewegung läuft ausschließlich über `transform` (GPU-
 * Compositor, kein Repaint) und kostet damit praktisch keine FPS, anders als
 * der frühere Vollbild-Shader. Als `fixed`-Layer hinter dem Inhalt.
 */
export default function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black ${className}`}
    >
      {/* Feines Tech-Grid, weich nach außen ausgeblendet */}
      <div className="absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent_75%)]" />

      {/* Smaragd-Glow oben, sehr langsame Drift (nur transform) */}
      <div className="aurora-drift absolute -top-40 left-1/2 h-[44rem] w-[64rem] -translate-x-1/2 rounded-full bg-[#09ed2d]/12 blur-[130px]" />

      {/* Cyan-Glow unten rechts, statisch */}
      <div className="absolute -bottom-40 -right-24 h-[34rem] w-[44rem] rounded-full bg-[#22d3ee]/[0.08] blur-[130px]" />
    </div>
  );
}
