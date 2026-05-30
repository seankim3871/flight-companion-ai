"use client";

import { AircraftMarker } from "@/components/map/AircraftMarker";
import { AirportMarker } from "@/components/map/AirportMarker";
import {
  MAP_TILE_ATTRIBUTION,
  MAP_TILE_URL,
} from "@/components/map/constants";
import { FlightPathLine } from "@/components/map/FlightPathLine";
import { MapAutoCenter } from "@/components/map/MapAutoCenter";
import type { FlightMapData } from "@/types/map";
import { MapContainer, TileLayer } from "react-leaflet";

interface FlightMapViewProps {
  mapData: FlightMapData;
  flightNumber?: string;
  className?: string;
}

/**
 * Interactive Leaflet map: airports, aircraft, and flight path.
 * Client-only — import via dynamic() from a parent.
 */
export function FlightMapView({
  mapData,
  flightNumber,
  className = "",
}: FlightMapViewProps) {
  const { center } = mapData;

  return (
    <div
      className={`flight-map-shell overflow-hidden rounded-xl ${className}`}
      role="region"
      aria-label="Live flight map"
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={5}
        scrollWheelZoom
        touchZoom
        dragging
        doubleClickZoom
        zoomControl
        className="flight-map-container z-0 h-[min(52vh,280px)] w-full sm:h-[320px]"
        attributionControl
      >
        <TileLayer url={MAP_TILE_URL} attribution={MAP_TILE_ATTRIBUTION} />
        <FlightPathLine path={mapData.path} />
        <AirportMarker point={mapData.departure} variant="departure" />
        <AirportMarker point={mapData.arrival} variant="arrival" />
        {mapData.aircraft && (
          <AircraftMarker
            point={mapData.aircraft}
            flightNumber={flightNumber}
          />
        )}
        <MapAutoCenter mapData={mapData} />
      </MapContainer>
    </div>
  );
}
