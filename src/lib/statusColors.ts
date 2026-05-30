import type { FlightStatus } from "@/types/flight";

/**
 * Tailwind class sets for status badges — light and dark variants.
 */
export function getStatusBadgeClasses(status: FlightStatus): string {
  const map: Record<FlightStatus, string> = {
    Scheduled:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    "On Time":
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Delayed:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    Boarding:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Departed:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    "In Air":
      "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
    Landed:
      "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    Cancelled:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };

  return map[status] ?? map.Scheduled;
}
