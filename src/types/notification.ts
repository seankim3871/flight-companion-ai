/**
 * Simulated email / SMS notification records.
 */

export type NotificationChannel = "email" | "sms";

export type NotificationStatus = "sent" | "scheduled" | "failed";

export interface SimulatedNotification {
  id: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  message: string;
  flightNumber: string;
  status: NotificationStatus;
  sentAt: string;
  /** When the reminder is scheduled to fire (ISO) */
  scheduledFor?: string;
}

export interface NotificationRequest {
  channel: NotificationChannel;
  recipient: string;
  flightNumber: string;
  message: string;
  subject?: string;
  scheduledFor?: string;
}

export interface NotificationResult {
  success: boolean;
  notification?: SimulatedNotification;
  error?: string;
}
