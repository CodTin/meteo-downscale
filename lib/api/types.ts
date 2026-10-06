/**
 * Product State Types
 *
 * Defines GLOSSARY.md product states for TanStack Query responses
 */

/**
 * Product states per GLOSSARY.md
 */
export type ProductState =
  | "已发布" // Published: passed quality checks and released
  | "未发布" // Not published: production incomplete or not released
  | "产品可用性未确认" // Availability unconfirmed: catalog inaccessible
  | "无已发布产品"; // No published products: catalog accessible but no products

/**
 * Cycle with status information
 */
export interface Cycle {
  /** Cycle ID (UTC timestamp) */
  id: string;
  /** Data mode */
  mode: "business" | "historical";
  /** Product state */
  state: ProductState;
  /** Available lead times (hours) */
  leadTimes: number[];
  /** Processing completion time */
  completedAt?: string;
  /** Reason if not published */
  reason?: string;
}

/**
 * Product availability information
 */
export interface ProductAvailability {
  /** Whether product is available */
  available: boolean;
  /** Product state */
  state: ProductState;
  /** Cycle ID */
  cycleId: string;
  /** Lead time (hours) */
  leadTime: number;
  /** Batch ID if published */
  batchId?: string;
  /** Member completeness (0-10) */
  memberCount?: number;
  /** Reason if not available */
  reason?: string;
}

/**
 * Cycles list query parameters
 */
export interface CyclesQueryParams {
  /** Filter by status */
  status?: "published" | "unpublished" | "all";
  /** Filter by mode */
  mode?: "business" | "historical";
  /** Date range start */
  startDate?: string;
  /** Date range end */
  endDate?: string;
}
