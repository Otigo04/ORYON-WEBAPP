"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Globale Admin-Suche (Sidebar). Navigiert zur Ergebnis-Seite /admin/suche?q=…
 * Sucht über Rechnungs-/Angebotsnummern, Titel, Kundennamen & E-Mails.
 */
export function AdminSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/admin/suche?q=${encodeURIComponent(q)}` : "/admin/suche");
  };

  return (
    <form onSubmit={submit} role="search" className="px-1">
      <label htmlFor="admin-search" className="sr-only">
        Suche (Rechnungs-/Angebotsnr., Name …)
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-[#09ed2d]/40">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 flex-none text-white/40">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="admin-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Suche: RE-…, AN-…, Name"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
        />
      </div>
    </form>
  );
}
