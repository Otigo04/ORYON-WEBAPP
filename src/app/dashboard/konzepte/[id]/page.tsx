import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/documents/PrintButton";
import { getConcept } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "Konzept – TAS Webworks",
  robots: { index: false, follow: false },
};

const df = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" });

export default async function CustomerConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = await getConcept(id);
  if (!concept) notFound();

  return (
    <main className="min-h-screen bg-neutral-950 py-8 text-white print:bg-white print:py-0">
      <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-sm text-white/50 transition hover:text-white">
          ← Zurück
        </Link>
        <PrintButton label="Konzept drucken" />
      </div>

      <article className="doc-sheet mx-auto max-w-3xl rounded-2xl bg-white p-8 text-neutral-900 shadow-xl sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Konzept</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{concept.title}</h1>
        <p className="mt-1 text-sm text-neutral-400">{df.format(new Date(concept.created_at))}</p>
        <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
          {concept.content || "Für dieses Konzept liegt noch kein Inhalt vor."}
        </div>
      </article>
    </main>
  );
}
