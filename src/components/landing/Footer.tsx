import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";

const footerNav = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Referenzen", href: "#referenzen" },
  { label: "Kontakt", href: "#kontakt" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Link href="/" aria-label="ORYON SYSTEMS – Startseite" className="inline-flex">
            <LogoWordmark className="h-7 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-white/60">
            Software, die dein Unternehmen wachsen lässt. Performance, Design und
            Conversion aus einer Hand.
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
            href="mailto:hello@oryon-systems.de"
            className="text-sm text-white/60 transition hover:text-white"
          >
            hello@oryon-systems.de
          </a>
          <Link
            href="/dashboard"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Kundenportal
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl border-t border-white/10 pt-6">
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} ORYON SYSTEMS. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
