import type { Flight, FlightStatus } from "@/types/flight";
import type { FlightMapData, GeoCoordinates, MapMarkerPoint } from "@/types/map";

/**
 * Linear interpolation between two coordinates (simple en-route estimate).
 */
export function interpolateCoordinates(
  from: GeoCoordinates,
  to: GeoCoordinates,
  t: number
): GeoCoordinates {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

/**
 * Resolves aircraft position from status and optional override coordinates.
 */
export function resolveAircraftPosition(
  status: FlightStatus,
  departure: GeoCoordinates,
  arrival: GeoCoordinates,
  options?: {
    aircraftPosition?: GeoCoordinates;
    routeProgress?: number;
  }
): GeoCoordinates | null {
  if (options?.aircraftPosition) {
    return options.aircraftPosition;
  }

  const progress = options?.routeProgress ?? 0.55;

  if (status === "Landed" || status === "Cancelled") {
    return arrival;
  }

  if (
    status === "Scheduled" ||
    status === "On Time" ||
    status === "Boarding" ||
    status === "Departed"
  ) {
    return interpolateCoordinates(departure, arrival, 0.15);
  }

  if (status === "In Air" || status === "Delayed") {
    return interpolateCoordinates(departure, arrival, progress);
  }

  return interpolateCoordinates(departure, arrival, 0.5);
}

/**
 * Builds map markers, path polyline, and center point for Leaflet.
 */
export function buildFlightMapData(
  flight: Flight,
  departureCoords: GeoCoordinates,
  arrivalCoords: GeoCoordinates,
  options?: {
    aircraftPosition?: GeoCoordinates;
    routeProgress?: number;
  }
): FlightMapData {
  const departure: MapMarkerPoint = {
    ...departureCoords,
    label: flight.departureAirport,
    code: flight.departureCode,
  };

  const arrival: MapMarkerPoint = {
    ...arrivalCoords,
    label: flight.arrivalAirport,
    code: flight.arrivalCode,
  };

  const aircraftCoords = resolveAircraftPosition(
    flight.status,
    departureCoords,
    arrivalCoords,
    options
  );

  const aircraft: MapMarkerPoint | null = aircraftCoords
    ? {
        ...aircraftCoords,
        label: "Aircraft",
        code: flight.flightNumber,
      }
    : null;

  const path: [number, number][] = aircraft
    ? [
        [departure.lat, departure.lng],
        [aircraft.lat, aircraft.lng],
        [arrival.lat, arrival.lng],
      ]
    : [
        [departure.lat, departure.lng],
        [arrival.lat, arrival.lng],
      ];

  const center = aircraft ?? interpolateCoordinates(departureCoords, arrivalCoords, 0.5);

  return {
    departure,
    arrival,
    aircraft,
    path,
    center,
  };
}
