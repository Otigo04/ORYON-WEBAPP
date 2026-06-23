import type { ReactNode } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

/**
 * Einheitlicher Rahmen für Rechtstexte (Impressum, Datenschutz).
 * Server Component – ruhiges, gut lesbares Layout im Markendesign.
 */
export function LegalShell({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-gradient-to-b from-black via-[#03100a] to-black px-6 pb-24 pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#09ed2d]/[0.06] blur-[120px]"
        />
        <article className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-4 text-lg leading-relaxed text-white/60">{intro}</p>}
          {updated && (
            <p className="mt-3 text-sm text-white/40">Stand: {updated}</p>
          )}
          <div className="mt-12 flex flex-col gap-10">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}

/** Abschnitt mit Überschrift innerhalb eines Rechtstextes. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-white">{heading}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-white/60 [&_a]:text-[#09ed2d] [&_a:hover]:underline [&_strong]:font-semibold [&_strong]:text-white/80">
        {children}
      </div>
    </section>
  );
}
