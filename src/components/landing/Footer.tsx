import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";
import { launchFlags, siteConfig } from "@/lib/site";

const footerNav = [
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Projekt", href: "/#projekt" },
  { label: "Preisrechner", href: "/#preisrechner" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/#kontakt" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Link href="/" aria-label="TAS Webworks – Startseite" className="inline-flex">
            <LogoWordmark className="h-12 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-white/60">
            Websites und Online-Shops für kleine Unternehmen.
          </p>
          <p className="mt-3 text-xs text-white/40">
            Gebaut mit Next.js, TypeScript, Supabase und Vercel.
          </p>
        </div>

        <nav aria-label="Footer-Navigation" className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Navigation
          </span>
          {footerNav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Kontakt
          </span>
          <a
            href={`tel:${siteConfig.telephone.replace(/\s+/g, "")}`}
            className="text-sm text-white/60 transition hover:text-white"
          >
            {siteConfig.telephone}
          </a>
          <span className="text-sm text-white/60">{siteConfig.email}</span>
          {launchFlags.dashboard && (
            <Link
              href="/dashboard"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Kundenportal
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col-reverse gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} TAS Webworks. Alle Rechte vorbehalten.
        </p>
        <nav aria-label="Rechtliches" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/impressum"
            className="text-xs text-white/40 transition hover:text-white"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="text-xs text-white/40 transition hover:text-white"
          >
            Datenschutz
          </Link>
          <Link
            href="/agb"
            className="text-xs text-white/40 transition hover:text-white"
          >
            AGB
          </Link>
        </nav>
      </div>
    </footer>
  );
}
