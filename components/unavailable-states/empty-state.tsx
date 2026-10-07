import * as React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <MagnifyingGlassIcon
        className="w-16 h-16 text-muted-foreground mb-4"
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
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
