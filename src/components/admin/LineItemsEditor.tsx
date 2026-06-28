"use client";

import { useState } from "react";
import { computeTotals, formatMoney, type LineItem } from "@/lib/documents";

const inputBase =
  "rounded-lg border border-white/12 bg-black/40 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#09ed2d]/60";

/**
 * Editor für Dokument-Positionen. Hält die Positionen im State und serialisiert
 * sie als JSON in ein verstecktes Feld `items`, das die Server-Action liest.
 * Zeigt Netto/MwSt/Brutto live an.
 */
export function LineItemsEditor({
  defaultItems,
  taxRate,
  value,
  onChange,
}: {
  defaultItems?: LineItem[];
  taxRate: number;
  /** Optionaler kontrollierter Modus (z. B. für Import von außen). */
  value?: LineItem[];
  onChange?: (items: LineItem[]) => void;
}) {
  const [internal, setInternal] = useState<LineItem[]>(
    defaultItems && defaultItems.length > 0
      ? defaultItems
      : [{ description: "", quantity: 1, unit_price: 0 }],
  );

  const controlled = value !== undefined;
  const items = controlled ? value : internal;
  const setItems = (next: LineItem[]) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const update = (i: number, patch: Partial<LineItem>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const add = () => setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);

  const totals = computeTotals(items, taxRate);

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="hidden grid-cols-[1fr_80px_120px_40px] gap-2 px-1 text-xs uppercase tracking-wide text-white/40 sm:grid">
        <span>Beschreibung</span>
        <span>Menge</span>
        <span>Einzelpreis €</span>
        <span />
      </div>

      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_80px_120px_40px]">
          <input
            className={inputBase}
            placeholder="Leistung / Position"
            value={item.description}
            onChange={(e) => update(i, { description: e.target.value })}
          />
          <input
            className={inputBase}
            type="number"
            min={0}
            step="0.5"
            value={item.quantity}
            onChange={(e) => update(i, { quantity: Number(e.target.value) })}
          />
          <input
            className={inputBase}
            type="number"
            min={0}
            step="0.01"
            value={item.unit_price}
            onChange={(e) => update(i, { unit_price: Number(e.target.value) })}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={items.length === 1}
            className="rounded-lg text-white/40 transition hover:text-red-300 disabled:opacity-30"
            aria-label="Position entfernen"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="self-start rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-[#09ed2d]/40 hover:text-white"
      >
        + Position hinzufügen
      </button>

      <div className="ml-auto mt-2 w-full max-w-xs space-y-1 text-sm">
        <Row label="Netto" value={formatMoney(totals.net)} />
        <Row label={`MwSt. (${taxRate}%)`} value={formatMoney(totals.tax)} />
        <Row label="Gesamt" value={formatMoney(totals.gross)} strong />
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex justify-between ${
        strong ? "border-t border-white/10 pt-1 text-base font-semibold text-[#09ed2d]" : "text-white/60"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
