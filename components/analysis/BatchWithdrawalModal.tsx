"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BatchWithdrawal } from "@/lib/api/batchTypes";

interface BatchWithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  withdrawal: BatchWithdrawal;
  onSwitchBatch: (newBatchId: string) => void;
}

/**
 * Batch Withdrawal Modal
 *
 * Displays withdrawal information when a batch is no longer available,
 * showing reason, timestamp, operator, and alternative batches.
 *
 * @example
 * ```tsx
 * <BatchWithdrawalModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   batchId="v2.3.1"
 *   withdrawal={withdrawalInfo}
 *   onSwitchBatch={(newId) => handleSwitch(newId)}
 * />
 * ```
 */
export function BatchWithdrawalModal({
  open,
  onOpenChange,
  batchId,
  withdrawal,
  onSwitchBatch,
}: BatchWithdrawalModalProps) {
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(
    withdrawal.alternatives[0] || null
  );

  const handleSwitch = () => {
    if (selectedAlternative) {
      onSwitchBatch(selectedAlternative);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Batch Withdrawn
          </DialogTitle>
          <DialogDescription>
            Batch <strong>{batchId}</strong> has been withdrawn and is no longer
            available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Withdrawal reason */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-1">
              Reason
            </h4>
            <p className="text-sm text-neutral-700">{withdrawal.reason}</p>
          </div>

          {/* Withdrawal timestamp */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-1">
              Withdrawn At
            </h4>
            <p className="text-sm text-neutral-700">
              {new Date(withdrawal.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Operator */}
          <div>
            <h4 className="text-sm font-medium text-neutral-900 mb-1">
              Withdrawn By
            </h4>
            <p className="text-sm text-neutral-700">{withdrawal.operator}</p>
          </div>

          {/* Alternative batches */}
          {withdrawal.alternatives.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-2">
                Alternative Batches
              </h4>
              <div className="space-y-2">
                {withdrawal.alternatives.map((altBatchId) => (
                  <label
                    key={altBatchId}
                    className="flex items-center space-x-2 p-2 border border-neutral-200 rounded cursor-pointer hover:bg-neutral-50"
                  >
                    <input
                      type="radio"
                      name="alternative-batch"
                      value={altBatchId}
                      checked={selectedAlternative === altBatchId}
                      onChange={() => setSelectedAlternative(altBatchId)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-neutral-900">
                      {altBatchId}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {withdrawal.alternatives.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded">
              <p className="text-sm text-amber-900">
                No alternative batches are currently available.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Stay on Current View
          </Button>
          {withdrawal.alternatives.length > 0 && (
            <Button
              type="button"
              onClick={handleSwitch}
              disabled={!selectedAlternative}
            >
              Switch to {selectedAlternative}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
