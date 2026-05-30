import { getAirportCoordinates } from "@/lib/airportCoordinates";
import { buildFlightMapData } from "@/lib/buildFlightMapData";
import type { AeroDataBoxFlightRecord } from "@/types/aeroDataBox";
import type { Flight, FlightStatus } from "@/types/flight";
import type { GeoCoordinates } from "@/types/map";

const DEFAULT_BUFFER_MINUTES = 75;

/**
 * Formats normalized flight number for AeroDataBox (e.g. DL123 → "DL 123").
 */
export function formatFlightNumberForApi(normalized: string): string {
  const match = normalized.match(/^([A-Z]{2,3})(\d{1,4})$/);
  if (match) return `${match[1]} ${match[2]}`;
  return normalized;
}

function readTimeIso(
  movement: AeroDataBoxFlightRecord["arrival"] | undefined,
  kind: "scheduled" | "estimated" | "actual" = "scheduled"
): string | null {
  if (!movement) return null;

  if (kind === "scheduled") {
    return (
      movement.scheduledTime?.utc ??
      movement.scheduledTime?.local ??
      movement.scheduledTimeLocal ??
      null
    );
  }

  if (kind === "actual") {
    return (
      movement.actualTime?.utc ??
      movement.actualTime?.local ??
      movement.actualTimeLocal ??
      null
    );
  }

  return (
    movement.revisedTime?.utc ??
    movement.predictedTime?.utc ??
    movement.revisedTime?.local ??
    movement.predictedTime?.local ??
    movement.scheduledTime?.utc ??
    movement.scheduledTime?.local ??
    movement.scheduledTimeLocal ??
    null
  );
}

function ensureIso(value: string): string {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return value;
}

function computeDelayMinutes(scheduled: string, estimated: string): number {
  const diff = new Date(estimated).getTime() - new Date(scheduled).getTime();
  return Math.max(0, Math.round(diff / 60_000));
}

/**
 * Maps AeroDataBox status strings to app status labels.
 */
export function mapAdbStatusToFlightStatus(
  adbStatus: string | undefined,
  delayMinutes: number
): FlightStatus {
  const status = (adbStatus ?? "").toLowerCase();

  if (status.includes("cancel")) return "Cancelled";
  if (status.includes("land") || status.includes("arriv")) return "Landed";
  if (status.includes("enroute") || status.includes("en-route") || status === "active")
    return delayMinutes > 15 ? "Delayed" : "In Air";
  if (status.includes("depart") || status.includes("board")) return "Departed";
  if (status.includes("delay")) return "Delayed";
  if (status.includes("expected") || status.includes("sched")) {
    return delayMinutes > 0 ? "Delayed" : "On Time";
  }

  return delayMinutes > 0 ? "Delayed" : "Scheduled";
}

function resolveCoords(
  movement: AeroDataBoxFlightRecord["departure"],
  iataCode: string
): GeoCoordinates | null {
  const lat = movement?.airport?.location?.lat;
  const lon = movement?.airport?.location?.lon;
  if (typeof lat === "number" && typeof lon === "number") {
    return { lat, lng: lon };
  }
  return getAirportCoordinates(iataCode);
}

/**
 * Picks the most relevant leg when AeroDataBox returns multiple records.
 */
export function selectBestAdbFlight(
  records: AeroDataBoxFlightRecord[],
  normalizedFlightNumber: string
): AeroDataBoxFlightRecord | null {
  if (!records.length) return null;

  const compact = normalizedFlightNumber.replace(/\s/g, "");

  const matches = records.filter((r) => {
    const num = (r.number ?? "").replace(/\s/g, "").toUpperCase();
    return num === compact || num.includes(compact);
  });

  const pool = matches.length ? matches : records;

  const priority = ["active", "enroute", "departed", "expected", "scheduled", "landed", "cancelled"];
  for (const key of priority) {
    const found = pool.find((r) => (r.status ?? "").toLowerCase().includes(key));
    if (found) return found;
  }

  return pool[0] ?? null;
}

/**
 * Converts an AeroDataBox record into the app's Flight model.
 */
export function mapAeroDataBoxToFlight(
  record: AeroDataBoxFlightRecord,
  normalizedFlightNumber: string
): Flight {
  const scheduledArrivalRaw =
    readTimeIso(record.arrival, "scheduled") ?? new Date().toISOString();
  const estimatedArrivalRaw =
    readTimeIso(record.arrival, "estimated") ??
    readTimeIso(record.arrival, "actual") ??
    scheduledArrivalRaw;

  const scheduledArrival = ensureIso(scheduledArrivalRaw);
  const estimatedArrival = ensureIso(estimatedArrivalRaw);
  const arrivalDelay =
    record.arrival?.delay ??
    computeDelayMinutes(scheduledArrival, estimatedArrival);

  const status = mapAdbStatusToFlightStatus(record.status, arrivalDelay);
  const buffer =
    DEFAULT_BUFFER_MINUTES + (arrivalDelay > 0 ? Math.min(arrivalDelay, 30) : 0);

  const departureCode = record.departure?.airport?.iata ?? "—";
  const arrivalCode = record.arrival?.airport?.iata ?? "—";

  const flightNumber =
    record.number?.replace(/\s/g, "").toUpperCase() ?? normalizedFlightNumber;

  const partialFlight: Flight = {
    airline: record.airline?.name ?? "Unknown Airline",
    flightNumber,
    departureAirport: record.departure?.airport?.name ?? "Unknown Airport",
    departureCode,
    arrivalAirport: record.arrival?.airport?.name ?? "Unknown Airport",
    arrivalCode,
    scheduledArrival,
    estimatedArrival,
    status,
    arrivalDelayMinutes: arrivalDelay,
    recommendedLeaveBufferMinutes: buffer,
  };

  const depCoords = resolveCoords(record.departure, departureCode);
  const arrCoords = resolveCoords(record.arrival, arrivalCode);

  let map;
  if (depCoords && arrCoords) {
    map = buildFlightMapData(partialFlight, depCoords, arrCoords);
  }

  return { ...partialFlight, map };
}
