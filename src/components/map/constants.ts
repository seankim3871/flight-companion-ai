/** OpenStreetMap tiles — free, no API key */
export const MAP_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Brand-aligned marker colors */
export const MAP_COLORS = {
  departure: "#0ea5e9",
  arrival: "#0c4a6e",
  aircraft: "#f59e0b",
  path: "#38bdf8",
  pathDark: "#7dd3fc",
} as const;
