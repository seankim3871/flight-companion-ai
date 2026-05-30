"use client";

import type { FavoriteFlight } from "@/types/favorite";
import { isFavorited, upsertFavorite } from "@/lib/favoritesStorage";
import { useEffect, useState } from "react";

interface SaveFlightButtonProps {
  flightNumber: string;
  homeAddress: string;
  email?: string;
  phone?: string;
}

/**
 * Toggle button to save the current flight to favorites.
 */
export function SaveFlightButton({
  flightNumber,
  homeAddress,
  email,
  phone,
}: SaveFlightButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFavorited(flightNumber, homeAddress));
  }, [flightNumber, homeAddress]);

  const handleClick = () => {
    upsertFavorite({
      flightNumber: flightNumber.trim().toUpperCase(),
      homeAddress: homeAddress.trim(),
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      label: `${flightNumber.toUpperCase()} → ${homeAddress.split(",")[0]}`,
    });
    setSaved(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saved}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:border-amber-200 disabled:bg-amber-50 disabled:text-amber-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:disabled:border-amber-900/50 dark:disabled:bg-amber-950/40 dark:disabled:text-amber-300"
    >
      <svg
        className={`h-4 w-4 ${saved ? "fill-amber-500 text-amber-500" : ""}`}
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
      {saved ? "Saved to favorites" : "Save favorite flight"}
    </button>
  );
}
