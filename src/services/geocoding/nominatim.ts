import type { GeoCoordinates } from "@/types/map";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "FlightCompanionAI/1.0 (pickup-planner)";

export class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name?: string;
}

/**
 * Geocodes a street address to lat/lng via OpenStreetMap Nominatim.
 */
export async function geocodeAddress(address: string): Promise<GeoCoordinates> {
  const query = address.trim();
  if (query.length < 5) {
    throw new GeocodingError("Please enter a complete home address.");
  }

  const url = new URL(`${NOMINATIM_BASE}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new GeocodingError("Unable to look up that address.");
  }

  const results = (await response.json()) as NominatimResult[];

  if (!results?.length) {
    throw new GeocodingError(
      "Could not find that address. Try including city and state."
    );
  }

  const lat = parseFloat(results[0].lat);
  const lng = parseFloat(results[0].lon);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new GeocodingError("Invalid coordinates returned for address.");
  }

  return { lat, lng };
}
