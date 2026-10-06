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
