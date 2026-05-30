/**
 * Airport traffic assumptions for arrival pickup planning.
 * Used by the AI assistant when estimating curbside and parking delays.
 */

export type AirportTrafficLevel = "light" | "moderate" | "heavy";

export interface AirportTrafficAssumption {
  level: AirportTrafficLevel;
  /** Human-readable note passed to the AI */
  note: string;
  /** Extra minutes added to curbside pickup at busy airports */
  extraPickupMinutes: number;
}

/** Major hubs with consistently heavy terminal traffic */
const HEAVY_TRAFFIC_AIRPORTS = new Set([
  "ATL",
  "LAX",
  "ORD",
  "DFW",
  "DEN",
  "JFK",
  "SFO",
  "LAS",
  "MCO",
  "EWR",
  "MIA",
  "SEA",
  "CLT",
  "PHX",
  "IAH",
  "BOS",
  "LGA",
  "MSP",
  "DTW",
  "FLL",
]);

/** Busy regional / international gateways */
const MODERATE_TRAFFIC_AIRPORTS = new Set([
  "ICN",
  "SAN",
  "PDX",
  "SLC",
  "BWI",
  "DCA",
  "IAD",
  "PHL",
  "TPA",
  "AUS",
  "RDU",
  "STL",
  "HNL",
]);

/**
 * Returns traffic assumptions for an arrival airport IATA code.
 */
export function getAirportTrafficAssumption(
  arrivalCode: string
): AirportTrafficAssumption {
  const code = arrivalCode.trim().toUpperCase();

  if (HEAVY_TRAFFIC_AIRPORTS.has(code)) {
    return {
      level: "heavy",
      note: `${code} is a high-volume hub — expect longer curbside loops, parking shuttle waits, and terminal congestion around peak arrivals.`,
      extraPickupMinutes: 15,
    };
  }

  if (MODERATE_TRAFFIC_AIRPORTS.has(code)) {
    return {
      level: "moderate",
      note: `${code} typically has moderate arrival traffic — allow a few extra minutes for baggage claim exit and curbside pickup.`,
      extraPickupMinutes: 8,
    };
  }

  return {
    level: "light",
    note: `${code} usually has lighter curbside traffic — standard pickup timing should be sufficient unless local events are occurring.`,
    extraPickupMinutes: 0,
  };
}
