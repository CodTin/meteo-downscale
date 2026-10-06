/**
 * Initial State Resolution & Default Entry Logic
 *
 * Implements GLOSSARY.md rules for first-time entry and state initialization:
 * - Business mode prioritizes future valid times
 * - Historical mode uses earliest available
 * - Default region: 川渝 (27–33°N, 102–108°E)
 * - Default variable: T2m (temperature)
 * - Explicit unavailable states (never silent failures)
 */

import type {
  CatalogQueryResult,
  StateResolutionResult,
  DataMode,
} from "./stateResolution.types";
import {
  DEFAULT_REGION,
  DEFAULT_VARIABLE,
  DEFAULT_EXPRESSION,
} from "./stateResolution.types";
import type { Region } from "@/stores/analysisContext.types";

/**
 * Query product catalog for available cycles and valid times
 * In production, this would call the actual API
 *
 * @param mode - Data mode to query (business or historical)
 * @returns Catalog query result with available data
 */
export async function queryCatalog(
  mode: DataMode
): Promise<CatalogQueryResult> {
  // TODO: Replace with actual API call
  // For now, return mock data structure

  // Simulate catalog query
  try {
    // In production, this would be:
    // const response = await fetch(`/api/catalog?mode=${mode}`);
    // const data = await response.json();

    // Mock implementation
    return {
      available: false,
      latestCycle: null,
      validTimes: [],
      unavailableReason: "catalog_unknown",
    };
  } catch (error) {
    return {
      available: false,
      latestCycle: null,
      validTimes: [],
      unavailableReason: "query_failed",
    };
  }
}

/**
 * Select appropriate valid time based on mode and available times
 *
 * Business mode: first time not earlier than current UTC
 * Historical mode: earliest available time
 *
 * @param validTimes - Available valid times (ISO 8601 strings)
 * @param mode - Data mode
 * @returns Selected valid time and whether cycle is expired
 */
export function selectValidTime(
  validTimes: string[],
  mode: DataMode
): { validTime: string | null; cycleExpired: boolean } {
  if (validTimes.length === 0) {
    return { validTime: null, cycleExpired: false };
  }

  const now = new Date();
  const sortedTimes = [...validTimes].sort();

  if (mode === "historical") {
    // Historical: use earliest available time
    return { validTime: sortedTimes[0], cycleExpired: false };
  }

  // Business mode: find first time not earlier than current UTC
  const futureTime = sortedTimes.find((time) => new Date(time) >= now);

  if (futureTime) {
    return { validTime: futureTime, cycleExpired: false };
  }

  // All times are in the past - use latest and mark as expired
  return {
    validTime: sortedTimes[sortedTimes.length - 1],
    cycleExpired: true,
  };
}

/**
 * Load default region from localStorage or use 川渝 example
 *
 * @returns Default region
 */
export function getDefaultRegion(): Region {
  if (typeof window === "undefined") {
    return DEFAULT_REGION;
  }

  try {
    const stored = localStorage.getItem("default-region");
    if (stored) {
      const region = JSON.parse(stored) as Region;
      // Validate region has required fields
      if (
        region.id &&
        region.name &&
        typeof region.north === "number" &&
        typeof region.south === "number" &&
        typeof region.east === "number" &&
        typeof region.west === "number"
      ) {
        return region;
      }
    }
  } catch (error) {
    console.warn("Failed to load default region from localStorage:", error);
  }

  return DEFAULT_REGION;
}

/**
 * Resolve initial state for first-time entry
 *
 * Implements complete default entry logic per GLOSSARY.md:
 * 1. Query for latest published cycle (business preferred, historical fallback)
 * 2. Load default region from localStorage or use 川渝
 * 3. Set default variable to T2m, expression to AI ensemble mean
 * 4. Select appropriate valid time based on mode
 * 5. Handle all unavailable states explicitly
 *
 * @param requestedCycle - Optional specific cycle requested (from URL)
 * @returns State resolution result with defaults
 */
