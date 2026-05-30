interface PickupMetricTileProps {
  label: string;
  value: string;
  subtext?: string;
  accent?: "sky" | "emerald" | "amber" | "slate";
}

const accentStyles = {
  sky: "border-sky-200 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/40",
  emerald:
    "border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40",
  amber:
    "border-amber-200 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-950/40",
  slate:
    "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/50",
};

/**
 * Single metric cell in the pickup planning dashboard grid.
 */
export function PickupMetricTile({
  label,
  value,
  subtext,
  accent = "slate",
}: PickupMetricTileProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${accentStyles[accent]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{subtext}</p>
      )}
    </div>
  );
}
