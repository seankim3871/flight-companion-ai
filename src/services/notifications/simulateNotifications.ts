import { formatTimeOnly } from "@/lib/formatDateTime";
import type { NotificationRequest, SimulatedNotification } from "@/types/notification";

/**
 * Simulates network delay for email/SMS delivery.
 */
function simulateDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

function buildEmailSubject(flightNumber: string): string {
  return `Flight Companion AI — Pickup reminder for ${flightNumber}`;
}

function buildSmsBody(flightNumber: string, message: string): string {
  return `Flight Companion: ${flightNumber} — ${message.slice(0, 140)}`;
}

/**
 * Simulates sending an email or SMS notification (mock — no real delivery).
 */
export async function simulateNotification(
  request: NotificationRequest
): Promise<SimulatedNotification> {
  await simulateDelay();

  const now = new Date().toISOString();
  const isScheduled =
    request.scheduledFor && new Date(request.scheduledFor).getTime() > Date.now();

  const notification: SimulatedNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    channel: request.channel,
    recipient: request.recipient,
    subject:
      request.channel === "email"
        ? request.subject ?? buildEmailSubject(request.flightNumber)
        : undefined,
    message:
      request.channel === "sms"
        ? buildSmsBody(request.flightNumber, request.message)
        : request.message,
    flightNumber: request.flightNumber.toUpperCase(),
    status: isScheduled ? "scheduled" : "sent",
    sentAt: now,
    scheduledFor: request.scheduledFor,
  };

  return notification;
}

/**
 * Builds default email body for a pickup reminder.
 */
export function buildPickupEmailBody(params: {
  flightNumber: string;
  leaveHomeAt: string;
  arriveAtAirportBy: string;
  flightExpectedAt: string;
  homeAddress: string;
  arrivalCode: string;
}): string {
  return [
    `Hi there,`,
    ``,
    `Your pickup reminder for flight ${params.flightNumber}:`,
    ``,
    `• Leave home at ${formatTimeOnly(params.leaveHomeAt)}`,
    `• Arrive at ${params.arrivalCode} by ${formatTimeOnly(params.arriveAtAirportBy)}`,
    `• Flight expected at ${formatTimeOnly(params.flightExpectedAt)}`,
    ``,
    `From: ${params.homeAddress}`,
    ``,
    `— Flight Companion AI (simulated email)`,
  ].join("\n");
}

/**
 * Builds default SMS reminder text.
 */
export function buildPickupSmsBody(params: {
  flightNumber: string;
  leaveHomeAt: string;
  arrivalCode: string;
}): string {
  return `Leave at ${formatTimeOnly(params.leaveHomeAt)} for ${params.flightNumber} pickup at ${params.arrivalCode}.`;
}
