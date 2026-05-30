/**
 * Geographic types for the live flight map.
 */

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

/** Map marker with display label and optional airport code */
export interface MapMarkerPoint extends GeoCoordinates {
  label: string;
  code?: string;
}

/**
 * Map-ready flight geometry: airports, aircraft, and route polyline.
 */
export interface FlightMapData {
  departure: MapMarkerPoint;
  arrival: MapMarkerPoint;
  /** Live or inferred aircraft position; null only when coords unavailable */
  aircraft: MapMarkerPoint | null;
  /** Route vertices as [latitude, longitude] for Leaflet */
  path: [number, number][];
  /** Preferred map center (aircraft when available) */
  center: GeoCoordinates;
}
