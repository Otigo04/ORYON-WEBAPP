"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { ServicesMenu } from "@/components/landing/ServicesMenu";
import { branches } from "@/lib/branches";
import { signOutAction } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Referenzen", href: "#referenzen" },
  { label: "Preisrechner", href: "#preisrechner" },
  { label: "Kontakt", href: "#kontakt" },
];

/**
 * Sticky, scroll-bewusste Hauptnavigation.
 *
 * Client-Insel, weil sie auf den Scroll-Status reagiert und ein aufklappbares
 * Mobile-Menü besitzt. Sie liegt `fixed` über dem Inhalt und reserviert daher
 * keinen Platz im Layout-Fluss. Die Leiste ist immer als Glas-Element sichtbar
 * (hebt sich klar vom Hintergrund ab) und wird beim Scrollen kräftiger.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth-Status client-seitig ermitteln, damit die öffentlichen Seiten statisch
  // (SEO-optimal) bleiben. Reagiert live auf Login/Logout in anderen Tabs.
  useEffect(() => {
    const hasSupabaseEnv =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!hasSupabaseEnv) return;

    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setIsAuthenticated(!!data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav
        aria-label="Hauptnavigation"
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled || menuOpen
            ? "border-[#09ed2d]/20 bg-black/80 shadow-[0_8px_40px_-12px_rgba(9,237,45,0.35)] backdrop-blur-xl"
            : "border-white/10 bg-white/[0.04] shadow-[0_4px_30px_-12px_rgba(9,237,45,0.25)] backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          aria-label="TAS Webworks – Startseite"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          <span className="animate-gem-glow inline-flex items-center justify-center rounded-xl p-1.5">
            <LogoMark className="h-8 w-auto animate-gem-pulse" />
          </span>
        </Link>

        {/* Rechts gruppiert: erst die Navigations-Reiter, dann – durch Abstand
            und einen dezenten Trenner klar abgesetzt – die Konto-Aktionen. */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7 text-sm text-white/70">
            <li>
              <ServicesMenu />
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <span aria-hidden="true" className="h-5 w-px bg-white/15" />

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Dashboard
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
                  >
                    Abmelden
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
                >
                  Registrieren
                </Link>
              </>
            )}
            <a
              href="#kontakt"
              className="rounded-full bg-[#09ed2d] px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90"
            >
              Projekt starten
            </a>
          </div>
        </div>

        {/* Mobile-Umschalter */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile-Menü */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-5xl rounded-2xl border border-[#09ed2d]/20 bg-black/90 p-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-1 text-sm text-white/80">
            <li>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((open) => !open)}
                aria-expanded={mobileServicesOpen}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white"
              >
                Leistungen
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    mobileServicesOpen ? "rotate-180" : ""
                  }`}
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
              {mobileServicesOpen && (
                <ul className="mb-1 ml-2 flex flex-col gap-1 border-l border-white/10 pl-2">
                  {branches.map((branche) => (
                    <li key={branche.slug}>
                      <Link
                        href={`/branchen/${branche.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white"
                      >
                        <span className="block text-[0.7rem] font-medium uppercase tracking-wider text-[#09ed2d]">
                          {branche.industry}
                        </span>
                        <span className="text-sm text-white/80">{branche.solution}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Dashboard
                </Link>
                <form action={signOutAction} className="contents">
                  <button
                    type="submit"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Abmelden
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white/80 transition hover:text-white"
                >
                  Anmelden
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Registrieren
                </Link>
              </>
            )}
            <a
              href="#kontakt"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#09ed2d] px-4 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
            >
              Projekt starten
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
