import type { AirportWeather } from "@/types/weather";

const IMPACT_STYLES = {
  none: "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/40 dark:bg-emerald-950/30",
  minor: "border-amber-200 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/30",
  moderate: "border-orange-200 bg-orange-50/80 dark:border-orange-900/40 dark:bg-orange-950/30",
};

const CONDITION_EMOJI: Record<string, string> = {
  Clear: "☀️",
  "Partly Cloudy": "⛅",
  Cloudy: "☁️",
  Rain: "🌧️",
  Thunderstorms: "⛈️",
  Fog: "🌫️",
  Snow: "❄️",
};

interface AirportWeatherCardProps {
  weather: AirportWeather;
}

/**
 * Mock airport weather card for arrival planning.
 */
export function AirportWeatherCard({ weather }: AirportWeatherCardProps) {
  const style = IMPACT_STYLES[weather.pickupImpact];

  return (
    <section
      className={`rounded-2xl border p-4 sm:p-5 ${style}`}
      aria-labelledby="weather-heading"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Airport weather
          </p>
          <h3
            id="weather-heading"
            className="mt-1 text-base font-semibold text-slate-900 dark:text-white"
          >
            {weather.airportCode} — {weather.condition}
          </h3>
        </div>
        <span className="text-2xl" aria-hidden>
          {CONDITION_EMOJI[weather.condition] ?? "🌤️"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <WeatherStat label="Temp" value={`${weather.temperatureF}°F`} />
        <WeatherStat label="Feels like" value={`${weather.feelsLikeF}°F`} />
        <WeatherStat label="Wind" value={`${weather.windMph} mph`} />
        <WeatherStat label="Rain chance" value={`${weather.precipitationChance}%`} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {weather.summary}
      </p>
    </section>
  );
}

function WeatherStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
