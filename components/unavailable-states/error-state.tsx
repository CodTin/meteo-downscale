import * as React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { UnavailableStateBase } from "./base";

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
    <UnavailableStateBase
      icon={<ExclamationTriangleIcon className="w-16 h-16 text-warning-500" />}
      title={title}
      message={message}
      severity="warning"
      action={
        onRetry ? (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-warning-500 text-warning-700 hover:bg-warning-100"
          >
            {actionLabel}
          </Button>
        ) : null
      }
      className={className}
      role="alert"
      ariaLive="assertive"
    />
  );
}
