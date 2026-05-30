import type { AIRecommendationResult } from "@/types/ai";
import type { Flight } from "@/types/flight";

const CLIENT_TIMEOUT_MS = 25_000;

/**
 * Fetches an AI pickup recommendation for the given flight.
 */
export async function fetchAIRecommendation(
  flight: Flight
): Promise<AIRecommendationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const response = await fetch("/api/ai/recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flight }),
      signal: controller.signal,
    });

    const data = (await response.json()) as AIRecommendationResult;

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? "Unable to get AI recommendation.",
        code: data.code,
      };
    }

    return data;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: "AI recommendation timed out.",
        code: "TIMEOUT",
      };
    }
    return {
      success: false,
      error: "Could not reach the AI assistant.",
      code: "API_ERROR",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
