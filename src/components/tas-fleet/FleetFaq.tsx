"use client";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@/components/animate-ui/components/headless/accordion";
import { FLEET_FAQS } from "@/lib/tas-fleet";

/**
 * FAQ der TAS-FLEET-Seite – animiertes Accordion (Animate UI) im
 * minimalistischen Stil mit Chevron im Cyan-Akzent der Fleet-Marke.
 * Korrespondiert mit dem FAQ-JSON-LD der Seite (Rich-Results); die Antworten
 * bleiben dank `keepRendered` immer im DOM (auch im SSR-HTML).
 */
export function FleetFaq() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-28 border-t border-white/10 bg-black px-6 py-24"
    >
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#22d3ee]">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Häufige Fragen zu TAS-FLEET
          </h2>
        </header>

        <Accordion className="w-full">
          {FLEET_FAQS.map((faq) => (
            <AccordionItem key={faq.question} className="border-white/10 last:border-b">
              <AccordionButton className="py-5 text-base text-white hover:no-underline [&>svg]:size-5 [&>svg]:text-[#22d3ee]">
                {faq.question}
              </AccordionButton>
              <AccordionPanel
                keepRendered
                className="pb-5 text-sm leading-relaxed text-white/60"
              >
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
