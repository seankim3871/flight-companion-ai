import type { FavoriteFlight } from "@/types/favorite";

const STORAGE_KEY = "flight-companion-favorites";

/**
 * Reads saved favorites from localStorage.
 */
export function loadFavorites(): FavoriteFlight[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteFlight[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists favorites to localStorage.
 */
export function saveFavorites(favorites: FavoriteFlight[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Adds or updates a favorite flight.
 */
export function upsertFavorite(favorite: Omit<FavoriteFlight, "id" | "savedAt">): FavoriteFlight {
  const favorites = loadFavorites();
  const existing = favorites.find(
    (f) =>
      f.flightNumber === favorite.flightNumber &&
      f.homeAddress === favorite.homeAddress
  );

  const entry: FavoriteFlight = existing ?? {
    ...favorite,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };

  if (existing) {
    Object.assign(existing, favorite, { savedAt: new Date().toISOString() });
  } else {
    favorites.unshift(entry);
  }

  saveFavorites(favorites);
  return existing ?? entry;
}

/**
 * Removes a favorite by id.
 */
export function removeFavorite(id: string): void {
  saveFavorites(loadFavorites().filter((f) => f.id !== id));
}

/**
 * Checks if a flight is already favorited.
 */
export function isFavorited(flightNumber: string, homeAddress: string): boolean {
  const normalized = flightNumber.trim().toUpperCase();
  return loadFavorites().some(
    (f) =>
      f.flightNumber === normalized &&
      f.homeAddress === homeAddress.trim()
  );
}
