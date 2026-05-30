import { getAirportTrafficAssumption } from "@/lib/airportTraffic";
import {
  calculateLeaveByTime,
  formatArrivalTime,
} from "@/lib/formatDateTime";
import type { Flight } from "@/types/flight";
import type { AirportTrafficLevel } from "@/lib/airportTraffic";

/**
 * Structured context for the AI Arrival Assistant and fallback copy.
 */
export interface ArrivalAssistantContext {
  flightNumber: string;
  airline: string;
  status: string;
  arrivalAirport: string;
  arrivalCode: string;
  scheduledArrivalLocal: string;
  estimatedArrivalLocal: string;
  arriveAtAirportByLocal: string;
  arrivalDelayMinutes: number;
  leaveHomeInMinutes: number;
  bufferMinutes: number;
  airportTrafficLevel: AirportTrafficLevel;
  airportTrafficNote: string;
  extraTrafficMinutes: number;
}

/**
 * Computes arrival delay from API field or scheduled vs estimated times.
 */
export function computeArrivalDelayMinutes(flight: Flight): number {
  if (
    typeof flight.arrivalDelayMinutes === "number" &&
    flight.arrivalDelayMinutes >= 0
  ) {
    return flight.arrivalDelayMinutes;
  }

  const scheduled = new Date(flight.scheduledArrival).getTime();
  const estimated = new Date(flight.estimatedArrival).getTime();
  const diffMinutes = Math.round((estimated - scheduled) / 60_000);

  return Math.max(0, diffMinutes);
}

/**
 * Minutes from now until the user should leave for the airport.
 */
export function computeLeaveHomeInMinutes(
  estimatedArrivalIso: string,
  bufferMinutes: number
): number {
  const arrival = new Date(estimatedArrivalIso).getTime();
  const leaveBy = arrival - bufferMinutes * 60_000;
  const now = Date.now();
  return Math.max(0, Math.round((leaveBy - now) / 60_000));
}

/**
 * Builds analysis context from the current flight record.
 */
export function buildArrivalAssistantContext(flight: Flight): ArrivalAssistantContext {
  const traffic = getAirportTrafficAssumption(flight.arrivalCode);
  const arrivalDelayMinutes = computeArrivalDelayMinutes(flight);
  const bufferMinutes =
    flight.recommendedLeaveBufferMinutes + traffic.extraPickupMinutes;

  return {
    flightNumber: flight.flightNumber,
    airline: flight.airline,
    status: flight.status,
    arrivalAirport: flight.arrivalAirport,
    arrivalCode: flight.arrivalCode,
    scheduledArrivalLocal: formatArrivalTime(flight.scheduledArrival),
    estimatedArrivalLocal: formatArrivalTime(flight.estimatedArrival),
    arriveAtAirportByLocal: calculateLeaveByTime(
      flight.estimatedArrival,
      bufferMinutes
    ),
    arrivalDelayMinutes,
    leaveHomeInMinutes: computeLeaveHomeInMinutes(
      flight.estimatedArrival,
      bufferMinutes
    ),
    bufferMinutes,
    airportTrafficLevel: traffic.level,
    airportTrafficNote: traffic.note,
    extraTrafficMinutes: traffic.extraPickupMinutes,
  };
}
