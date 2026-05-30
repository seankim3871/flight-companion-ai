import { simulateNotification } from "@/services/notifications";
import type { NotificationRequest, NotificationResult } from "@/types/notification";
import { NextRequest, NextResponse } from "next/server";

function isValidRequest(body: unknown): body is NotificationRequest {
  if (!body || typeof body !== "object") return false;
  const r = body as Record<string, unknown>;
  return (
    (r.channel === "email" || r.channel === "sms") &&
    typeof r.recipient === "string" &&
    r.recipient.length >= 3 &&
    typeof r.flightNumber === "string" &&
    typeof r.message === "string"
  );
}

/**
 * POST /api/notifications — simulates email or SMS delivery.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<NotificationResult>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid notification fields." },
      { status: 400 }
    );
  }

  try {
    const notification = await simulateNotification(body);
    return NextResponse.json({ success: true, notification });
  } catch (err) {
    console.error("[api/notifications]", err);
    return NextResponse.json(
      { success: false, error: "Failed to simulate notification." },
      { status: 500 }
    );
  }
}
