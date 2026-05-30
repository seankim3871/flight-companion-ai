/**
 * Time only, e.g. "3:20 PM" — used in pickup planning headlines.
 */
export function formatTimeOnly(isoString: string): string {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Formats an ISO date string for display in the user's locale.
 */
export function formatArrivalTime(isoString: string): string {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Computes when the user should leave for the airport to meet an arriving passenger.
 * Uses estimated arrival minus buffer (drive + parking + terminal).
 */
export function calculateLeaveByTime(
  estimatedArrivalIso: string,
  bufferMinutes: number
): string {
  const arrival = new Date(estimatedArrivalIso);
  const leaveBy = new Date(arrival.getTime() - bufferMinutes * 60 * 1000);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(leaveBy);
}
