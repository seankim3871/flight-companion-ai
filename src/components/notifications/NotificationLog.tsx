"use client";

import type { SimulatedNotification } from "@/types/notification";
import { clearNotifications, loadNotifications } from "@/lib/notificationStorage";
import { useEffect, useState } from "react";

interface NotificationLogProps {
  /** Increment to refresh the log after new notifications */
  refreshKey?: number;
}

/**
 * Shows history of simulated email/SMS notifications.
 */
export function NotificationLog({ refreshKey = 0 }: NotificationLogProps) {
  const [log, setLog] = useState<SimulatedNotification[]>([]);

  useEffect(() => {
    setLog(loadNotifications());
  }, [refreshKey]);

  if (!log.length) return null;

  return (
    <section className="mx-auto max-w-lg px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Notification log
          </h3>
          <button
            type="button"
            onClick={() => {
              clearNotifications();
              setLog([]);
            }}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Clear
          </button>
        </div>
        <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto">
          {log.map((n) => (
            <li
              key={n.id}
              className="rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold uppercase text-slate-700 dark:text-slate-300">
                  {n.channel === "email" ? "📧 Email" : "📱 SMS"} · {n.flightNumber}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    n.status === "sent"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {n.status}
                </span>
              </div>
              <p className="mt-1 text-slate-500 dark:text-slate-400">To: {n.recipient}</p>
              <p className="mt-1 line-clamp-2 text-slate-700 dark:text-slate-300">
                {n.message}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
