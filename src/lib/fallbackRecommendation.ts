import type { ArrivalAssistantContext } from "@/lib/buildArrivalContext";

/**
 * Rule-based natural language when OpenAI is unavailable.
 */
export function buildFallbackRecommendation(
  ctx: ArrivalAssistantContext
): string {
  const sentences: string[] = [];

  if (ctx.leaveHomeInMinutes <= 0) {
    sentences.push(
      `You should head to ${ctx.arrivalCode} now to meet flight ${ctx.flightNumber} — you're inside the recommended departure window.`
    );
  } else {
    sentences.push(`Leave home in ${ctx.leaveHomeInMinutes} minutes.`);
  }

  if (ctx.arrivalDelayMinutes > 0) {
    sentences.push(
      `Flight is delayed by ${ctx.arrivalDelayMinutes} minute${ctx.arrivalDelayMinutes === 1 ? "" : "s"}.`
    );
  } else if (ctx.status === "On Time" || ctx.status === "Scheduled") {
    sentences.push(`Flight ${ctx.flightNumber} is currently ${ctx.status.toLowerCase()}.`);
  } else {
    sentences.push(`Current status: ${ctx.status}.`);
  }

  const arriveTime =
    ctx.arriveAtAirportByLocal.split(",").pop()?.trim() ??
    ctx.arriveAtAirportByLocal;
  sentences.push(
    `You should arrive at the airport at approximately ${arriveTime} to account for ${ctx.airportTrafficLevel} traffic at ${ctx.arrivalCode}.`
  );

  return sentences.join(" ");
}
