import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AnalysisContextStore,
  AnalysisContextState,
  CycleId,
  ValidTime,
  LeadTime,
  VariableId,
  DataExpression,
  Region,
  BatchId,
} from "./analysisContext.types";

/**
 * Initial state for the analysis context
 */
const initialState: AnalysisContextState = {
  selectedCycleId: null,
  selectedValidTime: null,
  selectedLeadTime: null,
  selectedVariableId: null,
  selectedExpression: null,
  selectedRegion: null,
  selectedBatchId: null,
};

/**
 * Analysis Context Store
 *
 * Shared Zustand store holding cycle/valid time/variable/region/batch state,
 * accessible across all forecast analysis pages.
 *
 * Persists to localStorage with key 'analysis-context-storage'.
 *
 * @example
 * ```tsx
 * function AnalysisPage() {
 *   const { selectedCycleId, setSelectedCycleId } = useAnalysisContext();
 *
 *   return (
 *     <button onClick={() => setSelectedCycleId('2024-10-06T12:00:00Z')}>
 *       Select Cycle
 *     </button>
 *   );
 * }
 * ```
 */
export const useAnalysisContext = create<AnalysisContextStore>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedCycleId: (cycleId: CycleId | null) =>
        set({ selectedCycleId: cycleId }),

      setSelectedValidTime: (validTime: ValidTime | null) =>
        set({ selectedValidTime: validTime }),

      setSelectedLeadTime: (leadTime: LeadTime | null) =>
        set({ selectedLeadTime: leadTime }),

      setSelectedVariableId: (variableId: VariableId | null) =>
        set({ selectedVariableId: variableId }),

      setSelectedExpression: (expression: DataExpression | null) =>
        set({ selectedExpression: expression }),

      setSelectedRegion: (region: Region | null) =>
        set({ selectedRegion: region }),

      setSelectedBatchId: (batchId: BatchId | null) =>
        set({ selectedBatchId: batchId }),

      reset: () => set(initialState),
    }),
    {
      name: "analysis-context-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Re-export types for convenience
 */
export type {
  AnalysisContextStore,
  AnalysisContextState,
  CycleId,
  ValidTime,
  LeadTime,
  VariableId,
  DataExpression,
  Region,
  BatchId,
} from "./analysisContext.types";
