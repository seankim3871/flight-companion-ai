"use client";

import { fetchAIRecommendation } from "@/lib/aiRecommendationClient";
import type { Flight } from "@/types/flight";
import { useEffect, useState } from "react";

interface AIRecommendationCardProps {
  flight: Flight;
}

/**
 * Dedicated card for the AI Arrival Assistant recommendation.
 */
export function AIRecommendationCard({ flight }: AIRecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      setRecommendation(null);

      const result = await fetchAIRecommendation(flight);

      if (cancelled) return;

      setIsLoading(false);

      if (result.success && result.recommendation) {
        setRecommendation(result.recommendation);
        setIsFallback(Boolean(result.fallback));
      } else {
        setError(result.error ?? "Unable to load recommendation.");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [flight]);

  return (
    <section
      className="rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-sky-50/80 p-5 shadow-card dark:border-violet-900/40 dark:from-violet-950/40 dark:via-slate-900 dark:to-sky-950/30 dark:shadow-card-dark sm:p-6"
      aria-labelledby="ai-assistant-heading"
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-600 text-white shadow-md"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h3
            id="ai-assistant-heading"
            className="text-base font-semibold text-slate-900 dark:text-white"
          >
            AI Arrival Assistant
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Analyzes status, delays, and airport traffic for your pickup
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3" aria-live="polite" aria-busy="true">
          <div className="h-4 w-full animate-pulse rounded-md bg-violet-200/60 dark:bg-violet-900/40" />
          <div className="h-4 w-[92%] animate-pulse rounded-md bg-violet-200/50 dark:bg-violet-900/30" />
          <div className="h-4 w-[75%] animate-pulse rounded-md bg-violet-200/40 dark:bg-violet-900/20" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generating your recommendation…
          </p>
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}

      {!isLoading && recommendation && (
        <blockquote className="border-l-4 border-violet-400 pl-4 dark:border-violet-600">
          <p className="text-base leading-relaxed text-slate-800 dark:text-slate-100">
            {recommendation}
          </p>
          {isFallback && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Generated from flight data (AI unavailable).
            </p>
          )}
        </blockquote>
      )}
    </section>
  );
}
