import { AIRPORT_COORDINATES_FALLBACK } from "@/data/airportCoordinates";
import type { GeoCoordinates } from "@/types/map";

/**
 * Resolves airport lat/lng from local mock data (no external API).
 */
export function getAirportCoordinates(iataCode: string): GeoCoordinates | null {
  const code = iataCode.trim().toUpperCase();
  if (!code || code === "—") return null;
  return AIRPORT_COORDINATES_FALLBACK[code] ?? null;
}
