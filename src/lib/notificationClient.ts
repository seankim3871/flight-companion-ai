import type { NotificationRequest, NotificationResult } from "@/types/notification";

/**
 * Sends a simulated email or SMS via the API route.
 */
export async function sendSimulatedNotification(
  request: NotificationRequest
): Promise<NotificationResult> {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data = (await response.json()) as NotificationResult;

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? "Notification failed.",
      };
    }

    return data;
  } catch {
    return {
      success: false,
      error: "Could not reach notification service.",
    };
  }
}
