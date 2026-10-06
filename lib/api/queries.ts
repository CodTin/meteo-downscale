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
