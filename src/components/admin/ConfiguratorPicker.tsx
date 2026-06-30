"use client";

import { customerLabel, type Customer } from "@/lib/customer";
import type { Brief } from "@/lib/briefs";

const selectCls =
  "w-full appearance-none rounded-xl border border-white/12 bg-black/40 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#09ed2d]/60 focus:ring-2 focus:ring-[#09ed2d]/15 disabled:cursor-not-allowed disabled:opacity-40";

/** Kompaktes Options-Label für eine Konfiguration im Dropdown. */
function briefOptionLabel(b: Brief): string {
  const parts = [b.company?.trim() || b.name];
  if (b.price_min != null && b.price_max != null) {
    parts.push(`${b.price_min}–${b.price_max} €`);
  }
  const date = new Date(b.created_at).toLocaleDateString("de-DE");
  return `${parts.join(" · ")} (${date})`;
}

/**
 * Kunden- + Projektauswahl für Dokument-Formulare.
 *
 * Der Kunde wird als reguläres `user_id`-Feld submittet (controlled). Sobald ein
 * Kunde gewählt ist, listet das zweite Dropdown dessen Konfigurator-Anfragen
 * (Briefs). Wahl einer Konfiguration ruft `onImport(brief)` auf, das im Formular
 * Titel, Positionen, Preis und Beschreibung vorbefüllt, alles bleibt danach
 * frei editierbar.
 */
export function ConfiguratorPicker({
  customers,
  briefs,
  userId,
  onUserChange,
  onImport,
  userError,
}: {
  customers: Customer[];
  briefs: Brief[];
  userId: string;
  onUserChange: (id: string) => void;
  onImport: (brief: Brief) => void;
  userError?: string;
}) {
  const customerBriefs = briefs.filter((b) => b.user_id && b.user_id === userId);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="user_id" className="text-xs font-medium uppercase tracking-wide text-white/50">
          Kunde
        </label>
        <select
          id="user_id"
          name="user_id"
          value={userId}
          onChange={(e) => onUserChange(e.target.value)}
          aria-invalid={!!userError}
          className={selectCls}
        >
          <option value="" disabled>
            Kunde auswählen …
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id} className="bg-neutral-900">
              {customerLabel(c)}
            </option>
          ))}
        </select>
        {userError && <p className="text-xs text-red-300">{userError}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-white/50">
          Projekt aus Konfigurator
        </label>
        <select
          value=""
          disabled={!userId || customerBriefs.length === 0}
          onChange={(e) => {
            const brief = customerBriefs.find((b) => b.id === e.target.value);
            if (brief) onImport(brief);
          }}
          className={selectCls}
        >
          <option value="">
            {!userId
              ? "Erst Kunde wählen …"
              : customerBriefs.length === 0
                ? "Keine Konfiguration vorhanden"
                : "Projekt übernehmen …"}
          </option>
          {customerBriefs.map((b) => (
            <option key={b.id} value={b.id} className="bg-neutral-900">
              {briefOptionLabel(b)}
            </option>
          ))}
        </select>
        <p className="text-xs text-white/40">
          Übernimmt Titel, Positionen &amp; Preis automatisch, alles bleibt danach editierbar.
        </p>
      </div>
    </div>
  );
}
