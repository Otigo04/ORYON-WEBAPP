"use client";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@/components/animate-ui/components/headless/accordion";
import { faqs } from "@/lib/faq";

/**
 * FAQ-Sektion, animiertes Accordion (Animate UI, Headless UI + Motion) im
 * minimalistischen Stil: schlichte Trennlinien, Chevron im Smaragd-Akzent der
 * Marke. Inhaltlich auf Long-Tail-SEO und den Preisvorteil ausgerichtet;
 * korrespondiert 1:1 mit dem FAQ-JSON-LD auf der Startseite (Voraussetzung für
 * FAQ-Rich-Results). Die Antworten bleiben dank `keepRendered` immer im DOM -
 * also auch im SSR-HTML für die Indexierung.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="relative scroll-mt-28 overflow-hidden border-t border-white/10 bg-gradient-to-b from-black via-[#03100a] to-black px-6 py-24"
    >
      {/* Dezenter, cleaner Hintergrund: weicher Grün-Glow + feines Raster. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-[#09ed2d]/[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#09ed2d]">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Häufige Fragen
          </h2>
          <p className="mt-4 text-base text-white/60">
            Alles Wichtige zu Preisen, Ablauf und unserer Arbeit als Berliner
            Webagentur, kurz und transparent beantwortet.
          </p>
        </header>

        <Accordion className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} className="border-white/10 last:border-b">
              <AccordionButton className="py-5 text-base text-white hover:no-underline [&>svg]:size-5 [&>svg]:text-[#09ed2d]">
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
