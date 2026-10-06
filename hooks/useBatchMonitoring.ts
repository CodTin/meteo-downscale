"use client";

import { useEffect, useState } from "react";
import { useBatchValidationQuery, useBatchUpdateQuery } from "@/lib/api/queries";
import type { BatchWithdrawal, BatchUpdateNotification } from "@/lib/api/batchTypes";

interface UseBatchMonitoringResult {
  /** Whether the current batch has been withdrawn */
  isWithdrawn: boolean;
  /** Withdrawal information if batch is withdrawn */
  withdrawal: BatchWithdrawal | null;
  /** New batch notification if available */
  newBatchAvailable: BatchUpdateNotification | null;
  /** Dismiss the new batch notification */
  dismissNewBatchNotification: () => void;
  /** Whether batch validation is loading */
  isValidating: boolean;
}

/**
 * Hook for monitoring batch status and updates
 *
 * Polls for batch withdrawals and new batch publications, providing
 * notifications when changes are detected.
 *
 * @param batchId - Current batch ID
 * @param cycleId - Current cycle ID
 * @param options - Monitoring options
 * @returns Batch monitoring state
 *
 * @example
 * ```tsx
 * const {
 *   isWithdrawn,
 *   withdrawal,
 *   newBatchAvailable,
 *   dismissNewBatchNotification
 * } = useBatchMonitoring('v2.3.1', '2024-10-06T12:00:00Z', {
 *   enablePolling: true,
 *   pollInterval: 60000 // 1 minute
 * });
 * ```
 */
export function useBatchMonitoring(
  batchId: string | null | undefined,
  cycleId: string | null | undefined,
  options?: {
    enablePolling?: boolean;
    pollInterval?: number;
  }
): UseBatchMonitoringResult {
  const { enablePolling = false, pollInterval = 60000 } = options || {};

  const [dismissedNewBatch, setDismissedNewBatch] = useState(false);

  // Query for batch validation (checks for withdrawal)
  const {
    data: validationResult,
    isLoading: isValidating,
  } = useBatchValidationQuery(batchId, cycleId, {
    enabled: !!batchId && !!cycleId,
    refetchInterval: enablePolling ? pollInterval : false,
  });

  // Query for new batch updates
  const { data: newBatchData } = useBatchUpdateQuery(cycleId, batchId, {
    enabled: !!batchId && !!cycleId && enablePolling,
    refetchInterval: enablePolling ? pollInterval : false,
  });

  // Reset dismissed state when batch ID changes
  useEffect(() => {
    setDismissedNewBatch(false);
  }, [batchId]);

  const isWithdrawn =
    validationResult?.status === "withdrawn" && !validationResult.valid;
  const withdrawal = validationResult?.withdrawal || null;

  const newBatchAvailable = dismissedNewBatch ? null : (newBatchData ?? null);

  const dismissNewBatchNotification = () => {
    setDismissedNewBatch(true);
  };

  return {
    isWithdrawn,
    withdrawal,
    newBatchAvailable,
    dismissNewBatchNotification,
    isValidating,
  };
}
