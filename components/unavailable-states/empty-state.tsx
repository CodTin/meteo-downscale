import * as React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UnavailableStateBase } from "./base";

export interface EmptyStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

/**
 * EmptyState component for "No Products in This Time Range"
 * Used when valid time has no published forecasts
 */
export function EmptyState({
  title = "No Products in This Time Range",
  message,
  actionLabel = "View Forecast Directory",
  actionHref = "/forecast/directory",
  className,
}: EmptyStateProps) {
  return (
    <UnavailableStateBase
      icon={<MagnifyingGlassIcon className="w-16 h-16 text-muted-foreground" />}
      title={title}
      message={message}
      severity="neutral"
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
