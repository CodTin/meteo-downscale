/**
 * Display Formatters for Analysis Context
 *
 * Formatting utilities for displaying cycle, valid time, and region information
 * in the Context Header.
 */

import type { Region } from "@/stores/analysisContext.types";

/**
 * Format cycle ID for display
 * Converts ISO timestamp to "YYYY-MM-DD HH:mm Z" format
 *
 * @example
 * formatCycleDisplay("2024-03-15T00:00:00Z") => "2024-03-15 00Z"
 */
export function formatCycleDisplay(cycleId: string): string {
  try {
    const date = new Date(cycleId);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return cycleId;
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}Z`;
  } catch {
    return cycleId;
  }
}

/**
 * Format valid time for display with lead time offset
 * Shows both absolute time and relative offset from cycle
 *
 * @example
 * formatValidTimeDisplay("2024-03-17T12:00:00Z", 60) => "2024-03-17 12Z (+60h)"
 */
export function formatValidTimeDisplay(validTime: string, leadTime: number): string {
  try {
    const date = new Date(validTime);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return validTime;
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");

    const timeStr = `${year}-${month}-${day} ${hour}Z`;
    const offsetStr = `(+${leadTime}h)`;

    return `${timeStr} ${offsetStr}`;
  } catch {
    return validTime;
  }
}

/**
 * Format region for display
 * Returns region name
 *
 * @example
 * formatRegionDisplay({ id: "east-china", name: "East China", ... }) => "East China"
 */
export function formatRegionDisplay(region: Region): string {
  return region.name;
}
