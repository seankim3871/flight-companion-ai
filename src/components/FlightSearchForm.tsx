"use client";

import { EXAMPLE_FLIGHT_NUMBERS } from "@/data/mockFlights";
import { FormEvent, useState } from "react";

export interface PickupSearchPayload {
  flightNumber: string;
  homeAddress: string;
  email?: string;
  phone?: string;
}

interface FlightSearchFormProps {
  onPlanPickup: (payload: PickupSearchPayload) => void;
  isLoading?: boolean;
}

/**
 * Pickup Planning Mode — flight number + home address inputs.
 */
export function FlightSearchForm({
  onPlanPickup,
  isLoading = false,
}: FlightSearchFormProps) {
  const [flightNumber, setFlightNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAddressError(null);

    const address = homeAddress.trim();
    if (address.length < 5) {
      setAddressError("Enter your full home address (street, city, state).");
      return;
    }

    onPlanPickup({
      flightNumber,
      homeAddress: address,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  };

  const fillExample = (code: string) => {
    setFlightNumber(code);
    setAddressError(null);
  };

  return (
    <section className="px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg rounded-2xl border border-black/5 bg-white p-4 shadow-card dark:border-white/10 dark:bg-slate-900 dark:shadow-card-dark sm:p-5"
      >
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          Pickup Planning Mode
        </p>

        <label
          htmlFor="flight-number"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Flight number
        </label>

        <input
          id="flight-number"
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="e.g. DL123"
          autoComplete="off"
          autoCapitalize="characters"
          disabled={isLoading}
          required
          className="mb-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
        />

        <label
          htmlFor="home-address"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Home address
        </label>

        <input
          id="home-address"
          type="text"
          value={homeAddress}
          onChange={(e) => {
            setHomeAddress(e.target.value);
            setAddressError(null);
          }}
          placeholder="e.g. 123 Main St, Los Angeles, CA"
          autoComplete="street-address"
          disabled={isLoading}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
        />

        {addressError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {addressError}
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Phone <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              autoComplete="tel"
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-slate-900"
        >
          {isLoading && (
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden
            />
          )}
          {isLoading ? "Planning pickup…" : "Plan pickup"}
        </button>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Example flights:{" "}
          {EXAMPLE_FLIGHT_NUMBERS.map((code, i) => (
            <span key={code}>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fillExample(code)}
                className="font-medium text-sky-600 hover:underline disabled:opacity-50 dark:text-sky-400"
              >
                {code}
              </button>
              {i < EXAMPLE_FLIGHT_NUMBERS.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </form>
    </section>
  );
}
