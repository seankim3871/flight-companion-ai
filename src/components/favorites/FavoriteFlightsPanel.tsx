"use client";

import type { FavoriteFlight } from "@/types/favorite";

interface FavoriteFlightsPanelProps {
  favorites: FavoriteFlight[];
  onSelect: (favorite: FavoriteFlight) => void;
  onRemove: (id: string) => void;
}

/**
 * Displays saved favorite flights for quick re-planning.
 */
export function FavoriteFlightsPanel({
  favorites,
  onSelect,
  onRemove,
}: FavoriteFlightsPanelProps) {
  if (!favorites.length) return null;

  return (
    <section className="mx-auto max-w-lg px-4 sm:px-6">
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Favorite flights
        </h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Tap to reload a saved pickup plan
        </p>
        <ul className="mt-3 space-y-2">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="flex items-center gap-2 rounded-xl border border-amber-200/60 bg-white p-3 dark:border-amber-900/30 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => onSelect(fav)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  {fav.flightNumber}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {fav.homeAddress}
                </p>
              </button>
              <button
                type="button"
                onClick={() => onRemove(fav.id)}
                aria-label={`Remove ${fav.flightNumber} from favorites`}
                className="shrink-0 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
