"use client";

import type { FavoriteFlight } from "@/types/favorite";
import {
  loadFavorites,
  removeFavorite,
  upsertFavorite,
} from "@/lib/favoritesStorage";
import { useCallback, useEffect, useState } from "react";

/**
 * Client hook for managing saved favorite flights.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteFlight[]>([]);

  const refresh = useCallback(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveFavorite = useCallback(
    (data: Omit<FavoriteFlight, "id" | "savedAt">) => {
      upsertFavorite(data);
      refresh();
    },
    [refresh]
  );

  const deleteFavorite = useCallback(
    (id: string) => {
      removeFavorite(id);
      refresh();
    },
    [refresh]
  );

  return { favorites, saveFavorite, deleteFavorite, refresh };
}
