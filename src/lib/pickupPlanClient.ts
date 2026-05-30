import type { PickupPlanResult } from "@/types/pickupPlan";
import type { Flight } from "@/types/flight";

const CLIENT_TIMEOUT_MS = 30_000;

/**
 * Requests a pickup plan for a flight and home address.
 */
export async function fetchPickupPlan(
  flight: Flight,
  homeAddress: string
): Promise<PickupPlanResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/pickup-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flight, homeAddress }),
      signal: controller.signal,
    });

    const data = (await response.json()) as PickupPlanResult;

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? "Unable to build pickup plan.",
        code: data.code,
      };
    }

    return data;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: "Pickup planning timed out. Please try again.",
        code: "API_ERROR",
      };
    }
    return {
      success: false,
      error: "Could not reach pickup planning service.",
      code: "API_ERROR",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
