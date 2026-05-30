import { AIRecommendationCard } from "@/components/AIRecommendationCard";
import { SaveFlightButton } from "@/components/favorites/SaveFlightButton";
import { FlightMapCard } from "@/components/map/FlightMapCard";
import { AirportWeatherCard } from "@/components/weather/AirportWeatherCard";
import { getMockAirportWeather } from "@/data/mockAirportWeather";
import { getStatusBadgeClasses } from "@/lib/statusColors";
import {
  calculateLeaveByTime,
  formatArrivalTime,
} from "@/lib/formatDateTime";
import type { Flight } from "@/types/flight";

interface FlightResultCardProps {
  flight: Flight;
  hasPickupPlan?: boolean;
  homeAddress?: string;
  email?: string;
  phone?: string;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-900 dark:text-slate-100 sm:text-right">
        {value}
      </dd>
    </div>
  );
}

export function FlightResultCard({
  flight,
  hasPickupPlan = false,
  homeAddress,
  email,
  phone,
}: FlightResultCardProps) {
  const leaveBy = calculateLeaveByTime(
    flight.estimatedArrival,
    flight.recommendedLeaveBufferMinutes
  );
  const weather = getMockAirportWeather(flight.arrivalCode, flight.arrivalAirport);

  return (
    <article className="mx-auto max-w-lg animate-slide-up space-y-4 px-4 sm:px-6">
      {!hasPickupPlan && (
        <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-aviation-navy p-5 text-white shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wider text-sky-100">
            Leave for airport by
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {leaveBy}
          </p>
          <p className="mt-2 text-sm text-sky-100/90">
            Based on estimated arrival at {flight.arrivalCode} (
            {flight.recommendedLeaveBufferMinutes} min buffer)
          </p>
        </div>
      )}

      {homeAddress && (
        <SaveFlightButton
          flightNumber={flight.flightNumber}
          homeAddress={homeAddress}
          email={email}
          phone={phone}
        />
      )}

      {!hasPickupPlan && <AirportWeatherCard weather={weather} />}

      <AIRecommendationCard flight={flight} />

      {flight.map && (
        <FlightMapCard mapData={flight.map} flightNumber={flight.flightNumber} />
      )}

      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-card dark:border-white/10 dark:bg-slate-900 dark:shadow-card-dark">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {flight.airline}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {flight.flightNumber}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(flight.status)}`}
          >
            {flight.status}
          </span>
        </div>

        <dl>
          <DetailRow label="Airline" value={flight.airline} />
          <DetailRow label="Flight Number" value={flight.flightNumber} />
          <DetailRow
            label="Departure Airport"
            value={`${flight.departureAirport} (${flight.departureCode})`}
          />
          <DetailRow
            label="Arrival Airport"
            value={`${flight.arrivalAirport} (${flight.arrivalCode})`}
          />
          <DetailRow
            label="Scheduled Arrival"
            value={formatArrivalTime(flight.scheduledArrival)}
          />
          <DetailRow
            label="Estimated Arrival"
            value={formatArrivalTime(flight.estimatedArrival)}
          />
          <DetailRow label="Flight Status" value={flight.status} />
          {typeof flight.arrivalDelayMinutes === "number" && (
            <DetailRow
              label="Arrival Delay"
              value={`${flight.arrivalDelayMinutes} min`}
            />
          )}
        </dl>
      </div>
    </article>
  );
}
