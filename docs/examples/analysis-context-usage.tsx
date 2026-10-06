/**
 * Example: Using the Analysis Context Store
 *
 * This file demonstrates how to use the analysis context store
 * in React components to share state across forecast analysis pages.
 */

import { useAnalysisContext } from "@/stores/analysisContext";
import type { Region } from "@/stores/analysisContext.types";

/**
 * Example 1: Basic usage in a component
 */
export function CycleSelector() {
  const { selectedCycleId, setSelectedCycleId } = useAnalysisContext();

  const handleSelectCycle = (cycleId: string) => {
    setSelectedCycleId(cycleId);
  };

  return (
    <div>
      <h3>Select Forecast Cycle</h3>
      <select
        value={selectedCycleId ?? ""}
        onChange={(e) => handleSelectCycle(e.target.value)}
      >
        <option value="">-- Select Cycle --</option>
        <option value="2024-10-06T00:00:00Z">2024-10-06 00Z</option>
        <option value="2024-10-06T06:00:00Z">2024-10-06 06Z</option>
        <option value="2024-10-06T12:00:00Z">2024-10-06 12Z</option>
      </select>
      {selectedCycleId && <p>Selected: {selectedCycleId}</p>}
    </div>
  );
}

/**
 * Example 2: Variable selector
 */
export function VariableSelector() {
  const { selectedVariableId, setSelectedVariableId } = useAnalysisContext();

  const variables = [
    { id: "T2m", label: "温度 (Temperature)" },
    { id: "SP", label: "地表气压 (Surface Pressure)" },
    { id: "wind_speed", label: "风速 (Wind Speed)" },
    { id: "TP", label: "降水 (Precipitation)" },
  ] as const;

  return (
    <div>
      <h3>Select Variable</h3>
      {variables.map((variable) => (
        <button
          key={variable.id}
          onClick={() => setSelectedVariableId(variable.id)}
          style={{
            fontWeight: selectedVariableId === variable.id ? "bold" : "normal",
          }}
        >
          {variable.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Example 3: Region selector with complete region object
 */
export function RegionSelector() {
  const { selectedRegion, setSelectedRegion } = useAnalysisContext();

  const regions: Region[] = [
    {
      id: "sichuan-chongqing",
      name: "川渝",
      north: 33,
      south: 27,
      east: 108,
      west: 102,
    },
    {
      id: "north-china",
      name: "华北",
      north: 42,
      south: 35,
      east: 120,
      west: 110,
    },
  ];

  return (
    <div>
      <h3>Select Region</h3>
      {regions.map((region) => (
        <button
          key={region.id}
          onClick={() => setSelectedRegion(region)}
          style={{
            fontWeight: selectedRegion?.id === region.id ? "bold" : "normal",
          }}
        >
          {region.name}
        </button>
      ))}
      {selectedRegion && (
        <div>
          <p>Selected: {selectedRegion.name}</p>
          <p>
            Bounds: {selectedRegion.south}°N-{selectedRegion.north}°N,{" "}
            {selectedRegion.west}°E-{selectedRegion.east}°E
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Display current context
 */
export function AnalysisContextDisplay() {
  const {
    selectedCycleId,
    selectedValidTime,
    selectedLeadTime,
    selectedVariableId,
    selectedRegion,
    selectedBatchId,
  } = useAnalysisContext();

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
      <h3>Current Analysis Context</h3>
      <dl>
        <dt>Cycle:</dt>
        <dd>{selectedCycleId ?? "Not selected"}</dd>

        <dt>Valid Time:</dt>
        <dd>{selectedValidTime ?? "Not selected"}</dd>

        <dt>Lead Time:</dt>
        <dd>{selectedLeadTime ? `${selectedLeadTime}h` : "Not selected"}</dd>

        <dt>Variable:</dt>
        <dd>{selectedVariableId ?? "Not selected"}</dd>

        <dt>Region:</dt>
        <dd>{selectedRegion?.name ?? "Not selected"}</dd>

        <dt>Batch:</dt>
        <dd>{selectedBatchId ?? "Not selected"}</dd>
      </dl>
    </div>
  );
}

/**
 * Example 5: Reset all selections
 */
export function ResetButton() {
  const { reset } = useAnalysisContext();

  return (
    <button
      onClick={reset}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "0.25rem",
      }}
    >
      Reset All Selections
    </button>
  );
}

/**
 * Example 6: Using store outside React components
 */
export function logCurrentContext() {
  const state = useAnalysisContext.getState();
  console.log("Current analysis context:", {
    cycle: state.selectedCycleId,
    variable: state.selectedVariableId,
    region: state.selectedRegion?.name,
  });
}

/**
 * Example 7: Subscribe to state changes
 */
export function setupContextLogger() {
  const unsubscribe = useAnalysisContext.subscribe((state) => {
    console.log("Context updated:", state);
  });

  // Return cleanup function
  return unsubscribe;
}

/**
 * Example 8: Conditional rendering based on context
 */
export function Map2DView() {
  const { selectedCycleId, selectedVariableId, selectedRegion } =
    useAnalysisContext();

  // Don't render until required context is available
  if (!selectedCycleId || !selectedVariableId || !selectedRegion) {
    return (
      <div>
        <p>Please select cycle, variable, and region to view the map.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>2D Map View</h2>
      <p>
        Showing {selectedVariableId} for cycle {selectedCycleId}
      </p>
      <p>Region: {selectedRegion.name}</p>
      {/* Map component would go here */}
    </div>
  );
}
