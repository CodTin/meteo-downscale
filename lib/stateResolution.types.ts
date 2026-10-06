/**
 * Initial State Resolution Types
 *
 * Types for handling default entry logic and state initialization
 * per GLOSSARY.md specifications
 */

import type { Region, VariableId } from "@/stores/analysisContext.types";

/**
 * Data mode types (数据模式)
 * Historical replay vs business production
 */
export type DataMode = "historical" | "business";

/**
 * Product catalog query result
 */
export interface CatalogQueryResult {
  /** Whether the catalog is accessible */
  available: boolean;
  /** Latest published cycle in the mode */
  latestCycle: string | null;
  /** Available valid times for the cycle */
  validTimes: string[];
  /** Reason if unavailable */
  unavailableReason?: "catalog_unknown" | "no_products" | "query_failed";
}

/**
 * State resolution result
 */
export interface StateResolutionResult {
  /** Resolved cycle ID */
  cycleId: string | null;
  /** Resolved valid time */
  validTime: string | null;
  /** Resolved variable */
  variableId: VariableId;
  /** Resolved region */
  region: Region;
  /** Resolved data mode */
  mode: DataMode;
  /** Whether the cycle is expired (all times in past) */
  cycleExpired: boolean;
  /** Resolution status */
  status:
    | "success"
    | "no_catalog"
    | "no_products"
    | "partial"
    | "cycle_unavailable";
  /** Human-readable reason if not successful */
  reason?: string;
}

/**
 * Default region: 川渝示例矩形 (27–33°N, 102–108°E)
 * Per GLOSSARY.md specification
 */
export const DEFAULT_REGION: Region = {
  id: "sichuan-chongqing-example",
  name: "川渝",
  north: 33,
  south: 27,
  east: 108,
  west: 102,
};

/**
 * Default variable: Temperature (T2m)
 * Per GLOSSARY.md specification
 */
export const DEFAULT_VARIABLE: VariableId = "T2m";

/**
 * Default data expression: AI ensemble mean
 * Per GLOSSARY.md specification
 */
export const DEFAULT_EXPRESSION = "ai_ensemble_mean";
