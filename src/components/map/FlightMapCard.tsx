"use client";

import { MapLoadingSkeleton } from "@/components/map/MapLoadingSkeleton";
import type { FlightMapData } from "@/types/map";
import dynamic from "next/dynamic";

const FlightMapView = dynamic(
  () =>
    import("@/components/map/FlightMapView").then((mod) => mod.FlightMapView),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
);

interface FlightMapCardProps {
  mapData: FlightMapData;
  flightNumber: string;
}

/**
 * Card wrapper for the live map — matches app shadow and border styles.
 */
export function FlightMapCard({ mapData, flightNumber }: FlightMapCardProps) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-4 shadow-card dark:border-white/10 dark:bg-slate-900 dark:shadow-card-dark sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Live map
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full bg-sky-500"
              aria-hidden
            />
            Departure
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full bg-amber-500"
              aria-hidden
            />
            Aircraft
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full bg-sky-900 dark:bg-sky-700"
              aria-hidden
            />
            Arrival
          </span>
        </div>
      </div>
      <FlightMapView mapData={mapData} flightNumber={flightNumber} />
    </section>
  );
}
