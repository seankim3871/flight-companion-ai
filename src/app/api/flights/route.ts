import {
  getInvalidFlightNumberMessage,
  isValidFlightNumber,
  normalizeFlightNumber,
} from "@/lib/flightSearch";
import {
  AeroDataBoxServiceError,
  searchFlight,
} from "@/services/flights";
import type { FlightSearchErrorCode, FlightSearchResult } from "@/types/flight";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/flights?flightNumber=DL123
 * Returns live flight data from AeroDataBox (RapidAPI).
 */
export async function GET(request: NextRequest): Promise<NextResponse<FlightSearchResult>> {
  const raw = request.nextUrl.searchParams.get("flightNumber") ?? "";

  if (!raw.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: "Please enter a flight number.",
        code: "INVALID_INPUT" satisfies FlightSearchErrorCode,
      },
      { status: 400 }
    );
  }

  if (!isValidFlightNumber(raw)) {
    return NextResponse.json(
      {
        success: false,
        error: getInvalidFlightNumberMessage(raw),
        code: "INVALID_INPUT" satisfies FlightSearchErrorCode,
      },
      { status: 400 }
    );
  }

  const flightNumber = normalizeFlightNumber(raw);
  const result = await searchFlight(flightNumber);

  if (!result.success) {
    const code = result.code ?? "API_ERROR";
    const status =
      code === "NOT_FOUND"
        ? 404
        : code === "TIMEOUT"
          ? 504
          : code === "CONFIG_ERROR"
            ? 503
            : code === "INVALID_INPUT"
              ? 400
              : 502;

    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
