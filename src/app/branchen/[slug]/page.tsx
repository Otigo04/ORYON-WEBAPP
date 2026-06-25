import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { JsonLd } from "@/components/JsonLd";
import { branches, getBranche } from "@/lib/branches";
import { breadcrumbSchema } from "@/lib/structured-data";

type Params = { slug: string };

/**
 * Statisch alle generischen Branchen-Routen vorgenerieren (beste
 * SEO-Performance). Einträge mit eigenem `href` (z.B. TAS-FLEET → eigene
 * Produktseite) werden übersprungen, um doppelten Content zu vermeiden.
 */
export function generateStaticParams() {
  return branches.filter((b) => !b.href).map((branche) => ({ slug: branche.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const branche = getBranche(slug);
  if (!branche) return {};

  const path = `/branchen/${branche.slug}`;
  return {
    title: branche.solution,
    description: branche.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${branche.solution} | TAS Webworks`,
      description: branche.description,
    },
  };
}

export default async function BranchePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const branche = getBranche(slug);
  if (!branche) notFound();
  // Einträge mit eigener Produktseite (z.B. TAS-FLEET) dorthin weiterleiten.
  if (branche.href) redirect(branche.href);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Start", path: "/" },
          { name: "Leistungen", path: "/#leistungen" },
          { name: branche.industry, path: `/branchen/${branche.slug}` },
        ])}
      />
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#03100a] to-black px-6 pb-24 pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#09ed2d]/[0.08] blur-[120px]"
          />
          <div className="relative mx-auto max-w-3xl">
            <Link
              href="/#leistungen"
              className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                <path
                  d="m10 4-4 4 4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Zurück zu den Leistungen
            </Link>

            <span className="mt-8 block text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
              {branche.industry}
            </span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {branche.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">{branche.intro}</p>

            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {branche.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#09ed2d]/15 text-[#09ed2d]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path
                        d="m5 13 4 4 10-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <Link
                href="/#kontakt"
                className="inline-flex rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90"
              >
                Projekt starten
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
