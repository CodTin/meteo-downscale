import * as React from "react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface RestrictedStateProps {
  title?: string;
  message: string;
  alternatives?: Array<{
    label: string;
    value: string;
  }>;
  className?: string;
}

/**
 * RestrictedState component for "TP Restricted"
 * Used when precipitation is restricted until verification
 */
export function RestrictedState({
  title = "TP Restricted",
  message,
  alternatives = [],
  className,
}: RestrictedStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center border border-error-300 bg-error-50 rounded-lg",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <NoSymbolIcon
        className="w-16 h-16 text-error-500 mb-4"
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>

      {alternatives.length > 0 && (
        <div className="max-w-md w-full">
          <p className="text-sm font-medium mb-3">Try:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {alternatives.map((alt, index) => (
              <button
                key={index}
                className="px-3 py-1.5 text-sm bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors"
                onClick={() => {
                  // Parent component should handle variable selection
                  const event = new CustomEvent("variableSelected", {
                    detail: { value: alt.value },
                  });
                  window.dispatchEvent(event);
                }}
              >
                {alt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
