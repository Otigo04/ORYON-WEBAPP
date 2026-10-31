"use client";

import { useEffect, useRef } from "react";

/**
 * Sehr schlanke Scroll-Fortschrittsanzeige am oberen Bildschirmrand.
 *
 * Client-Insel: misst die vertikale Scroll-Position und füllt eine dünne Leiste
 * im Marken-Grün. Schreibt `transform: scaleX` direkt per ref (kein React-State,
 * kein Re-Render pro Scroll-Frame) + rAF-Drosselung für flüssiges, ruckelfreies
 * Laufen. Liegt über der Navbar.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-[#09ed2d] shadow-[0_0_12px_rgba(9,237,45,0.6)]"
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
