import type { FlightMapData } from "@/types/map";

/**
 * Flight status values used across the app.
 * Mirrors common airline / FAA status labels.
 */
export type FlightStatus =
  | "Scheduled"
  | "On Time"
  | "Delayed"
  | "Boarding"
  | "Departed"
  | "In Air"
  | "Landed"
  | "Cancelled";

/**
 * Core flight record returned from search.
 */
export interface Flight {
  /** Display name, e.g. "Delta Air Lines" */
  airline: string;
  /** IATA-style flight number, e.g. "DL123" */
  flightNumber: string;
  /** Departure airport name and code */
  departureAirport: string;
  departureCode: string;
  /** Arrival airport name and code */
  arrivalAirport: string;
  arrivalCode: string;
  /** ISO 8601 scheduled arrival */
  scheduledArrival: string;
  /** ISO 8601 estimated arrival (may differ when delayed) */
  estimatedArrival: string;
  status: FlightStatus;
  /** Reported or computed arrival delay in minutes */
  arrivalDelayMinutes?: number;
  /** Minutes to add for typical drive + parking + terminal walk */
  recommendedLeaveBufferMinutes: number;
  /** Live map markers and route (when coordinates are available) */
  map?: FlightMapData;
}

/** Machine-readable search error codes for client handling */
export type FlightSearchErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "TIMEOUT"
  | "API_ERROR"
  | "CONFIG_ERROR";

/**
 * Result wrapper for flight search operations.
 */
export interface FlightSearchResult {
  success: boolean;
  flight?: Flight;
  error?: string;
  code?: FlightSearchErrorCode;
}
