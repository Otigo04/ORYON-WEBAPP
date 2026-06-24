type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "border-white/15 bg-white/5 text-white/70",
  info: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  danger: "border-red-400/30 bg-red-400/10 text-red-200",
};

/** Kleiner, farblich abgestufter Status-Chip. */
export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

/** Tonzuordnung für die verschiedenen Status-Domänen. */
export function leadTone(status: string): Tone {
  return (
    { new: "info", in_progress: "warning", answered: "success", closed: "neutral" } as const
  )[status as "new"] ?? "neutral";
}

export function projectTone(status: string): Tone {
  return (
    {
      planning: "info",
      in_progress: "warning",
      review: "info",
      done: "success",
      paused: "neutral",
    } as const
  )[status as "planning"] ?? "neutral";
}

export function invoiceTone(status: string): Tone {
  return (
    { draft: "neutral", sent: "info", paid: "success", cancelled: "danger" } as const
  )[status as "draft"] ?? "neutral";
}

export function offerTone(status: string): Tone {
  return (
    {
      draft: "neutral",
      sent: "info",
      accepted: "success",
      declined: "danger",
      expired: "warning",
    } as const
  )[status as "draft"] ?? "neutral";
}

export function conceptTone(status: string): Tone {
  return ({ draft: "neutral", shared: "success" } as const)[status as "draft"] ?? "neutral";
}
