"use client";

import { FlightResultCard } from "@/components/FlightResultCard";
import {
  FlightSearchForm,
  type PickupSearchPayload,
} from "@/components/FlightSearchForm";
import { FavoriteFlightsPanel } from "@/components/favorites/FavoriteFlightsPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NotificationLog } from "@/components/notifications/NotificationLog";
import { PickupPlanningDashboard } from "@/components/pickup/PickupPlanningDashboard";
import { SearchFeedback } from "@/components/SearchFeedback";
import { useFavorites } from "@/hooks/useFavorites";
import { searchFlightViaApi } from "@/lib/flightApiClient";
import { fetchPickupPlan } from "@/lib/pickupPlanClient";
import type { Flight } from "@/types/flight";
import type { PickupPlan } from "@/types/pickupPlan";
import { useCallback, useState } from "react";

/**
 * Main page: Pickup Planning Mode orchestration.
 */
export function HomePage() {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [pickupPlan, setPickupPlan] = useState<PickupPlan | null>(null);
  const [contact, setContact] = useState<{ email?: string; phone?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationRefresh, setNotificationRefresh] = useState(0);
  const { favorites, saveFavorite, deleteFavorite } = useFavorites();

  const runPickupPlan = useCallback(async (payload: PickupSearchPayload) => {
    setIsLoading(true);
    setError(null);
    setFlight(null);
    setPickupPlan(null);
    setContact({ email: payload.email, phone: payload.phone });

    try {
      const flightResult = await searchFlightViaApi(payload.flightNumber);

      if (!flightResult.success || !flightResult.flight) {
        setError(flightResult.error ?? "Flight not found.");
        return;
      }

      const planResult = await fetchPickupPlan(
        flightResult.flight,
        payload.homeAddress
      );

      if (!planResult.success || !planResult.plan) {
        setError(planResult.error ?? "Could not build pickup plan.");
        return;
      }

      setFlight(flightResult.flight);
      setPickupPlan(planResult.plan);

      // Auto-save to favorites on successful plan
      saveFavorite({
        flightNumber: flightResult.flight.flightNumber,
        homeAddress: payload.homeAddress,
        email: payload.email,
        phone: payload.phone,
        label: `${flightResult.flight.flightNumber} pickup`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [saveFavorite]);

  const handleFavoriteSelect = useCallback(
    (favorite: {
      flightNumber: string;
      homeAddress: string;
      email?: string;
      phone?: string;
    }) => {
      runPickupPlan({
        flightNumber: favorite.flightNumber,
        homeAddress: favorite.homeAddress,
        email: favorite.email,
        phone: favorite.phone,
      });
    },
    [runPickupPlan]
  );

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1">
        <Hero />
        <FavoriteFlightsPanel
          favorites={favorites}
          onSelect={handleFavoriteSelect}
          onRemove={deleteFavorite}
        />
        <div className={favorites.length ? "mt-4" : ""}>
          <FlightSearchForm onPlanPickup={runPickupPlan} isLoading={isLoading} />
        </div>

        <div className="mt-6 space-y-6 pb-12">
          {isLoading && (
            <SearchFeedback
              message="Fetching flight data and calculating your pickup plan…"
              variant="info"
              isLoading
            />
          )}
          {!isLoading && error && (
            <SearchFeedback message={error} variant="error" />
          )}
          {pickupPlan && flight && !isLoading && (
            <PickupPlanningDashboard
              plan={pickupPlan}
              flightNumber={flight.flightNumber}
              email={contact.email}
              phone={contact.phone}
              onNotificationSent={() =>
                setNotificationRefresh((k) => k + 1)
              }
            />
          )}
          {flight && !isLoading && (
            <FlightResultCard
              flight={flight}
              hasPickupPlan={Boolean(pickupPlan)}
              homeAddress={pickupPlan?.homeAddress}
              email={contact.email}
              phone={contact.phone}
            />
          )}
          <NotificationLog refreshKey={notificationRefresh} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
