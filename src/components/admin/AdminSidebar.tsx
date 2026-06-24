"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Übersicht", exact: true },
  { href: "/admin/anfragen", label: "Anfragen" },
  { href: "/admin/konfigurationen", label: "Konfigurationen" },
  { href: "/admin/projekte", label: "Projekte" },
  { href: "/admin/rechnungen", label: "Rechnungen" },
  { href: "/admin/angebote", label: "Angebote" },
  { href: "/admin/konzepte", label: "Konzepte" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin-Navigation" className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-[#09ed2d]/15 text-[#09ed2d]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
