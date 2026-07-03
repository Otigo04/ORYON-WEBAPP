"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Interaktive Diashow für Referenzbilder eines Projekts. Blendet zwischen
 * mehreren Screenshots über (Auto-Advance mit Hover-Pause), zeigt Punkt-Navigation
 * und Pfeile beim Hover. Respektiert `prefers-reduced-motion` (kein Auto-Wechsel).
 */
export function ProjectSlideshow({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (paused || reduced.current || images.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused, images.length]);

  return (
    <div
      className="group/slide relative aspect-[16/10] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${title} – Ansicht ${i + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}

      {/* Zähler */}
      <span className="absolute right-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
        {active + 1} / {images.length}
      </span>

      {/* Pfeile (nur beim Hover) */}
      <button
        type="button"
        aria-label="Vorheriges Bild"
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/70 group-hover/slide:opacity-100"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Nächstes Bild"
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/70 group-hover/slide:opacity-100"
      >
        ›
      </button>

      {/* Punkt-Navigation */}
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Bild ${i + 1}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-[#09ed2d]" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
