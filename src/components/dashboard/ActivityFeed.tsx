"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type ActivityItem = {
  id: string;
  /** Art des Ereignisses – bestimmt Icon & Farbe. */
  kind: "offer" | "invoice" | "project" | "concept" | "lead";
  title: string;
  sub: string;
  href?: string;
  /** ISO-Zeitstempel. */
  date: string;
};

const SEEN_KEY = "tas-dash-seen";

const KIND_META: Record<ActivityItem["kind"], { label: string; color: string }> = {
  offer: { label: "Angebot", color: "text-[#09ed2d]" },
  invoice: { label: "Rechnung", color: "text-sky-300" },
  project: { label: "Projekt", color: "text-amber-300" },
  concept: { label: "Konzept", color: "text-violet-300" },
  lead: { label: "Anfrage", color: "text-white/70" },
};

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * „Was ist neu"-Feed. Markiert Ereignisse, die seit dem letzten Besuch
 * hinzugekommen sind, mit einem NEU-Badge. Der „zuletzt gesehen"-Zeitpunkt
 * liegt im localStorage und wird beim Anzeigen aktualisiert – rein clientseitig,
 * ohne zusätzliche Tabelle.
 */
export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const [lastSeen, setLastSeen] = useState<number | null>(null);

  useEffect(() => {
    let prev = 0;
    try {
      prev = Number(localStorage.getItem(SEEN_KEY)) || 0;
    } catch {
      /* kein Storage */
    }
    // Bewusst nach dem Mount: localStorage ist client-only. So bleibt der
    // erste (Server-)Render frei von NEU-Badges und es gibt kein Hydration-
    // Mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastSeen(prev);

    // Neuesten Zeitpunkt als „gesehen" merken (für den nächsten Besuch).
    const newest = items.reduce((max, it) => Math.max(max, new Date(it.date).getTime()), 0);
    if (newest > 0) {
      try {
        localStorage.setItem(SEEN_KEY, String(newest));
      } catch {
        /* egal */
      }
    }
  }, [items]);

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col">
      {items.map((it, idx) => {
        const meta = KIND_META[it.kind];
        const isNew = lastSeen !== null && new Date(it.date).getTime() > lastSeen;
        const inner = (
          <div className="flex items-start gap-3 py-3">
            <span
              className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold ${meta.color}`}
            >
              {meta.label.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-semibold uppercase tracking-wide ${meta.color}`}>
                  {meta.label}
                </span>
                {isNew && (
                  <span className="rounded-full bg-[#09ed2d] px-1.5 py-0.5 text-[10px] font-bold uppercase text-black">
                    Neu
                  </span>
                )}
                <span className="text-xs text-white/35">
                  {dateFormatter.format(new Date(it.date))}
                </span>
              </div>
              <p className="mt-0.5 truncate font-medium text-white">{it.title}</p>
              <p className="truncate text-xs text-white/45">{it.sub}</p>
            </div>
          </div>
        );
        return (
          <li
            key={it.id}
            className={idx > 0 ? "border-t border-white/5" : undefined}
          >
            {it.href ? (
              <Link href={it.href} className="block rounded-lg px-2 transition hover:bg-white/[0.04]">
                {inner}
              </Link>
            ) : (
              <div className="px-2">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
