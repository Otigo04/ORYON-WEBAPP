"use client";

import Image from "next/image";
import { useState } from "react";
import type { FleetModule } from "@/lib/tas-fleet";

/**
 * Browser-Mockup-Rahmen für die TAS-FLEET-Screenshots.
 *
 * Versucht zunächst, den echten Screenshot unter `src` zu laden. Existiert die
 * Datei (noch) nicht, fällt die Komponente automatisch auf einen stilvollen
 * CSS-Mockup zurück, so sieht die Seite schon ohne echte Assets fertig aus.
 * Sobald du die PNGs unter /public/tas-fleet/screens/ ablegst, erscheinen sie
 * ohne weitere Codeänderung.
 */
type Props = {
  src: string;
  alt: string;
  mock: FleetModule["mock"];
  /** Browserzeilen-URL (rein dekorativ). */
  url?: string;
  className?: string;
};

export function BrowserFrame({ src, alt, mock, url = "fleet.tas-webworks.de", className = "" }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#070d0b] shadow-[0_30px_80px_-30px_rgba(34,211,238,0.35)] ${className}`}
    >
      {/* Browser-Chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex flex-1 items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1 text-[11px] text-white/40">
            <LockIcon className="h-2.5 w-2.5" />
            {url}
          </span>
        </div>
      </div>

      {/* Inhalt: echter Screenshot oder Mockup-Fallback */}
      <div className="relative aspect-[16/10] w-full">
        {!imgFailed ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover object-top"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <MockScreen mock={mock} />
        )}
      </div>
    </div>
  );
}

/** Stilisierte App-Oberfläche je Modul, reiner CSS/JSX-Platzhalter. */
function MockScreen({ mock }: { mock: FleetModule["mock"] }) {
  return (
    <div className="absolute inset-0 flex bg-gradient-to-br from-[#08120e] via-[#060c0a] to-black text-white/70">
      {/* Sidebar */}
      <aside className="hidden w-1/5 flex-col gap-2 border-r border-white/5 bg-black/30 p-3 sm:flex">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-5 w-5 rounded-md bg-gradient-to-br from-[#09ed2d] to-[#22d3ee]" />
          <span className="h-2 w-12 rounded bg-white/20" />
        </div>
        {["dashboard", "disposition", "fleet", "compliance", "import", "incident"].map((item) => (
          <div
            key={item}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
              item === mock ? "bg-[#09ed2d]/15" : ""
            }`}
          >
            <span
              className={`h-2 w-2 rounded-sm ${item === mock ? "bg-[#09ed2d]" : "bg-white/20"}`}
            />
            <span className={`h-1.5 rounded ${item === mock ? "w-12 bg-white/40" : "w-10 bg-white/15"}`} />
          </div>
        ))}
      </aside>

      {/* Hauptbereich */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="h-3 w-32 rounded bg-white/25" />
          <span className="h-6 w-20 rounded-md bg-gradient-to-r from-[#09ed2d] to-[#22d3ee] opacity-80" />
        </div>
        <MockBody mock={mock} />
      </div>
    </div>
  );
}

function MockBody({ mock }: { mock: FleetModule["mock"] }) {
  switch (mock) {
    case "dashboard":
      return (
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {["#09ed2d", "#22d3ee", "#febc2e"].map((c, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <span className="block h-2 w-10 rounded bg-white/20" />
                <span className="mt-2 block h-4 w-12 rounded" style={{ background: c, opacity: 0.7 }} />
              </div>
            ))}
          </div>
          <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <span className="block h-2 w-20 rounded bg-white/20" />
            <div className="mt-3 flex flex-col gap-2">
              {[1, 2, 3].map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#09ed2d]" />
                  <span className="h-1.5 flex-1 rounded bg-white/10" />
                  <span className="h-3 w-10 rounded bg-[#22d3ee]/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "disposition":
      return (
        <div className="grid flex-1 grid-cols-5 gap-1.5">
          {Array.from({ length: 25 }).map((_, i) => {
            const filled = [1, 3, 6, 7, 12, 13, 16, 19, 22, 24].includes(i);
            return (
              <div
                key={i}
                className="rounded border border-white/5"
                style={{
                  background: filled
                    ? i % 2
                      ? "rgba(9,237,45,0.35)"
                      : "rgba(34,211,238,0.35)"
                    : "rgba(255,255,255,0.03)",
                }}
              />
            );
          })}
        </div>
      );
    case "fleet":
      return (
        <div className="flex flex-1 flex-col gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <div key={r} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[#09ed2d]/50 to-[#22d3ee]/50" />
              <span className="h-1.5 w-24 rounded bg-white/20" />
              <span className="ml-auto h-3 w-12 rounded-full bg-[#09ed2d]/25" />
            </div>
          ))}
        </div>
      );
    case "compliance":
      return (
        <div className="flex flex-1 flex-col gap-2">
          {[
            { c: "#28c840", w: "w-16" },
            { c: "#febc2e", w: "w-24" },
            { c: "#ff5f57", w: "w-20" },
            { c: "#28c840", w: "w-28" },
          ].map((row, r) => (
            <div key={r} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2.5">
              <span className="h-2 w-2 rounded-full" style={{ background: row.c }} />
              <span className={`h-1.5 ${row.w} rounded bg-white/20`} />
              <span className="ml-auto h-3 w-14 rounded-full border" style={{ borderColor: row.c, opacity: 0.6 }} />
            </div>
          ))}
        </div>
      );
    case "import":
      return (
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#22d3ee]/40 bg-[#22d3ee]/[0.04]">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#09ed2d] to-[#22d3ee] opacity-70" />
            <span className="h-1.5 w-28 rounded bg-white/20" />
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-[#09ed2d] to-[#22d3ee]" />
          </div>
        </div>
      );
    case "incident":
      return (
        <div className="grid flex-1 grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((r) => (
            <div key={r} className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center justify-between">
                <span className="h-3 w-10 rounded-full bg-[#ff5f57]/40" />
                <span className="h-2 w-8 rounded bg-white/15" />
              </div>
              <span className="h-1.5 w-full rounded bg-white/15" />
              <span className="h-1.5 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      );
  }
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
