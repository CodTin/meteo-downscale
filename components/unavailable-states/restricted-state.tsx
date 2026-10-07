import * as React from "react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { UnavailableStateBase } from "./base";

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
    <UnavailableStateBase
      icon={<NoSymbolIcon className="w-16 h-16 text-error-500" />}
      title={title}
      message={message}
      severity="error"
      details={
        alternatives.length > 0 ? (
          <div className="max-w-md w-full">
            <p className="text-sm font-medium mb-3">Try:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {alternatives.map((alt, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 text-sm bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors"
                  onClick={() => {
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
        ) : null
      }
      className={className}
      role="status"
      ariaLive="polite"
    />
  );
}
