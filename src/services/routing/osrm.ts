import type { GeoCoordinates } from "@/types/map";
import type { AirportTrafficLevel } from "@/lib/airportTraffic";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

export class RoutingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoutingError";
  }
}

/** Traffic multiplier applied to base drive time */
const TRAFFIC_MULTIPLIER: Record<AirportTrafficLevel, number> = {
  light: 1.08,
  moderate: 1.15,
  heavy: 1.28,
};

interface OsrmRouteResponse {
  routes?: Array<{ duration: number; distance: number }>;
  code?: string;
}

/**
 * Driving duration in minutes from origin to destination (OSRM).
 */
export async function getDrivingMinutes(
  origin: GeoCoordinates,
  destination: GeoCoordinates,
  trafficLevel: AirportTrafficLevel = "moderate"
): Promise<number> {
  const coordPath = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `${OSRM_BASE}/${coordPath}?overview=false`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new RoutingError("Unable to calculate driving route.");
  }

  const data = (await response.json()) as OsrmRouteResponse;

  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new RoutingError("No driving route found between home and airport.");
  }

  const baseMinutes = Math.ceil(data.routes[0].duration / 60);
  const multiplier = TRAFFIC_MULTIPLIER[trafficLevel];

  return Math.max(5, Math.ceil(baseMinutes * multiplier));
}
