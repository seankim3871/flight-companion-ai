/**
 * Mock airport weather for arrival planning.
 */

export type WeatherCondition =
  | "Clear"
  | "Partly Cloudy"
  | "Cloudy"
  | "Rain"
  | "Thunderstorms"
  | "Fog"
  | "Snow";

export interface AirportWeather {
  airportCode: string;
  airportName: string;
  condition: WeatherCondition;
  temperatureF: number;
  feelsLikeF: number;
  windMph: number;
  visibilityMiles: number;
  precipitationChance: number;
  /** Impact on pickup timing */
  pickupImpact: "none" | "minor" | "moderate";
  summary: string;
  updatedAt: string;
}
