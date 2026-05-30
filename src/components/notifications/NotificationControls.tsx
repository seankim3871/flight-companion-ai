"use client";

import {
  buildPickupEmailBody,
  buildPickupSmsBody,
} from "@/services/notifications";
import { appendNotification } from "@/lib/notificationStorage";
import { sendSimulatedNotification } from "@/lib/notificationClient";
import type { PickupPlan } from "@/types/pickupPlan";
import type { SimulatedNotification } from "@/types/notification";
import { useState } from "react";

interface NotificationControlsProps {
  flightNumber: string;
  plan: PickupPlan;
  email?: string;
  phone?: string;
  onNotificationSent?: (notification: SimulatedNotification) => void;
}

/**
 * Simulated email and SMS reminder controls.
 */
export function NotificationControls({
  flightNumber,
  plan,
  email,
  phone,
  onNotificationSent,
}: NotificationControlsProps) {
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<"email" | "sms" | null>(null);

  const sendEmail = async () => {
    if (!email?.trim()) {
      setEmailStatus("Add an email address in the form above.");
      return;
    }

    setLoading("email");
    setEmailStatus(null);

    const message = buildPickupEmailBody({
      flightNumber,
      leaveHomeAt: plan.leaveHomeAt,
      arriveAtAirportBy: plan.arriveAtAirportBy,
      flightExpectedAt: plan.flightExpectedAt,
      homeAddress: plan.homeAddress,
      arrivalCode: plan.arrivalCode,
    });

    const result = await sendSimulatedNotification({
      channel: "email",
      recipient: email.trim(),
      flightNumber,
      message,
      scheduledFor: plan.leaveHomeAt,
    });

    setLoading(null);

    if (result.success && result.notification) {
      appendNotification(result.notification);
      onNotificationSent?.(result.notification);
      setEmailStatus(
        result.notification.status === "scheduled"
          ? `Email scheduled for ${plan.leaveHomeAtDisplay}.`
          : "Email sent (simulated)."
      );
    } else {
      setEmailStatus(result.error ?? "Email failed.");
    }
  };

  const sendSms = async () => {
    if (!phone?.trim()) {
      setSmsStatus("Add a phone number in the form above.");
      return;
    }

    setLoading("sms");
    setSmsStatus(null);

    const message = buildPickupSmsBody({
      flightNumber,
      leaveHomeAt: plan.leaveHomeAt,
      arrivalCode: plan.arrivalCode,
    });

    const result = await sendSimulatedNotification({
      channel: "sms",
      recipient: phone.trim(),
      flightNumber,
      message,
      scheduledFor: plan.leaveHomeAt,
    });

    setLoading(null);

    if (result.success && result.notification) {
      appendNotification(result.notification);
      onNotificationSent?.(result.notification);
      setSmsStatus(
        result.notification.status === "scheduled"
          ? `SMS scheduled for ${plan.leaveHomeAtDisplay}.`
          : "SMS sent (simulated)."
      );
    } else {
      setSmsStatus(result.error ?? "SMS failed.");
    }
  };

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-4 shadow-card dark:border-white/10 dark:bg-slate-900 dark:shadow-card-dark sm:p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
        Reminders
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Simulated email &amp; SMS — no real messages are sent
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={sendEmail}
          disabled={loading !== null}
          className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-left text-sm font-medium text-sky-900 transition hover:bg-sky-100 disabled:opacity-60 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100"
        >
          {loading === "email" ? "Sending…" : "📧 Send email reminder"}
          {email && (
            <span className="mt-1 block text-xs font-normal opacity-80">
              To: {email}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={sendSms}
          disabled={loading !== null}
          className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-left text-sm font-medium text-violet-900 transition hover:bg-violet-100 disabled:opacity-60 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100"
        >
          {loading === "sms" ? "Sending…" : "📱 Send SMS reminder"}
          {phone && (
            <span className="mt-1 block text-xs font-normal opacity-80">
              To: {phone}
            </span>
          )}
        </button>
      </div>

      {emailStatus && (
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">{emailStatus}</p>
      )}
      {smsStatus && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{smsStatus}</p>
      )}
    </section>
  );
}
