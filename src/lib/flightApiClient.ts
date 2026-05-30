import {
  getInvalidFlightNumberMessage,
  isValidFlightNumber,
  normalizeFlightNumber,
} from "@/lib/flightSearch";
import type { FlightSearchResult } from "@/types/flight";

/** Client-side timeout (slightly above server timeout) */
const CLIENT_TIMEOUT_MS = 15_000;

/**
 * Calls the Next.js API route to search live flight data.
 */
export async function searchFlightViaApi(
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({ flightNumber: query });
    const response = await fetch(`/api/flights?${params.toString()}`, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    const data = (await response.json()) as FlightSearchResult;

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? "Unable to fetch flight information.",
        code: data.code ?? "API_ERROR",
      };
    }

    return data;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: "Request timed out. Please try again.",
        code: "TIMEOUT",
      };
    }
    return {
      success: false,
      error: "Network error. Check your connection and try again.",
      code: "API_ERROR",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
