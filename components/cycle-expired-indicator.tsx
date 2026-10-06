/**
 * Cycle Expired Indicator Component
 *
 * Displays a warning when the selected cycle has expired (all valid times are in the past)
 */

import { AlertTriangle } from "lucide-react";

interface CycleExpiredIndicatorProps {
  /** The expired cycle ID */
  cycleId: string;
  /** Whether to show as inline (default) or as a banner */
  variant?: "inline" | "banner";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Indicator component for expired forecast cycles
 *
 * Shows "周期已过期" warning per GLOSSARY.md specification
 *
 * @example
 * ```tsx
 * <CycleExpiredIndicator cycleId="2024-10-06T12:00:00Z" variant="banner" />
 * ```
 */
export function CycleExpiredIndicator({
  cycleId,
  variant = "inline",
  className = "",
}: CycleExpiredIndicatorProps) {
  if (variant === "banner") {
    return (
      <div
        className={`flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 ${className}`}
        role="alert"
      >
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">周期已过期</p>
          <p className="text-sm">
            所有有效时刻均已过去 (周期: {cycleId})
          </p>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 ${className}`}
      role="status"
      aria-label="周期已过期"
    >
      <AlertTriangle className="h-3 w-3" />
      周期已过期
    </span>
  );
}