export async function resolveInitialState(
  requestedCycle?: string
): Promise<StateResolutionResult> {
  const region = getDefaultRegion();
  const variableId = DEFAULT_VARIABLE;
  const expression = DEFAULT_EXPRESSION;

  // If specific cycle requested, try to use it
  if (requestedCycle) {
    const catalog = await queryCatalog("business");

    if (!catalog.available) {
      return {
        cycleId: null,
        validTime: null,
        variableId,
        expression,
        region,
        mode: "business",
        cycleExpired: false,
        status:
          catalog.unavailableReason === "catalog_unknown"
            ? "no_catalog"
            : "no_products",
        reason:
          catalog.unavailableReason === "catalog_unknown"
            ? "产品可用性未确认：权威目录尚未接入或暂不可访问"
            : "无已发布产品：当前查询范围没有通过发布检查的产品",
      };
    }

    if (catalog.latestCycle !== requestedCycle) {
      return {
        cycleId: null,
        validTime: null,
        variableId,
        expression,
        region,
        mode: "business",
        cycleExpired: false,
        status: "cycle_unavailable",
        reason: `请求的周期 ${requestedCycle} 不可用`,
      };
    }

    const { validTime, cycleExpired } = selectValidTime(
      catalog.validTimes,
      "business"
    );

    return {
      cycleId: requestedCycle,
      validTime,
      variableId,
      expression,
      region,
      mode: "business",
      cycleExpired,
      status: validTime ? "success" : "partial",
      reason: cycleExpired
        ? "周期已过期：所有有效时刻均已过去"
        : !validTime
          ? "无可用有效时刻"
          : undefined,
    };
  }

  // No specific cycle requested - use defaults

  // Try business mode first
  let catalog = await queryCatalog("business");
  let mode: DataMode = "business";

  // If no business products, fall back to historical
  if (!catalog.available || !catalog.latestCycle) {
    catalog = await queryCatalog("historical");
    mode = "historical";
  }

  // Check if any data available
  if (!catalog.available) {
    return {
      cycleId: null,
      validTime: null,
      variableId,
      expression,
      region,
      mode,
      cycleExpired: false,
      status:
        catalog.unavailableReason === "catalog_unknown"
          ? "no_catalog"
          : "no_products",
      reason:
        catalog.unavailableReason === "catalog_unknown"
          ? "产品可用性未确认：权威目录尚未接入或暂不可访问"
          : "无已发布产品：当前查询范围没有通过发布检查的产品",
    };
  }

  if (!catalog.latestCycle) {
    return {
      cycleId: null,
      validTime: null,
      variableId,
      expression,
      region,
      mode,
      cycleExpired: false,
      status: "no_products",
      reason: "无已发布产品：当前查询范围没有通过发布检查的产品",
    };
  }

  // Select appropriate valid time
  const { validTime, cycleExpired } = selectValidTime(
    catalog.validTimes,
    mode
  );

  return {
    cycleId: catalog.latestCycle,
    validTime,
    variableId,
    expression,
    region,
    mode,
    cycleExpired,
    status: validTime ? "success" : "partial",
    reason: cycleExpired
      ? "周期已过期：所有有效时刻均已过去"
      : !validTime
        ? "无可用有效时刻"
        : undefined,
  };
}

/**
 * Check if a state resolution was successful
 *
 * @param result - State resolution result
 * @returns True if state is usable for analysis
 */
export function isResolutionSuccessful(
  result: StateResolutionResult
): boolean {
  return result.status === "success" && result.cycleId !== null;
}

/**
 * Get human-readable status message
 *
 * @param result - State resolution result
 * @returns Formatted status message
 */
export function getResolutionMessage(result: StateResolutionResult): string {
  if (result.status === "success") {
    if (result.cycleExpired) {
      return `已选择周期 ${result.cycleId}（周期已过期：所有有效时刻均已过去）`;
    }
    return `已选择周期 ${result.cycleId}，有效时刻 ${result.validTime}`;
  }

  return result.reason || "状态解析失败";
}
