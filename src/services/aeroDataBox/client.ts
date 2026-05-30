import {
  AERODATABOX_BASE_URL,
  AERODATABOX_HOST,
  AERODATABOX_TIMEOUT_MS,
  getRapidApiKey,
} from "@/services/aeroDataBox/config";
import {
  formatFlightNumberForApi,
  mapAeroDataBoxToFlight,
  selectBestAdbFlight,
} from "@/services/aeroDataBox/mapFlight";
import type {
  AeroDataBoxErrorResponse,
  AeroDataBoxFlightRecord,
} from "@/types/aeroDataBox";
import type { Flight, FlightSearchErrorCode } from "@/types/flight";

export class AeroDataBoxServiceError extends Error {
  constructor(
    message: string,
    public readonly code: FlightSearchErrorCode
  ) {
    super(message);
    this.name = "AeroDataBoxServiceError";
  }
}

/** Local calendar date YYYY-MM-DD */
function getLocalDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseFlightRecords(body: unknown): AeroDataBoxFlightRecord[] {
  if (Array.isArray(body)) return body as AeroDataBoxFlightRecord[];
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.flights)) return obj.flights as AeroDataBoxFlightRecord[];
    if (Array.isArray(obj.data)) return obj.data as AeroDataBoxFlightRecord[];
  }
  return [];
}

async function fetchFlightsForDate(
  apiKey: string,
  formattedNumber: string,
  dateLocal: string
): Promise<AeroDataBoxFlightRecord[]> {
  const encodedNumber = encodeURIComponent(formattedNumber);
  const url = `${AERODATABOX_BASE_URL}/flights/number/${encodedNumber}/${dateLocal}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    AERODATABOX_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": AERODATABOX_HOST,
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (response.status === 404) return [];

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new AeroDataBoxServiceError(
        "Invalid response from flight data service.",
        "API_ERROR"
      );
    }

    if (!response.ok) {
      const err = body as AeroDataBoxErrorResponse;
      const message = err.message ?? err.error ?? `API error (${response.status})`;

      if (response.status === 401 || response.status === 403) {
        throw new AeroDataBoxServiceError(
          "Invalid RAPIDAPI_KEY. Check your .env.local file.",
          "CONFIG_ERROR"
        );
      }

      throw new AeroDataBoxServiceError(message, "API_ERROR");
    }

    return parseFlightRecords(body);
  } catch (err) {
    if (err instanceof AeroDataBoxServiceError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new AeroDataBoxServiceError(
        "Flight lookup timed out. Please try again.",
        "TIMEOUT"
      );
    }
    throw new AeroDataBoxServiceError(
      "Unable to reach AeroDataBox. Please try again.",
      "API_ERROR"
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches live flight data from AeroDataBox by IATA flight number.
 */
export async function fetchFlightFromAeroDataBox(
  normalizedFlightNumber: string
): Promise<Flight> {
  const apiKey = getRapidApiKey();

  if (!apiKey || apiKey === "paste_your_rapidapi_key_here") {
    throw new AeroDataBoxServiceError(
      "Flight data service is not configured. Add RAPIDAPI_KEY to .env.local and restart the dev server.",
      "CONFIG_ERROR"
    );
  }

  const formattedNumber = formatFlightNumberForApi(normalizedFlightNumber);
  const dates = [0, 1, -1].map(getLocalDateString);

  let allRecords: AeroDataBoxFlightRecord[] = [];

  for (const date of dates) {
    const records = await fetchFlightsForDate(apiKey, formattedNumber, date);
    if (records.length) {
      allRecords = records;
      break;
    }
  }

  if (!allRecords.length) {
    throw new AeroDataBoxServiceError(
      `No flight found for "${normalizedFlightNumber}". Check the number and try again.`,
      "NOT_FOUND"
    );
  }

  const best = selectBestAdbFlight(allRecords, normalizedFlightNumber);

  if (!best) {
    throw new AeroDataBoxServiceError(
      `No flight found for "${normalizedFlightNumber}".`,
      "NOT_FOUND"
    );
  }

  return mapAeroDataBoxToFlight(best, normalizedFlightNumber);
}
