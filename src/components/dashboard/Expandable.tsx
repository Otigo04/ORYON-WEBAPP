"use client";

import { Children, useState } from "react";

function ToggleButton({ open, hidden, onClick }: { open: boolean; hidden: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 px-5 py-3 text-xs font-semibold text-white/55 transition hover:text-white"
    >
      {open ? "Weniger anzeigen" : `${hidden} weitere anzeigen`}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
      >
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/**
 * Listen-Variante: kappt lange Dokument-Listen auf `max` Zeilen und blendet den
 * Rest hinter einem „… weitere anzeigen"-Schalter ein. Hält das Dashboard
 * übersichtlich, ohne Einträge unerreichbar zu machen. Kinder sind `<li>`.
 */
export function ExpandableList({ children, max = 4 }: { children: React.ReactNode; max?: number }) {
  const [open, setOpen] = useState(false);
  const items = Children.toArray(children);
  const hidden = items.length - max;
  const visible = hidden > 0 && !open ? items.slice(0, max) : items;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <ul className="divide-y divide-white/10">{visible}</ul>
      {hidden > 0 && (
        <div className="border-t border-white/10">
          <ToggleButton open={open} hidden={hidden} onClick={() => setOpen((v) => !v)} />
        </div>
      )}
    </div>
  );
}

/**
 * Grid-Variante: dasselbe Prinzip für Karten-Raster (z.B. Projekte).
 */
export function ExpandableGrid({
  children,
  max = 4,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const items = Children.toArray(children);
  const hidden = items.length - max;
  const visible = hidden > 0 && !open ? items.slice(0, max) : items;

  return (
    <div className="flex flex-col gap-3">
      <div className={className}>{visible}</div>
      {hidden > 0 && <ToggleButton open={open} hidden={hidden} onClick={() => setOpen((v) => !v)} />}
    </div>
  );
}
