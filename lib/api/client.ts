/**
 * API Client for Product Catalog
 *
 * Handles all server requests for cycles, products, and availability
 */

import type {
  Cycle,
  ProductAvailability,
  CyclesQueryParams,
} from "./types";

/**
 * Fetch cycles list from product catalog
 *
 * @param params - Query parameters
 * @returns List of cycles with status
 */
export async function fetchCycles(
  params: CyclesQueryParams = {}
): Promise<Cycle[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/cycles?' + new URLSearchParams(params));
  // return response.json();

  // Mock implementation
  console.log("Fetching cycles with params:", params);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return empty array for now
  // In production, this would return actual catalog data
  return [];
}

/**
 * Fetch product availability for specific cycle and lead time
 *
 * @param cycleId - Cycle ID
 * @param leadTime - Lead time in hours
 * @returns Product availability information
 */
export async function fetchProductAvailability(
  cycleId: string,
  leadTime: number
): Promise<ProductAvailability> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/products/${cycleId}/${leadTime}`);
  // return response.json();

  // Mock implementation
  console.log(`Fetching product availability: ${cycleId}, lead ${leadTime}h`);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return unavailable state by default
  return {
    available: false,
    state: "产品可用性未确认",
    cycleId,
    leadTime,
    reason: "权威目录尚未接入或暂不可访问",
  };
}

/**
 * Fetch latest published cycle
 *
 * @param mode - Data mode (business or historical)
 * @returns Latest cycle or null
 */
export async function fetchLatestCycle(
  mode: "business" | "historical" = "business"
): Promise<Cycle | null> {
  const cycles = await fetchCycles({ status: "published", mode });
  return cycles.length > 0 ? cycles[0] : null;
}

/**
 * Validate a batch ID and check its current status
 *
 * @param batchId - Batch ID to validate
 * @param cycleId - Cycle ID the batch belongs to
 * @returns Batch validation result
 */
export async function validateBatch(
  batchId: string,
  cycleId: string
): Promise<import("./batchTypes").BatchValidationResult> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/batches/${batchId}/validate?cycle=${cycleId}`);
  // return response.json();

  console.log(`Validating batch: ${batchId} for cycle ${cycleId}`);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock implementation - assume batch is valid by default
  return {
    valid: true,
    status: "published",
    batch: {
      id: batchId,
      cycleId,
      publishedAt: new Date().toISOString(),
      status: "published",
    },
  };
}

/**
 * Check for new batches available for a cycle
 *
 * @param cycleId - Cycle ID to check
 * @param currentBatchId - Current batch ID
 * @returns New batch notification if available, null otherwise
 */
export async function checkForNewBatch(
  cycleId: string,
  currentBatchId: string
): Promise<import("./batchTypes").BatchUpdateNotification | null> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/cycles/${cycleId}/batches/latest`);
  // const latest = await response.json();
  // if (latest.id !== currentBatchId) return latest;
  // return null;

  console.log(
    `Checking for new batch: cycle=${cycleId}, current=${currentBatchId}`
  );

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock implementation - no new batch by default
  return null;
}
