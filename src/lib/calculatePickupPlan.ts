import { getAirportPickupGuide } from "@/data/mockAirportPickup";
import {
  getMockAirportWeather,
  getWeatherBufferMinutes,
} from "@/data/mockAirportWeather";
import { getAirportTrafficAssumption } from "@/lib/airportTraffic";
import { formatTimeOnly } from "@/lib/formatDateTime";
import type { Flight } from "@/types/flight";
import type { PickupPlan, PickupRecommendation } from "@/types/pickupPlan";
import type { AirportWeather } from "@/types/weather";

/** Base curbside wait before flight lands */
export const BASE_SAFETY_BUFFER_MINUTES = 20;

/**
 * Builds natural-language headlines for the pickup dashboard.
 */
export function buildPickupHeadlines(
  leaveHomeAt: string,
  arriveAtAirportBy: string,
  flightExpectedAt: string,
  safetyBufferMinutes: number
) {
  return {
    leaveHome: `Leave home at ${formatTimeOnly(leaveHomeAt)}.`,
    arriveAirport: `You will arrive at the airport by ${formatTimeOnly(arriveAtAirportBy)}.`,
    flightExpected: `Flight is expected at ${formatTimeOnly(flightExpectedAt)}.`,
    safetyBuffer: `You have a ${safetyBufferMinutes}-minute safety buffer.`,
  };
}

/**
 * Builds actionable pickup recommendations from mock airport + weather data.
 */
export function buildPickupRecommendations(
  flight: Flight,
  weather: AirportWeather,
  driveMinutes: number
): PickupRecommendation[] {
  const guide = getAirportPickupGuide(flight.arrivalCode);
  const traffic = getAirportTrafficAssumption(flight.arrivalCode);

  const recommendations: PickupRecommendation[] = [
    {
      title: "Best curbside zone",
      detail: guide.curbsideZone,
      icon: "curbside",
    },
    {
      title: "Terminal",
      detail: guide.terminal,
      icon: "terminal",
    },
    {
      title: "Where to wait",
      detail: guide.cellPhoneLot,
      icon: "waiting",
    },
    {
      title: "Parking option",
      detail: guide.parkingTip,
      icon: "parking",
    },
    {
      title: "Weather tip",
      detail: weather.summary,
      icon: "weather",
    },
    {
      title: "Traffic note",
      detail: traffic.note,
      icon: "traffic",
    },
    {
      title: "Pro tip",
      detail: guide.bestPractice,
      icon: "tip",
    },
  ];

  if (flight.arrivalDelayMinutes && flight.arrivalDelayMinutes > 0) {
    recommendations.unshift({
      title: "Delay adjustment",
      detail: `Flight is ${flight.arrivalDelayMinutes} min delayed — you can leave home ~${Math.min(flight.arrivalDelayMinutes, driveMinutes)} min later, but keep your buffer.`,
      icon: "delay",
    });
  }

  if (weather.pickupImpact !== "none") {
    recommendations.push({
      title: "Avoid",
      detail: guide.avoidTip,
      icon: "avoid",
    });
  }

  return recommendations;
}

/**
 * Calculates leave-home and airport arrival times from drive time and flight ETA.
 */
export function calculatePickupPlan(
  flight: Flight,
  homeAddress: string,
  driveMinutes: number
): PickupPlan {
  const traffic = getAirportTrafficAssumption(flight.arrivalCode);
  const weather = getMockAirportWeather(flight.arrivalCode, flight.arrivalAirport);
  const weatherBuffer = getWeatherBufferMinutes(weather);

  const safetyBufferMinutes =
    BASE_SAFETY_BUFFER_MINUTES +
    traffic.extraPickupMinutes +
    weatherBuffer;

  const flightExpectedAt = flight.estimatedArrival;
  const flightExpectedMs = new Date(flightExpectedAt).getTime();
  const arriveAtAirportMs = flightExpectedMs - safetyBufferMinutes * 60_000;
  const leaveHomeMs = arriveAtAirportMs - driveMinutes * 60_000;

  const arriveAtAirportBy = new Date(arriveAtAirportMs).toISOString();
  const leaveHomeAt = new Date(leaveHomeMs).toISOString();

  const headlines = buildPickupHeadlines(
    leaveHomeAt,
    arriveAtAirportBy,
    flightExpectedAt,
    safetyBufferMinutes
  );

  const recommendations = buildPickupRecommendations(flight, weather, driveMinutes);

  const suggestedAction =
    weather.pickupImpact === "moderate"
      ? `Use the cell phone lot until ${formatTimeOnly(arriveAtAirportBy)}, then proceed to ${guideCurbside(flight.arrivalCode)} when passenger texts.`
      : `Head to ${flight.arrivalCode} terminal curbside by ${formatTimeOnly(arriveAtAirportBy)} — passenger should be ready at the outer curb.`;

  const recommendation = [
    headlines.leaveHome,
    headlines.arriveAirport,
    headlines.flightExpected,
    headlines.safetyBuffer,
    suggestedAction,
  ].join(" ");

  return {
    homeAddress: homeAddress.trim(),
    arrivalAirport: flight.arrivalAirport,
    arrivalCode: flight.arrivalCode,
    driveMinutes,
    safetyBufferMinutes,
    weatherBufferMinutes: weatherBuffer,
    totalTripMinutes: driveMinutes + safetyBufferMinutes,
    flightExpectedAt,
    arriveAtAirportBy,
    leaveHomeAt,
    leaveHomeAtDisplay: formatTimeOnly(leaveHomeAt),
    arriveAtAirportDisplay: formatTimeOnly(arriveAtAirportBy),
    flightExpectedDisplay: formatTimeOnly(flightExpectedAt),
    headlines,
    recommendation,
    suggestedAction,
    recommendations,
    weather,
    airportTrafficLevel: traffic.level,
  };
}

function guideCurbside(code: string): string {
  return getAirportPickupGuide(code).curbsideZone.split("—")[0].trim();
}
