import type { ArrivalAssistantContext } from "@/lib/buildArrivalContext";
import { buildFallbackRecommendation } from "@/lib/fallbackRecommendation";
import {
  getOpenAIApiKey,
  getOpenAIModel,
  OPENAI_TIMEOUT_MS,
} from "@/services/openai/config";
import type { AIRecommendationResult } from "@/types/ai";

export class OpenAIServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "CONFIG_ERROR" | "API_ERROR" | "TIMEOUT"
  ) {
    super(message);
    this.name = "OpenAIServiceError";
  }
}

const SYSTEM_PROMPT = `You are the AI Arrival Assistant for Flight Companion AI. You help people pick up arriving passengers at the airport.

Write a warm, concise recommendation in natural language (2–4 short sentences). You MUST include when relevant:
- How many minutes until they should leave home (e.g. "Leave home in 35 minutes.")
- Arrival delay in minutes if delayed (e.g. "Flight is delayed by 22 minutes.")
- When to arrive at the airport (e.g. "You should arrive at the airport at approximately 4:15 PM.")

Consider flight status, delay, and airport traffic assumptions provided. Do not invent flight times — use only the data given. Do not use markdown or bullet lists.`;

function buildUserPrompt(ctx: ArrivalAssistantContext): string {
  return `Analyze this pickup scenario and recommend when to leave and arrive:

Flight: ${ctx.flightNumber} (${ctx.airline})
Status: ${ctx.status}
Arrival airport: ${ctx.arrivalAirport} (${ctx.arrivalCode})
Scheduled arrival: ${ctx.scheduledArrivalLocal}
Estimated arrival: ${ctx.estimatedArrivalLocal}
Arrival delay: ${ctx.arrivalDelayMinutes} minutes
Recommended buffer before estimated arrival: ${ctx.bufferMinutes} minutes (includes traffic adjustment)
Leave home in: ${ctx.leaveHomeInMinutes} minutes from now
Arrive at airport by: ${ctx.arriveAtAirportByLocal}
Airport traffic level: ${ctx.airportTrafficLevel}
Traffic assumption: ${ctx.airportTrafficNote}`;
}

/**
 * Calls OpenAI Chat Completions to generate a pickup recommendation.
 */
export async function generateArrivalRecommendation(
  context: ArrivalAssistantContext
): Promise<AIRecommendationResult> {
  const apiKey = getOpenAIApiKey();

  if (!apiKey) {
    return {
      success: true,
      recommendation: buildFallbackRecommendation(context),
      fallback: true,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getOpenAIModel(),
        temperature: 0.6,
        max_tokens: 280,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(context) },
        ],
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("[openai] API error", response.status, errText);
      throw new OpenAIServiceError(
        "Unable to generate AI recommendation.",
        "API_ERROR"
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new OpenAIServiceError("Empty response from AI service.", "API_ERROR");
    }

    return {
      success: true,
      recommendation: content,
      fallback: false,
    };
  } catch (err) {
    if (err instanceof OpenAIServiceError) throw err;

    if (err instanceof Error && err.name === "AbortError") {
      throw new OpenAIServiceError(
        "AI recommendation timed out. Please try again.",
        "TIMEOUT"
      );
    }

    console.error("[openai]", err);
    throw new OpenAIServiceError(
      "Unable to reach the AI service.",
      "API_ERROR"
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generates recommendation with OpenAI, falling back to local copy on failure.
 */
export async function getArrivalRecommendation(
  context: ArrivalAssistantContext
): Promise<AIRecommendationResult> {
  try {
    return await generateArrivalRecommendation(context);
  } catch {
    return {
      success: true,
      recommendation: buildFallbackRecommendation(context),
      fallback: true,
    };
  }
}
