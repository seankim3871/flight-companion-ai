"use client";

import { MAP_COLORS } from "@/components/map/constants";
import { Polyline } from "react-leaflet";

interface FlightPathLineProps {
  path: [number, number][];
}

/**
 * Dashed route polyline from departure through aircraft to arrival.
 */
export function FlightPathLine({ path }: FlightPathLineProps) {
  if (path.length < 2) return null;

  return (
    <Polyline
      positions={path}
      pathOptions={{
        color: MAP_COLORS.path,
        weight: 3,
        opacity: 0.85,
        dashArray: "8 6",
        lineCap: "round",
        lineJoin: "round",
      }}
    />
  );
}
