import { faqs } from "@/lib/faq";

/**
 * FAQ-Sektion – native `<details>`-Aufklapper (kein Client-JS, keine
 * Animations-Bibliothek). Die Antworten stehen immer im HTML und sind damit
 * auch ohne JavaScript les- und indexierbar. Korrespondiert 1:1 mit dem
 * FAQ-JSON-LD auf der Startseite (Voraussetzung für FAQ-Rich-Results).
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-28 border-t border-white/10 bg-black px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Häufige Fragen
          </h2>
          <p className="mt-4 text-base text-white/60">
            Das Wichtigste zu Preisen, Ablauf und Zusammenarbeit.
          </p>
        </header>

        <div className="w-full">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group border-b border-white/10 first:border-t"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-medium text-white [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg
                  viewBox="0 0 12 12"
                  className="h-4 w-4 flex-none text-[#09ed2d] transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-white/60">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
