import * as React from "react";
import { cn } from "@/lib/utils";

export interface UnavailableStateBaseProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "neutral";
  action?: React.ReactNode;
  details?: React.ReactNode;
  className?: string;
  role?: "status" | "alert";
  ariaLive?: "polite" | "assertive";
}

const severityStyles = {
  info: "border-info-300 bg-info-50",
  warning: "border-warning-300 bg-warning-50",
  error: "border-error-300 bg-error-50",
  neutral: "",
};

/**
 * Base component for all unavailable states
 * Provides consistent structure and styling
 */
export function UnavailableStateBase({
  icon,
  title,
  message,
  severity,
  action,
  details,
  className,
  role = "status",
  ariaLive = "polite",
}: UnavailableStateBaseProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        severity !== "neutral" && "border rounded-lg",
        severityStyles[severity],
        className
      )}
      role={role}
      aria-live={ariaLive}
    >
      <div className="mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
      {details}
      {action}
    </div>
  );
}
