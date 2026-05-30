import {
  createPickupPlan,
  PickupPlanningError,
} from "@/services/pickupPlanning";
import type { PickupPlanResult } from "@/types/pickupPlan";
import type { Flight } from "@/types/flight";
import { NextRequest, NextResponse } from "next/server";

function isValidFlight(body: unknown): body is Flight {
  if (!body || typeof body !== "object") return false;
  const f = body as Record<string, unknown>;
  return (
    typeof f.flightNumber === "string" &&
    typeof f.estimatedArrival === "string" &&
    typeof f.arrivalCode === "string"
  );
}

/**
 * POST /api/pickup-plan
 * Body: { flight: Flight, homeAddress: string }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<PickupPlanResult>> {
  let body: { flight?: unknown; homeAddress?: string };

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

  if (!isValidFlight(body.flight)) {
    return NextResponse.json(
      {
        success: false,
        error: "Valid flight data is required.",
        code: "INVALID_INPUT",
      },
      { status: 400 }
    );
  }

  const homeAddress = typeof body.homeAddress === "string" ? body.homeAddress : "";

  try {
    const plan = await createPickupPlan(body.flight, homeAddress);
    return NextResponse.json({ success: true, plan });
  } catch (err) {
    if (err instanceof PickupPlanningError) {
      const status =
        err.code === "INVALID_INPUT"
          ? 400
          : err.code === "GEOCODE_FAILED" || err.code === "ROUTING_FAILED"
            ? 422
            : 502;

      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: err.code,
        },
        { status }
      );
    }

    console.error("[api/pickup-plan]", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create pickup plan.",
        code: "API_ERROR",
      },
      { status: 500 }
    );
  }
}
