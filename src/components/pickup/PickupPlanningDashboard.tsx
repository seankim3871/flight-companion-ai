import { EnhancedPickupTips } from "@/components/pickup/EnhancedPickupTips";
import { PickupMetricTile } from "@/components/pickup/PickupMetricTile";
import { NotificationControls } from "@/components/notifications/NotificationControls";
import { AirportWeatherCard } from "@/components/weather/AirportWeatherCard";
import type { PickupPlan } from "@/types/pickupPlan";
import type { SimulatedNotification } from "@/types/notification";

interface PickupPlanningDashboardProps {
  plan: PickupPlan;
  flightNumber: string;
  email?: string;
  phone?: string;
  onNotificationSent?: (notification: SimulatedNotification) => void;
}

/**
 * Easy-to-read pickup schedule dashboard with headline recommendations.
 */
export function PickupPlanningDashboard({
  plan,
  flightNumber,
  email,
  phone,
  onNotificationSent,
}: PickupPlanningDashboardProps) {
  const { headlines } = plan;

  return (
    <section
      className="mx-auto max-w-lg animate-slide-up space-y-4 px-4 sm:px-6"
      aria-labelledby="pickup-dashboard-heading"
    >
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card dark:border-white/10 dark:bg-slate-900 dark:shadow-card-dark">
        <div className="border-b border-slate-100 bg-gradient-to-r from-sky-600 to-aviation-navy px-5 py-4 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wider text-sky-100">
            Pickup Planning Mode
          </p>
          <h2
            id="pickup-dashboard-heading"
            className="mt-1 text-lg font-semibold text-white"
          >
            Your pickup schedule
          </h2>
          <p className="mt-1 text-sm text-sky-100/90">
            {plan.homeAddress} → {plan.arrivalCode}
          </p>
        </div>

        <div className="space-y-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800">
          <PickupHeadline icon="home" text={headlines.leaveHome} />
          <PickupHeadline icon="airport" text={headlines.arriveAirport} />
          <PickupHeadline icon="flight" text={headlines.flightExpected} />
          <PickupHeadline icon="buffer" text={headlines.safetyBuffer} highlight />
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          <PickupMetricTile
            label="Leave home"
            value={plan.leaveHomeAtDisplay}
            accent="sky"
          />
          <PickupMetricTile
            label="Arrive at airport"
            value={plan.arriveAtAirportDisplay}
            accent="emerald"
          />
          <PickupMetricTile
            label="Flight arrives"
            value={plan.flightExpectedDisplay}
            accent="amber"
          />
          <PickupMetricTile
            label="Safety buffer"
            value={`${plan.safetyBufferMinutes} min`}
            subtext={`${plan.driveMinutes} min drive`}
            accent="slate"
          />
        </div>

        <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Drive</dt>
              <dd className="font-semibold text-slate-900 dark:text-white">
                {plan.driveMinutes} min
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Buffer</dt>
              <dd className="font-semibold text-slate-900 dark:text-white">
                {plan.safetyBufferMinutes} min
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Weather</dt>
              <dd className="font-semibold text-slate-900 dark:text-white">
                +{plan.weatherBufferMinutes} min
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Traffic</dt>
              <dd className="font-semibold capitalize text-slate-900 dark:text-white">
                {plan.airportTrafficLevel}
              </dd>
            </div>
          </dl>
        </div>

        <EnhancedPickupTips
          recommendations={plan.recommendations}
          suggestedAction={plan.suggestedAction}
        />
      </div>

      <AirportWeatherCard weather={plan.weather} />

      <NotificationControls
        flightNumber={flightNumber}
        plan={plan}
        email={email}
        phone={phone}
        onNotificationSent={onNotificationSent}
      />
    </section>
  );
}

function PickupHeadline({
  icon,
  text,
  highlight = false,
}: {
  icon: "home" | "airport" | "flight" | "buffer";
  text: string;
  highlight?: boolean;
}) {
  const icons = {
    home: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    ),
    airport: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m12.786 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    ),
    flight: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
      />
    ),
    buffer: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  };

  return (
    <div
      className={`flex gap-3 ${highlight ? "rounded-xl bg-amber-50/80 px-3 py-2 dark:bg-amber-950/30" : ""}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          highlight
            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
            : "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"
        }`}
        aria-hidden
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {icons[icon]}
        </svg>
      </span>
      <p className="text-base leading-snug text-slate-800 dark:text-slate-100">
        {text}
      </p>
    </div>
  );
}
