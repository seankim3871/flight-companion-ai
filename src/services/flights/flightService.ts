import {
  getInvalidFlightNumberMessage,
  isValidFlightNumber,
  normalizeFlightNumber,
} from "@/lib/flightSearch";
import {
  AeroDataBoxServiceError,
  fetchFlightFromAeroDataBox,
} from "@/services/aeroDataBox";
import type { FlightSearchErrorCode, FlightSearchResult } from "@/types/flight";

export { AeroDataBoxServiceError };

/**
 * Searches live flight data via AeroDataBox (RapidAPI).
 */
export async function searchFlight(
  rawInput: string
): Promise<FlightSearchResult> {
  const query = normalizeFlightNumber(rawInput);

  if (!query) {
    return {
      success: false,
      error: "Please enter a flight number.",
      code: "INVALID_INPUT",
    };
  }

  if (!isValidFlightNumber(query)) {
    return {
      success: false,
      error: getInvalidFlightNumberMessage(rawInput),
      code: "INVALID_INPUT",
    };
  }

  try {
    const flight = await fetchFlightFromAeroDataBox(query);
    return { success: true, flight };
  } catch (err) {
    if (err instanceof AeroDataBoxServiceError) {
      return {
        success: false,
        error: err.message,
        code: err.code,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred while fetching flight data.",
      code: "API_ERROR",
    };
  }
}
