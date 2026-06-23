import { faqs } from "@/lib/faq";

/**
 * FAQ-Sektion – reine Server Component. Nutzt native <details>/<summary>
 * (zugänglich, ohne JavaScript) für ein cleanes Accordion. Inhaltlich auf
 * Long-Tail-SEO und den Preisvorteil ausgerichtet; korrespondiert 1:1 mit dem
 * FAQ-JSON-LD auf der Startseite (Voraussetzung für FAQ-Rich-Results).
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-28 border-t border-white/10 bg-black px-6 py-24"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Häufige Fragen
          </h2>
          <p className="mt-4 text-base text-white/60">
            Alles Wichtige zu Preisen, Ablauf und unserer Arbeit als Berliner
            Webagentur – kurz und transparent beantwortet.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-1 transition open:border-[#09ed2d]/30 open:bg-white/[0.06] hover:border-white/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium text-white [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-[#09ed2d] transition group-open:rotate-45 group-open:border-[#09ed2d]/50"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <path
                      d="M8 3v10M3 8h10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-white/60">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
