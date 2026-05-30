/**
 * Placeholder while the Leaflet map bundle loads (dynamic import).
 */
export function MapLoadingSkeleton() {
  return (
    <div
      className="flex h-[min(52vh,280px)] w-full animate-pulse items-center justify-center rounded-xl border border-black/5 bg-slate-100 dark:border-white/10 dark:bg-slate-800 sm:h-[320px]"
      aria-hidden
    >
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Loading map…
      </span>
    </div>
  );
}
