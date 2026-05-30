/**
 * Pickup Planning Mode — calculated schedule from home to airport.
 */

export type PickupPlanErrorCode =
  | "INVALID_INPUT"
  | "GEOCODE_FAILED"
  | "ROUTING_FAILED"
  | "AIRPORT_COORDS_MISSING"
  | "API_ERROR";

import type { AirportWeather } from "@/types/weather";

export type PickupRecommendationIcon =
  | "curbside"
  | "terminal"
  | "waiting"
  | "parking"
  | "weather"
  | "traffic"
  | "tip"
  | "delay"
  | "avoid";

export interface PickupRecommendation {
  title: string;
  detail: string;
  icon: PickupRecommendationIcon;
}

export interface PickupPlanHeadlines {
  leaveHome: string;
  arriveAirport: string;
  flightExpected: string;
  safetyBuffer: string;
}

/** Full pickup schedule with human-readable copy */
export interface PickupPlan {
  homeAddress: string;
  arrivalAirport: string;
  arrivalCode: string;
  /** Driving time from home to airport (minutes) */
  driveMinutes: number;
  /** Minutes at airport before flight lands */
  safetyBufferMinutes: number;
  /** Extra buffer from weather conditions */
  weatherBufferMinutes: number;
  /** Total minutes from leaving home until flight lands */
  totalTripMinutes: number;
  flightExpectedAt: string;
  arriveAtAirportBy: string;
  leaveHomeAt: string;
  leaveHomeAtDisplay: string;
  arriveAtAirportDisplay: string;
  flightExpectedDisplay: string;
  headlines: PickupPlanHeadlines;
  recommendation: string;
  /** Primary suggested action for this pickup */
  suggestedAction: string;
  /** Detailed airport pickup tips */
  recommendations: PickupRecommendation[];
  /** Mock weather at arrival airport */
  weather: AirportWeather;
  airportTrafficLevel: string;
}

export interface PickupPlanResult {
  success: boolean;
  plan?: PickupPlan;
  error?: string;
  code?: PickupPlanErrorCode;
}
