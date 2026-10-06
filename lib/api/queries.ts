/**
 * TanStack Query Hooks
 *
 * React Query hooks for fetching cycles and product availability
 */

import { useQuery } from "@tanstack/react-query";
import { fetchCycles, fetchProductAvailability } from "@/lib/api/client";
import type { CyclesQueryParams } from "@/lib/api/types";

/**
 * Query for cycles list
 *
 * @param params - Query parameters for filtering cycles
 * @returns Query result with cycles data
 *
 * @example
 * ```tsx
 * const { data: cycles, isLoading, error } = useCyclesQuery({ status: 'published' });
 * ```
 */
export function useCyclesQuery(params: CyclesQueryParams = {}) {
  return useQuery({
    queryKey: ["cycles", params],
    queryFn: () => fetchCycles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes per requirements
    refetchOnWindowFocus: false, // Per DESIGN.md - no auto-refresh
  });
}

/**
 * Query for product availability
 *
 * @param cycleId - Cycle ID
 * @param leadTime - Lead time in hours
 * @param options - Query options
 * @returns Query result with product availability
 *
 * @example
 * ```tsx
 * const { data: product, isLoading } = useProductAvailabilityQuery(
 *   '2024-10-06T12:00:00Z',
 *   6
 * );
 * ```
 */
export function useProductAvailabilityQuery(
  cycleId: string | null | undefined,
  leadTime: number | null | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["product-availability", cycleId, leadTime],
    queryFn: () => {
      if (!cycleId || leadTime === null || leadTime === undefined) {
        throw new Error("Cycle ID and lead time are required");
      }
      return fetchProductAvailability(cycleId, leadTime);
    },
    staleTime: 60 * 1000, // 1 minute default
    refetchOnWindowFocus: false, // Per DESIGN.md
    enabled:
      options?.enabled !== false &&
      cycleId !== null &&
      cycleId !== undefined &&
      leadTime !== null &&
      leadTime !== undefined,
  });
}

/**
 * Query for batch validation
 *
 * Validates a batch ID and checks if it has been withdrawn
 *
 * @param batchId - Batch ID to validate
 * @param cycleId - Cycle ID the batch belongs to
 * @param options - Query options
 * @returns Query result with batch validation
 *
 * @example
 * ```tsx
 * const { data: validation, isLoading } = useBatchValidationQuery(
 *   'v2.3.1',
 *   '2024-10-06T12:00:00Z'
 * );
 * ```
 */
export function useBatchValidationQuery(
  batchId: string | null | undefined,
  cycleId: string | null | undefined,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) {
  return useQuery({
    queryKey: ["batch-validation", batchId, cycleId],
    queryFn: async () => {
      if (!batchId || !cycleId) {
        throw new Error("Batch ID and cycle ID are required");
      }
      const { validateBatch } = await import("@/lib/api/client");
      return validateBatch(batchId, cycleId);
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchInterval: options?.refetchInterval ?? false, // Optional polling
    enabled:
      options?.enabled !== false &&
      batchId !== null &&
      batchId !== undefined &&
      cycleId !== null &&
      cycleId !== undefined,
  });
}

/**
 * Query for checking new batch updates
 *
 * Polls for new batch publications for a cycle
 *
 * @param cycleId - Cycle ID to check
 * @param currentBatchId - Current batch ID
 * @param options - Query options including polling interval
 * @returns Query result with new batch notification if available
 *
 * @example
 * ```tsx
 * const { data: newBatch } = useBatchUpdateQuery(
 *   '2024-10-06T12:00:00Z',
 *   'v2.3.1',
 *   { refetchInterval: 60000 } // Poll every minute
 * );
 * ```
 */
export function useBatchUpdateQuery(
  cycleId: string | null | undefined,
  currentBatchId: string | null | undefined,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) {
  return useQuery({
    queryKey: ["batch-update", cycleId, currentBatchId],
    queryFn: async () => {
      if (!cycleId || !currentBatchId) {
        return null;
      }
      const { checkForNewBatch } = await import("@/lib/api/client");
      return checkForNewBatch(cycleId, currentBatchId);
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchInterval: options?.refetchInterval ?? false, // Optional polling
    enabled:
      options?.enabled !== false &&
      cycleId !== null &&
      cycleId !== undefined &&
      currentBatchId !== null &&
      currentBatchId !== undefined,
  });
}
