import type { AirportWeather, WeatherCondition } from "@/types/weather";

interface WeatherTemplate {
  condition: WeatherCondition;
  temperatureF: number;
  feelsLikeF: number;
  windMph: number;
  visibilityMiles: number;
  precipitationChance: number;
  pickupImpact: AirportWeather["pickupImpact"];
  summary: string;
}

const WEATHER_BY_AIRPORT: Record<string, WeatherTemplate> = {
  LAX: {
    condition: "Clear",
    temperatureF: 72,
    feelsLikeF: 74,
    windMph: 8,
    visibilityMiles: 10,
    precipitationChance: 5,
    pickupImpact: "none",
    summary: "Clear skies at LAX — ideal for curbside pickup.",
  },
  ATL: {
    condition: "Partly Cloudy",
    temperatureF: 68,
    feelsLikeF: 69,
    windMph: 12,
    visibilityMiles: 9,
    precipitationChance: 20,
    pickupImpact: "none",
    summary: "Mild and partly cloudy — normal pickup conditions.",
  },
  SFO: {
    condition: "Fog",
    temperatureF: 58,
    feelsLikeF: 56,
    windMph: 14,
    visibilityMiles: 3,
    precipitationChance: 35,
    pickupImpact: "moderate",
    summary: "Fog at SFO may slow traffic near terminals — leave a few minutes early.",
  },
  ORD: {
    condition: "Cloudy",
    temperatureF: 55,
    feelsLikeF: 52,
    windMph: 18,
    visibilityMiles: 6,
    precipitationChance: 40,
    pickupImpact: "minor",
    summary: "Cloudy and breezy — allow extra time on airport access roads.",
  },
  DFW: {
    condition: "Clear",
    temperatureF: 78,
    feelsLikeF: 80,
    windMph: 10,
    visibilityMiles: 10,
    precipitationChance: 10,
    pickupImpact: "none",
    summary: "Warm and clear — good visibility for passenger pickup.",
  },
  ICN: {
    condition: "Rain",
    temperatureF: 62,
    feelsLikeF: 60,
    windMph: 11,
    visibilityMiles: 5,
    precipitationChance: 65,
    pickupImpact: "moderate",
    summary: "Light rain expected — covered pickup zones recommended.",
  },
  EWR: {
    condition: "Rain",
    temperatureF: 54,
    feelsLikeF: 50,
    windMph: 16,
    visibilityMiles: 4,
    precipitationChance: 70,
    pickupImpact: "moderate",
    summary: "Rain at EWR — use cell phone lot until passenger is curbside.",
  },
  MIA: {
    condition: "Thunderstorms",
    temperatureF: 84,
    feelsLikeF: 90,
    windMph: 22,
    visibilityMiles: 3,
    precipitationChance: 80,
    pickupImpact: "moderate",
    summary: "Thunderstorms possible — expect ground stops and longer curbside waits.",
  },
  BOS: {
    condition: "Partly Cloudy",
    temperatureF: 61,
    feelsLikeF: 59,
    windMph: 9,
    visibilityMiles: 8,
    precipitationChance: 15,
    pickupImpact: "none",
    summary: "Cool and dry — standard pickup timing applies.",
  },
  FLL: {
    condition: "Clear",
    temperatureF: 82,
    feelsLikeF: 86,
    windMph: 7,
    visibilityMiles: 10,
    precipitationChance: 10,
    pickupImpact: "none",
    summary: "Sunny at FLL — busy curbside but good driving conditions.",
  },
};

const DEFAULT_WEATHER: WeatherTemplate = {
  condition: "Partly Cloudy",
  temperatureF: 65,
  feelsLikeF: 64,
  windMph: 10,
  visibilityMiles: 8,
  precipitationChance: 25,
  pickupImpact: "minor",
  summary: "Typical conditions — follow standard pickup timing.",
};

const AIRPORT_NAMES: Record<string, string> = {
  LAX: "Los Angeles International",
  ATL: "Hartsfield-Jackson Atlanta International",
  SFO: "San Francisco International",
  ORD: "Chicago O'Hare International",
  DFW: "Dallas/Fort Worth International",
  ICN: "Incheon International",
  EWR: "Newark Liberty International",
  MIA: "Miami International",
  BOS: "Boston Logan International",
  FLL: "Fort Lauderdale-Hollywood International",
};

/**
 * Returns mock weather for an arrival airport IATA code.
 */
export function getMockAirportWeather(
  airportCode: string,
  airportName?: string
): AirportWeather {
  const code = airportCode.trim().toUpperCase();
  const template = WEATHER_BY_AIRPORT[code] ?? DEFAULT_WEATHER;

  return {
    airportCode: code,
    airportName: airportName ?? AIRPORT_NAMES[code] ?? `${code} Airport`,
    ...template,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Extra minutes to add to pickup buffer based on weather impact.
 */
export function getWeatherBufferMinutes(weather: AirportWeather): number {
  switch (weather.pickupImpact) {
    case "moderate":
      return 12;
    case "minor":
      return 5;
    default:
      return 0;
  }
}
