import * as React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  actionLabel?: string;
  className?: string;
}

/**
 * ErrorState component for "Cannot Verify Product Availability"
 * Used when product catalog is temporarily unavailable
 */
export function ErrorState({
  title = "Cannot Verify Product Availability",
  message,
  onRetry,
  actionLabel = "Retry",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center border border-warning-300 bg-warning-50 rounded-lg",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <ExclamationTriangleIcon
        className="w-16 h-16 text-warning-500 mb-4"
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-warning-500 text-warning-700 hover:bg-warning-100"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
