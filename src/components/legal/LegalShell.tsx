import type { ReactNode } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

/**
 * Einheitlicher Rahmen für Rechtstexte (Impressum, Datenschutz).
 * Server Component – flaches, gut lesbares Layout im Stil der Startseite.
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
      <main className="bg-black px-6 pb-24 pt-36">
        <article className="mx-auto max-w-3xl">
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
