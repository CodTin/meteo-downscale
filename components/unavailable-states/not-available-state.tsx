import * as React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { UnavailableStateBase } from "./base";

export interface NotAvailableStateProps {
  title?: string;
  message: string;
  cycleId?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

/**
 * NotAvailableState component for "Not Yet Available"
 * Used when cycle has not been published
 */
export function NotAvailableState({
  title = "Not Yet Available",
  message,
  cycleId,
  actionLabel = "View Cycle Detail",
  actionHref,
  className,
}: NotAvailableStateProps) {
  return (
    <UnavailableStateBase
      icon={<ClockIcon className="w-16 h-16 text-info-500" />}
      title={title}
      message={message}
      severity="neutral"
      details={
        cycleId ? (
          <p className="text-sm font-mono text-muted-foreground mb-6">
            Cycle: {cycleId}
          </p>
        ) : null
      }
      action={
        actionLabel && actionHref ? (
          <a
            href={actionHref}
            className="text-sm font-medium text-info-500 hover:text-info-700 underline"
          >
            {actionLabel}
          </a>
        ) : null
      }
      className={className}
      role="status"
      ariaLive="polite"
    />
  );
}
