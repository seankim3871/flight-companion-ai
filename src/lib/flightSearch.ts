/**
 * Flight number normalization and validation (client + server).
 */

/** IATA flight number: 2–3 letter airline code + 1–4 digits (e.g. DL123, KE35) */
const FLIGHT_NUMBER_PATTERN = /^[A-Z]{2,3}\d{1,4}$/;

/**
 * Normalizes user input to a consistent flight number key.
 */
export function normalizeFlightNumber(input: string): string {
  return input.trim().replace(/\s+/g, "").toUpperCase();
}

/**
 * Validates format before calling the API.
 */
export function isValidFlightNumber(input: string): boolean {
  const normalized = normalizeFlightNumber(input);
  return FLIGHT_NUMBER_PATTERN.test(normalized);
}

/**
 * Human-readable hint for invalid formats.
 */
export function getInvalidFlightNumberMessage(input: string): string {
  const normalized = normalizeFlightNumber(input);
  if (!normalized) {
    return "Please enter a flight number.";
  }
  return `Invalid flight number "${normalized}". Use format like DL123, KE35, or AA250.`;
}
