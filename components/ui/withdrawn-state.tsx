import * as React from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface WithdrawnStateProps {
  title?: string;
  message: string;
  reason?: string;
  timestamp?: string;
  alternatives?: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

/**
 * WithdrawnState component for "Source Product Retracted"
 * Used when batch was retracted with reason and alternatives
 */
export function WithdrawnState({
  title = "Source Product Retracted",
  message,
  reason,
  timestamp,
  alternatives = [],
  className,
}: WithdrawnStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center border border-error-300 bg-error-50 rounded-lg",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <XCircleIcon
        className="w-16 h-16 text-error-500 mb-4"
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>

      {(reason || timestamp) && (
        <div className="bg-white border border-error-200 rounded-md p-4 mb-6 max-w-md text-left">
          {timestamp && (
            <p className="text-xs text-muted-foreground mb-2">
              Retracted: {timestamp}
            </p>
          )}
          {reason && (
            <p className="text-sm">
              <span className="font-medium">Reason:</span> {reason}
            </p>
          )}
        </div>
      )}

      {alternatives.length > 0 && (
        <div className="max-w-md w-full">
          <p className="text-sm font-medium mb-3">Alternative batches:</p>
          <ul className="space-y-2">
            {alternatives.map((alt, index) => (
              <li key={index}>
                <a
                  href={alt.href}
                  className="text-sm text-info-500 hover:text-info-700 underline"
                >
                  {alt.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
