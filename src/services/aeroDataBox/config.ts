/** Request timeout in milliseconds */
export const AERODATABOX_TIMEOUT_MS = 12_000;

export const AERODATABOX_BASE_URL = "https://aerodatabox.p.rapidapi.com";

export const AERODATABOX_HOST = "aerodatabox.p.rapidapi.com";

export function getRapidApiKey(): string | undefined {
  return process.env.RAPIDAPI_KEY?.trim();
}
