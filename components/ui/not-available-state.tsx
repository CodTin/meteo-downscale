import * as React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <ClockIcon
        className="w-16 h-16 text-info-500 mb-4"
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-2">{message}</p>

      {cycleId && (
        <p className="text-sm font-mono text-muted-foreground mb-6">
          Cycle: {cycleId}
        </p>
      )}

      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="text-sm font-medium text-info-500 hover:text-info-700 underline"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}
