"use client";

import { useState } from "react";

/**
 * Aktionen für den Claude-Prompt einer Kunden-Konfiguration:
 * - Kopieren in die Zwischenablage
 * - Herunterladen als Markdown-/Textdatei (direkt bei Claude hochladbar)
 *
 * Der Prompt-Text wird serverseitig vorberechnet und hier nur ausgegeben.
 */
export function BriefPromptActions({
  prompt,
  filename,
}: {
  prompt: string;
  filename: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard nicht verfügbar */
    }
  };

  const download = () => {
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="rounded-full bg-[#09ed2d] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#09ed2d]/90"
      >
        {copied ? "Kopiert ✓" : "Als Prompt kopieren"}
      </button>
      <button
        type="button"
        onClick={download}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Als Datei (.md) herunterladen
      </button>
    </div>
  );
}
