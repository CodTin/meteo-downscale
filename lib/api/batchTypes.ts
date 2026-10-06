/**
 * Batch Validation and Withdrawal Types
 *
 * Types for batch update detection and withdrawal handling
 */

/**
 * Batch status
 */
export type BatchStatus = "published" | "withdrawn" | "unavailable";

/**
 * Batch information
 */
export interface Batch {
  /** Batch ID */
  id: string;
  /** Cycle ID this batch belongs to */
  cycleId: string;
  /** Publication timestamp */
  publishedAt: string;
  /** Status */
  status: BatchStatus;
  /** Withdrawal information if withdrawn */
  withdrawal?: BatchWithdrawal;
}

/**
 * Batch withdrawal information
 */
export interface BatchWithdrawal {
  /** Reason for withdrawal */
  reason: string;
  /** Timestamp of withdrawal */
  timestamp: string;
  /** Operator who withdrew the batch */
  operator: string;
  /** Alternative batch IDs */
  alternatives: string[];
}

/**
 * Batch validation result
 */
export interface BatchValidationResult {
  /** Whether the batch is valid and available */
  valid: boolean;
  /** Current batch status */
  status: BatchStatus;
  /** Batch information if available */
  batch?: Batch;
  /** Withdrawal information if withdrawn */
  withdrawal?: BatchWithdrawal;
  /** Error message if validation failed */
  error?: string;
}

/**
 * Batch update notification
 */
export interface BatchUpdateNotification {
  /** Current batch ID */
  currentBatchId: string;
  /** New batch ID available */
  newBatchId: string;
  /** Cycle ID */
  cycleId: string;
  /** Publication timestamp of new batch */
  publishedAt: string;
}
