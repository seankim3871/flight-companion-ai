import type { GeoCoordinates } from "@/types/map";

/**
 * Airport coordinates for maps, routing, and pickup planning (no external API).
 * Keys are IATA codes (uppercase).
 */
export const AIRPORT_COORDINATES_FALLBACK: Record<string, GeoCoordinates> = {
  ATL: { lat: 33.6407, lng: -84.4277 },
  LAX: { lat: 33.9425, lng: -118.4081 },
  ICN: { lat: 37.4602, lng: 126.4407 },
  SFO: { lat: 37.6213, lng: -122.379 },
  DFW: { lat: 32.8998, lng: -97.0403 },
  ORD: { lat: 41.9742, lng: -87.9073 },
  EWR: { lat: 40.6895, lng: -74.1745 },
  MIA: { lat: 25.7959, lng: -80.287 },
  BOS: { lat: 42.3656, lng: -71.0096 },
  FLL: { lat: 26.0742, lng: -80.1506 },
  JFK: { lat: 40.6413, lng: -73.7781 },
  SEA: { lat: 47.4502, lng: -122.3088 },
  DEN: { lat: 39.8561, lng: -104.6737 },
  LAS: { lat: 36.084, lng: -115.1537 },
  PHX: { lat: 33.4373, lng: -112.0078 },
};
