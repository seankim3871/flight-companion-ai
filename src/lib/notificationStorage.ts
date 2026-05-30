import type { SimulatedNotification } from "@/types/notification";

const STORAGE_KEY = "flight-companion-notifications";

/**
 * Reads notification log from localStorage.
 */
export function loadNotifications(): SimulatedNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SimulatedNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Appends a notification to the local log.
 */
export function appendNotification(notification: SimulatedNotification): void {
  const log = loadNotifications();
  log.unshift(notification);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log.slice(0, 50)));
}

/**
 * Clears all notification history.
 */
export function clearNotifications(): void {
  localStorage.removeItem(STORAGE_KEY);
}
