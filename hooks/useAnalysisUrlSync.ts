"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAnalysisContext } from "@/stores/analysisContext";
import {
  encodeContextToUrl,
  decodeContextFromUrl,
  type AnalysisUrlParams,
} from "@/lib/urlSync";

/**
 * Hook to synchronize analysis context with URL query parameters
 *
 * Features:
 * - Restores context from URL on mount (priority over localStorage)
 * - Syncs Zustand store changes to URL via router.replace()
 * - Validates URL parameters and reports errors
 * - Works with browser back/forward buttons
 *
 * @returns Validation errors if any URL params were invalid
 */
export function useAnalysisUrlSync(): {
  urlErrors: string[];
  hasUrlParams: boolean;
} {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    selectedCycleId,
    selectedValidTime,
    selectedLeadTime,
    selectedVariableId,
    selectedExpression,
    selectedRegion,
    selectedBatchId,
    setSelectedCycleId,
    setSelectedValidTime,
    setSelectedLeadTime,
    setSelectedVariableId,
    setSelectedExpression,
    setSelectedRegion,
    setSelectedBatchId,
  } = useAnalysisContext();

  // Track whether we've restored from URL yet
  const hasRestoredFromUrl = useRef(false);
  // Track validation errors
  const urlErrorsRef = useRef<string[]>([]);
  // Track if URL had params on mount
  const hadUrlParamsRef = useRef(false);

  // Phase 1: Restore context from URL on mount (runs once)
  useEffect(() => {
    if (hasRestoredFromUrl.current) {
      return;
    }

    hasRestoredFromUrl.current = true;

    const { context, validation } = decodeContextFromUrl(searchParams);

    // Check if URL had any params
    hadUrlParamsRef.current = Object.keys(context).length > 0;

    // Store validation errors
    urlErrorsRef.current = validation.errors;

    // Only restore if we have valid params from URL
    if (hadUrlParamsRef.current && validation.valid) {
      // Restore each param if present (URL takes priority over localStorage)
      if (context.cycle !== undefined) {
        setSelectedCycleId(context.cycle);
      }
      if (context.validTime !== undefined) {
        setSelectedValidTime(context.validTime);
      }
      if (context.lead !== undefined) {
        setSelectedLeadTime(context.lead);
      }
      if (context.variable !== undefined) {
        setSelectedVariableId(context.variable);
      }
      if (context.expression !== undefined) {
        setSelectedExpression(context.expression);
      }
      if (context.region !== undefined) {
        setSelectedRegion(context.region);
      }
      if (context.batch !== undefined) {
        setSelectedBatchId(context.batch);
      }
    }
  }, [
    searchParams,
    setSelectedCycleId,
    setSelectedValidTime,
    setSelectedLeadTime,
    setSelectedVariableId,
    setSelectedExpression,
    setSelectedRegion,
    setSelectedBatchId,
  ]);

  // Phase 2: Sync Zustand store changes to URL (runs after restoration)
  useEffect(() => {
    // Don't sync until we've restored from URL
    if (!hasRestoredFromUrl.current) {
      return;
    }

    // Build current context from store
    const currentContext: AnalysisUrlParams = {
      cycle: selectedCycleId || undefined,
      validTime: selectedValidTime || undefined,
      lead: selectedLeadTime ?? undefined,
      variable: selectedVariableId || undefined,
      expression: selectedExpression || undefined,
      region: selectedRegion || undefined,
      batch: selectedBatchId || undefined,
    };

    // Encode to URL params
    const params = encodeContextToUrl(currentContext);
    const newSearch = params.toString();

    // Only update if different from current URL
    const currentSearch = searchParams.toString();
    if (newSearch !== currentSearch) {
      // Use router.replace() to avoid adding history entries
      const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [
    pathname,
    router,
    searchParams,
    selectedCycleId,
    selectedValidTime,
    selectedLeadTime,
    selectedVariableId,
    selectedExpression,
    selectedRegion,
    selectedBatchId,
  ]);

  return {
    urlErrors: urlErrorsRef.current,
    hasUrlParams: hadUrlParamsRef.current,
  };
}
