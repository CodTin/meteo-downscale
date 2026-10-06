"use client";

import { useState, useEffect } from "react";
import { useAnalysisContext } from "@/stores/analysisContext";
import type { Region, VariableId } from "@/stores/analysisContext.types";

interface EditContextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Edit Context Modal Component
 *
 * Modal dialog for editing analysis context parameters.
 * Updates the Zustand store on save.
 */
export function EditContextModal({ open, onOpenChange }: EditContextModalProps) {
  const {
    selectedCycleId,
    selectedValidTime,
    selectedLeadTime,
    selectedVariableId,
    selectedRegion,
    selectedBatchId,
    setSelectedCycleId,
    setSelectedValidTime,
    setSelectedLeadTime,
    setSelectedVariableId,
    setSelectedRegion,
    setSelectedBatchId,
  } = useAnalysisContext();

  // Local form state
  const [cycleId, setCycleId] = useState(selectedCycleId || "");
  const [validTime, setValidTime] = useState(selectedValidTime || "");
  const [leadTime, setLeadTime] = useState(selectedLeadTime?.toString() || "");
  const [variableId, setVariableId] = useState<VariableId | "">(selectedVariableId || "");
  const [regionId, setRegionId] = useState(selectedRegion?.id || "");
  const [batchId, setBatchId] = useState(selectedBatchId || "");

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setCycleId(selectedCycleId || "");
      setValidTime(selectedValidTime || "");
      setLeadTime(selectedLeadTime?.toString() || "");
      setVariableId(selectedVariableId || "");
      setRegionId(selectedRegion?.id || "");
      setBatchId(selectedBatchId || "");
    }
  }, [open, selectedCycleId, selectedValidTime, selectedLeadTime, selectedVariableId, selectedRegion, selectedBatchId]);

  const handleSave = () => {
    // Update store with new values
    setSelectedCycleId(cycleId || null);
    setSelectedValidTime(validTime || null);
    setSelectedLeadTime(leadTime ? parseInt(leadTime, 10) : null);
    setSelectedVariableId(variableId || null);

    // For region, preserve existing region data if only updating the ID
    if (regionId) {
      // If current region exists and ID matches, keep it
      if (selectedRegion && selectedRegion.id === regionId) {
        setSelectedRegion(selectedRegion);
      } else {
        // Create new region object - coordinates should be set by parent component
        // or fetched from API in production
        const newRegion: Region = {
          id: regionId,
          name: regionId, // Will be updated when proper region data is loaded
          north: selectedRegion?.north ?? 0,
          south: selectedRegion?.south ?? 0,
          east: selectedRegion?.east ?? 0,
          west: selectedRegion?.west ?? 0,
        };
        setSelectedRegion(newRegion);
      }
    } else {
      setSelectedRegion(null);
    }

    setSelectedBatchId(batchId || null);

    // Close modal
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Edit Analysis Context
        </h2>

        <div className="space-y-4">
          {/* Cycle */}
          <div>
            <label htmlFor="cycle" className="block text-sm font-medium text-neutral-500 mb-1">
              Cycle (UTC)
            </label>
            <input
              id="cycle"
              type="text"
              value={cycleId}
              onChange={(e) => setCycleId(e.target.value)}
              placeholder="2024-03-15T00:00:00Z"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Valid Time */}
          <div>
            <label htmlFor="validTime" className="block text-sm font-medium text-neutral-500 mb-1">
              Valid Time (UTC)
            </label>
            <input
              id="validTime"
              type="text"
              value={validTime}
              onChange={(e) => setValidTime(e.target.value)}
              placeholder="2024-03-17T12:00:00Z"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Lead Time */}
          <div>
            <label htmlFor="leadTime" className="block text-sm font-medium text-neutral-500 mb-1">
              Lead Time (hours)
            </label>
            <input
              id="leadTime"
              type="number"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              placeholder="60"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Variable */}
          <div>
            <label htmlFor="variable" className="block text-sm font-medium text-neutral-500 mb-1">
              Variable
            </label>
            <select
              id="variable"
              value={variableId}
              onChange={(e) => setVariableId(e.target.value as VariableId | "")}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select variable</option>
              <option value="T2m">T2m (Temperature)</option>
              <option value="SP">SP (Surface Pressure)</option>
              <option value="U10">U10 (U-wind)</option>
              <option value="V10">V10 (V-wind)</option>
              <option value="wind_speed">Wind Speed</option>
              <option value="TP">TP (Precipitation)</option>
            </select>
          </div>

          {/* Region */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-neutral-500 mb-1">
              Region
            </label>
            <input
              id="region"
              type="text"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              placeholder="East China"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Batch */}
          <div>
            <label htmlFor="batch" className="block text-sm font-medium text-neutral-500 mb-1">
              Batch
            </label>
            <input
              id="batch"
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="v2.3.1"
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
