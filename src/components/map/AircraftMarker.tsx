"use client";

import { createMapIcon } from "@/components/map/createMapIcon";
import { MAP_COLORS } from "@/components/map/constants";
import type { MapMarkerPoint } from "@/types/map";
import { Marker, Popup } from "react-leaflet";

interface AircraftMarkerProps {
  point: MapMarkerPoint;
  flightNumber?: string;
}

/**
 * Live (or estimated) aircraft position marker.
 */
export function AircraftMarker({ point, flightNumber }: AircraftMarkerProps) {
  return (
    <Marker
      position={[point.lat, point.lng]}
      zIndexOffset={1000}
      icon={createMapIcon({
        color: MAP_COLORS.aircraft,
        label: "Aircraft",
        variant: "aircraft",
      })}
    >
      <Popup>
        <div className="flight-map-popup">
          <p className="flight-map-popup__title">Aircraft</p>
          {flightNumber && (
            <p className="flight-map-popup__code">{flightNumber}</p>
          )}
          <p className="flight-map-popup__coords">
            {point.lat.toFixed(2)}°, {point.lng.toFixed(2)}°
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
