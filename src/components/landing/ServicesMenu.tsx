"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { branches } from "@/lib/branches";

/**
 * "Leistungen"-Dropdown der Hauptnavigation (Desktop).
 *
 * Client-Insel: Der als Button erkennbare "Leistungen"-Eintrag öffnet beim Klick
 * ein Karten-Panel (Branchen-Lösungen). Die Animation läuft rein über
 * CSS-Transitions – der geschlossene Zustand ist bereits im (Server-)Markup
 * versteckt (opacity-0 + pointer-events-none), daher blitzt das Panel beim
 * Laden der Seite nicht kurz auf. Öffnen/Schließen ist dadurch sofort und clean.
 * Schließen per Außenklick oder Escape.
 */
export function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 transition-colors ${
          open ? "text-white" : "text-white/70 hover:text-white"
        }`}
      >
        Leistungen
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="m4 6 4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        aria-label="Leistungen nach Branche"
        style={{ transformOrigin: "top center" }}
        className={`absolute left-1/2 top-[calc(100%+1.4rem)] z-50 w-[min(88vw,720px)] -translate-x-1/2 rounded-2xl border border-[#09ed2d]/20 bg-black/90 p-3 shadow-[0_24px_60px_-20px_rgba(9,237,45,0.45)] backdrop-blur-xl transition duration-200 ease-out ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {branches.map((branche, i) => (
            <Link
              key={branche.slug}
              href={`/branchen/${branche.slug}`}
              onClick={() => setOpen(false)}
              role="menuitem"
              tabIndex={open ? undefined : -1}
              style={{ transitionDelay: open ? `${i * 35}ms` : "0ms" }}
              className={`group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 ease-out hover:border-[#09ed2d]/40 hover:bg-white/[0.07] ${
                open ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
              }`}
            >
              <span className="text-[0.7rem] font-medium uppercase tracking-wider text-[#09ed2d]">
                {branche.industry}
              </span>
              <span className="flex items-start justify-between gap-2 text-[15px] font-semibold leading-snug text-white">
                {branche.solution}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#09ed2d]"
                >
                  <path
                    d="M7 17 17 7M7 7h10v10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-xs leading-relaxed text-white/50">{branche.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
