import { calculatePickupPlan } from "@/lib/calculatePickupPlan";
import { getAirportCoordinates } from "@/lib/airportCoordinates";
import { geocodeAddress, GeocodingError } from "@/services/geocoding/nominatim";
import { getDrivingMinutes, RoutingError } from "@/services/routing/osrm";
import type { Flight } from "@/types/flight";
import type { PickupPlan, PickupPlanErrorCode } from "@/types/pickupPlan";
import type { GeoCoordinates } from "@/types/map";
import { getAirportTrafficAssumption } from "@/lib/airportTraffic";

export class PickupPlanningError extends Error {
  constructor(
    message: string,
    public readonly code: PickupPlanErrorCode
  ) {
    super(message);
    this.name = "PickupPlanningError";
  }
}

/**
 * Resolves arrival airport coordinates from flight map or local airport data.
 */
function resolveArrivalCoordinates(flight: Flight): GeoCoordinates {
  if (flight.map?.arrival) {
    return {
      lat: flight.map.arrival.lat,
      lng: flight.map.arrival.lng,
    };
  }

  const coords = getAirportCoordinates(flight.arrivalCode);

  if (!coords) {
    throw new PickupPlanningError(
      `Could not locate airport ${flight.arrivalCode} for routing.`,
      "AIRPORT_COORDS_MISSING"
    );
  }

  return coords;
}

/**
 * Full pickup plan: geocode home, route to airport, compute schedule.
 */
export async function createPickupPlan(
  flight: Flight,
  homeAddress: string
): Promise<PickupPlan> {
  const address = homeAddress.trim();

  if (address.length < 5) {
    throw new PickupPlanningError(
      "Please enter your full home address (street, city, state).",
      "INVALID_INPUT"
    );
  }

  let homeCoords: GeoCoordinates;
  const airportCoords = resolveArrivalCoordinates(flight);

  try {
    homeCoords = await geocodeAddress(address);
  } catch (err) {
    if (err instanceof GeocodingError) {
      throw new PickupPlanningError(err.message, "GEOCODE_FAILED");
    }
    throw new PickupPlanningError(
      "Failed to resolve locations for pickup planning.",
      "API_ERROR"
    );
  }

  const traffic = getAirportTrafficAssumption(flight.arrivalCode);

  let driveMinutes: number;
  try {
    driveMinutes = await getDrivingMinutes(
      homeCoords,
      airportCoords,
      traffic.level
    );
  } catch (err) {
    const message =
      err instanceof RoutingError
        ? err.message
        : "Unable to calculate drive time to the airport.";
    throw new PickupPlanningError(message, "ROUTING_FAILED");
  }

  return calculatePickupPlan(flight, address, driveMinutes);
}
