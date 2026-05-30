"use client";

import { createMapIcon } from "@/components/map/createMapIcon";
import { MAP_COLORS } from "@/components/map/constants";
import type { MapMarkerPoint } from "@/types/map";
import { Marker, Popup } from "react-leaflet";

interface AirportMarkerProps {
  point: MapMarkerPoint;
  variant: "departure" | "arrival";
}

/**
 * Departure or arrival airport marker on the flight map.
 */
export function AirportMarker({ point, variant }: AirportMarkerProps) {
  const color =
    variant === "departure" ? MAP_COLORS.departure : MAP_COLORS.arrival;
  const title = variant === "departure" ? "Departure" : "Arrival";

  return (
    <Marker
      position={[point.lat, point.lng]}
      icon={createMapIcon({
        color,
        label: point.code ?? title,
        variant,
      })}
    >
      <Popup>
        <div className="flight-map-popup">
          <p className="flight-map-popup__title">{title}</p>
          <p className="flight-map-popup__name">{point.label}</p>
          {point.code && (
            <p className="flight-map-popup__code">{point.code}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
