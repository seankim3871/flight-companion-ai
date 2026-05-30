import { buildArrivalAssistantContext } from "@/lib/buildArrivalContext";
import {
  getArrivalRecommendation,
  OpenAIServiceError,
} from "@/services/openai";
import type { AIRecommendationResult } from "@/types/ai";
import type { Flight } from "@/types/flight";
import { NextRequest, NextResponse } from "next/server";

function isValidFlightPayload(body: unknown): body is Flight {
  if (!body || typeof body !== "object") return false;
  const f = body as Record<string, unknown>;
  return (
    typeof f.flightNumber === "string" &&
    typeof f.estimatedArrival === "string" &&
    typeof f.scheduledArrival === "string" &&
    typeof f.arrivalCode === "string"
  );
}

/**
 * POST /api/ai/recommendation
 * Body: { flight: Flight }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<AIRecommendationResult>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body.",
        code: "INVALID_INPUT",
      },
      { status: 400 }
    );
  }

  const flight =
    body && typeof body === "object" && "flight" in body
      ? (body as { flight: unknown }).flight
      : body;

  if (!isValidFlightPayload(flight)) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing or invalid flight data.",
        code: "INVALID_INPUT",
      },
      { status: 400 }
    );
  }

  try {
    const context = buildArrivalAssistantContext(flight);
    const result = await getArrivalRecommendation(context);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof OpenAIServiceError) {
      const status = err.code === "TIMEOUT" ? 504 : 502;
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: err.code,
        },
        { status }
      );
    }

    console.error("[api/ai/recommendation]", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate recommendation.",
        code: "API_ERROR",
      },
      { status: 500 }
    );
  }
}
