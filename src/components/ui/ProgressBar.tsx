/** Fortschrittsbalken (0 bis 100 %) im Markenlook. */
export function ProgressBar({
  value,
  showLabel = true,
  className = "",
}: {
  value: number;
  showLabel?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={className}>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#09ed2d] to-emerald-300 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs font-medium text-white/60">{pct}%</p>
      )}
    </div>
  );
}
