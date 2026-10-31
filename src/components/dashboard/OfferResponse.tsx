"use client";

import { useState, useTransition } from "react";
import { respondToOffer } from "@/lib/actions/offers";

/**
 * Annehmen / Ablehnen eines Angebots durch den Kunden (mit optionalem
 * Kommentar). Sendet über die Server-Action `respondToOffer`, die den
 * Statuswechsel serverseitig absichert. Nach Erfolg lädt die Seite neu
 * (revalidatePath), sodass der neue Status angezeigt wird.
 */
export function OfferResponse({ offerId }: { offerId: string }) {
  const [isPending, startTransition] = useTransition();
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (choice: "accepted" | "declined") => {
    setDecision(choice);
    setError(null);
    startTransition(async () => {
      const result = await respondToOffer({ offerId, decision: choice, comment });
      if (!result.ok) {
        setError(result.error ?? "Etwas ist schiefgelaufen.");
        setDecision(null);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="text-base font-semibold text-white">Wie möchtest du fortfahren?</h3>
      <p className="mt-1 text-sm text-white/55">
        Nimm das Angebot an, um dein Projekt zu starten, oder gib uns Bescheid,
        wenn du Anpassungen wünschst.
      </p>

      <label className="mt-4 block">
        <span className="text-xs text-white/55">Kommentar / Rückfrage (optional)</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="z. B. Wunsch nach einer kleinen Änderung oder eine Frage …"
          className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#09ed2d]/60 focus:ring-1 focus:ring-[#09ed2d]/40"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit("accepted")}
          className="flex-1 rounded-full bg-[#09ed2d] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_24px_-4px_rgba(9,237,45,0.6)] transition hover:bg-[#09ed2d]/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && decision === "accepted" ? "Wird gesendet …" : "✓ Angebot annehmen"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submit("declined")}
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-red-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && decision === "declined" ? "Wird gesendet …" : "Ablehnen"}
        </button>
      </div>
    </div>
  );
}
