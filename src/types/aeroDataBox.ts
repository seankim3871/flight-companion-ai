/**
 * AeroDataBox API response types (RapidAPI).
 * @see https://rapidapi.com/aedbx-aedbx/api/aerodatabox
 */

export interface AeroDataBoxTime {
  utc?: string;
  local?: string;
}

export interface AeroDataBoxAirport {
  name?: string;
  iata?: string;
  icao?: string;
  location?: {
    lat?: number;
    lon?: number;
  };
}

export interface AeroDataBoxAirline {
  name?: string;
  iata?: string;
  icao?: string;
}

export interface AeroDataBoxMovement {
  airport?: AeroDataBoxAirport;
  scheduledTime?: AeroDataBoxTime;
  scheduledTimeLocal?: string;
  revisedTime?: AeroDataBoxTime;
  predictedTime?: AeroDataBoxTime;
  actualTime?: AeroDataBoxTime;
  actualTimeLocal?: string;
  terminal?: string;
  gate?: string;
  delay?: number;
}

export interface AeroDataBoxFlightRecord {
  number?: string;
  status?: string;
  airline?: AeroDataBoxAirline;
  departure?: AeroDataBoxMovement;
  arrival?: AeroDataBoxMovement;
  lastUpdatedUtc?: string;
}

export interface AeroDataBoxErrorResponse {
  message?: string;
  error?: string;
}
