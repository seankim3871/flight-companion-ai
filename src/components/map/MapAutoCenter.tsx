"use client";

import type { FlightMapData } from "@/types/map";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MapAutoCenterProps {
  mapData: FlightMapData;
}

/**
 * Centers the map on the aircraft and zooms to fit the full route.
 */
export function MapAutoCenter({ mapData }: MapAutoCenterProps) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [
      [mapData.departure.lat, mapData.departure.lng],
      [mapData.arrival.lat, mapData.arrival.lng],
    ];

    if (mapData.aircraft) {
      points.push([mapData.aircraft.lat, mapData.aircraft.lng]);
    }

    const bounds = L.latLngBounds(points);

    if (mapData.aircraft) {
      const zoom = Math.min(map.getBoundsZoom(bounds, false) - 0.5, 8);
      map.setView(
        [mapData.aircraft.lat, mapData.aircraft.lng],
        Math.max(zoom, 4),
        { animate: true }
      );
    } else {
      map.fitBounds(bounds, {
        padding: [48, 48],
        maxZoom: 8,
        animate: true,
      });
    }
  }, [map, mapData]);

  return null;
}
