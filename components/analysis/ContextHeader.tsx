"use client";

import { useState } from "react";
import { PencilIcon, ArrowPathIcon } from "@heroicons/react/16/solid";
import { useAnalysisContext } from "@/stores/analysisContext";
import { EditContextModal } from "./EditContextModal";
import { formatCycleDisplay, formatValidTimeDisplay, formatRegionDisplay } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ContextHeaderProps {
  className?: string;
}

/**
 * Context Header Component
 *
 * Displays current analysis context (cycle, valid time, variable, region, batch)
 * across all analysis sub-pages with Edit and Refresh actions.
 *
 * @example
 * ```tsx
 * <ContextHeader className="mb-4" />
 * ```
 */
export function ContextHeader({ className }: ContextHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [batchWarning, setBatchWarning] = useState<string | null>(null);

  const {
    selectedCycleId,
    selectedValidTime,
    selectedLeadTime,
    selectedVariableId,
    selectedRegion,
    selectedBatchId,
  } = useAnalysisContext();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setBatchWarning(null);

    try {
      // TODO: Call actual batch validation API
      // const response = await fetch(`/api/batches/${selectedBatchId}/validate`);
      // const data = await response.json();

      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate batch validation result
      // if (data.status === 'withdrawn') {
      //   setBatchWarning(`Batch withdrawn: ${data.reason}. Alternatives: ${data.alternatives.join(', ')}`);
      // }
    } catch (error) {
      console.error("Failed to validate batch:", error);
      setBatchWarning("Failed to validate batch availability");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format the context display string with separators
  const contextParts = [];

  if (selectedCycleId) {
    contextParts.push(
      <span key="cycle">Cycle: {formatCycleDisplay(selectedCycleId)}</span>
    );
  }

  if (selectedValidTime && selectedLeadTime !== null) {
    contextParts.push(
      <span key="valid">Valid: {formatValidTimeDisplay(selectedValidTime, selectedLeadTime)}</span>
    );
  }

  if (selectedVariableId) {
    contextParts.push(
      <span key="var">Var: {selectedVariableId}</span>
    );
  }

  if (selectedRegion) {
    contextParts.push(
      <span key="region">Region: {formatRegionDisplay(selectedRegion)}</span>
    );
  }

  if (selectedBatchId) {
    contextParts.push(
      <span key="batch">Batch: {selectedBatchId}</span>
    );
  }

  return (
    <>
      <div className={`flex items-center justify-between gap-4 ${className || ""}`}>
        <div className="flex items-center gap-3 flex-1">
          {contextParts.length > 0 ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              {contextParts.map((part, index) => (
                <div key={index} className="flex items-center gap-2">
                  {part}
                  {index < contextParts.length - 1 && (
                    <Separator orientation="vertical" className="h-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-neutral-500">No context selected</span>
          )}
          {batchWarning && (
            <Badge variant="destructive" className="gap-1">
              ⚠ {batchWarning}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Edit context parameters"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || !selectedBatchId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh batch status"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <EditContextModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}
