import type { PickupRecommendation } from "@/types/pickupPlan";

interface EnhancedPickupTipsProps {
  recommendations: PickupRecommendation[];
  suggestedAction: string;
}

/**
 * Detailed airport pickup recommendations grid.
 */
export function EnhancedPickupTips({
  recommendations,
  suggestedAction,
}: EnhancedPickupTipsProps) {
  return (
    <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        Pickup recommendations
      </h3>
      <p className="mt-2 rounded-xl bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
        {suggestedAction}
      </p>
      <ul className="mt-4 space-y-3">
        {recommendations.map((rec) => (
          <li
            key={rec.title}
            className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm dark:bg-slate-900"
              aria-hidden
            >
              {iconFor(rec.icon)}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {rec.title}
              </p>
              <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">
                {rec.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function iconFor(icon: PickupRecommendation["icon"]): string {
  const map: Record<PickupRecommendation["icon"], string> = {
    curbside: "🚗",
    terminal: "🏢",
    waiting: "⏳",
    parking: "🅿️",
    weather: "🌤️",
    traffic: "🚦",
    tip: "💡",
    delay: "⏱️",
    avoid: "⚠️",
  };
  return map[icon] ?? "•";
}
