/**
 * React hook for initial state resolution
 *
 * Handles default entry logic and state initialization for forecast analysis pages
 */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAnalysisContext } from "@/stores/analysisContext";
import { resolveInitialState } from "@/lib/stateResolution";
import type { StateResolutionResult } from "@/lib/stateResolution.types";

/**
 * Hook to resolve and apply initial state on first entry
 *
 * @param requestedCycle - Optional specific cycle from URL parameters
 * @returns State resolution result and loading state
 */
export function useInitialStateResolution(requestedCycle?: string) {
  const searchParams = useSearchParams();
  const [resolution, setResolution] = useState<StateResolutionResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedCycleId,
    selectedVariableId,
    selectedExpression,
    selectedRegion,
    setSelectedCycleId,
    setSelectedValidTime,
    setSelectedVariableId,
    setSelectedExpression,
    setSelectedRegion,
  } = useAnalysisContext();

  useEffect(() => {
    // Only resolve if store is empty (first entry)
    if (selectedCycleId || selectedVariableId || selectedRegion) {
      setLoading(false);
      return;
    }

    async function resolve() {
      try {
        setLoading(true);

        // Parse cycle from URL params if not explicitly provided
        const cycleFromUrl = searchParams?.get("cycle") || requestedCycle;

        const result = await resolveInitialState(cycleFromUrl || undefined);
        setResolution(result);

        // Apply resolved state to store
        if (result.cycleId) {
          setSelectedCycleId(result.cycleId);
        }
        if (result.validTime) {
          setSelectedValidTime(result.validTime);
        }
        setSelectedVariableId(result.variableId);
        setSelectedExpression(result.expression);
        setSelectedRegion(result.region);

        if (result.status !== "success") {
          setError(result.reason || "Failed to resolve initial state");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    resolve();
  }, [
    requestedCycle,
    searchParams,
    selectedCycleId,
    selectedVariableId,
    selectedExpression,
    selectedRegion,
    setSelectedCycleId,
    setSelectedValidTime,
    setSelectedVariableId,
    setSelectedExpression,
    setSelectedRegion,
  ]);

  return {
    resolution,
    loading,
    error,
  };
}

/**
 * Hook to check if initial state needs resolution
 *
 * @returns True if state needs initialization
 */
export function useNeedsStateResolution(): boolean {
  const { selectedCycleId, selectedVariableId, selectedRegion } =
    useAnalysisContext();

  return !selectedCycleId && !selectedVariableId && !selectedRegion;
}
