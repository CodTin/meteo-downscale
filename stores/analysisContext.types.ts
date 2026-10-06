/**
 * Analysis Context Types
 *
 * Type definitions for the analysis context state shared across
 * all forecast analysis pages.
 */

/**
 * Geographic region definition
 * Matches GLOSSARY.md "业务区域" specification
 */
export interface Region {
  /** Unique identifier for the region */
  id: string;
  /** Display name */
  name: string;
  /** North boundary in degrees */
  north: number;
  /** South boundary in degrees */
  south: number;
  /** East boundary in degrees */
  east: number;
  /** West boundary in degrees */
  west: number;
  /** Optional mask for valid grid points */
  mask?: string;
}

/**
 * Cycle identifier (起报周期)
 * UTC timestamp of the forecast initialization time
 */
export type CycleId = string;

/**
 * Valid time (有效时刻)
 * UTC timestamp of the forecast valid time
 */
export type ValidTime = string;

/**
 * Lead time (时效)
 * Hours from cycle to valid time
 */
export type LeadTime = number;

/**
 * Variable identifier
 * T2m (temperature), SP (surface pressure), U10/V10 (wind), TP (precipitation)
 */
export type VariableId = "T2m" | "SP" | "U10" | "V10" | "wind_speed" | "TP";

/**
 * Batch identifier (产品批次)
 * Unique identifier for a published product batch
 */
export type BatchId = string;

/**
 * Analysis context state
 * Shared across all forecast analysis pages
 */
export interface AnalysisContextState {
  /** Currently selected forecast cycle */
  selectedCycleId: CycleId | null;
  /** Currently selected valid time */
  selectedValidTime: ValidTime | null;
  /** Currently selected lead time (hours) */
  selectedLeadTime: LeadTime | null;
  /** Currently selected meteorological variable */
  selectedVariableId: VariableId | null;
  /** Currently selected geographic region */
  selectedRegion: Region | null;
  /** Currently selected product batch */
  selectedBatchId: BatchId | null;
}

/**
 * Analysis context actions
 */
export interface AnalysisContextActions {
  /** Set the selected forecast cycle */
  setSelectedCycleId: (cycleId: CycleId | null) => void;
  /** Set the selected valid time */
  setSelectedValidTime: (validTime: ValidTime | null) => void;
  /** Set the selected lead time */
  setSelectedLeadTime: (leadTime: LeadTime | null) => void;
  /** Set the selected variable */
  setSelectedVariableId: (variableId: VariableId | null) => void;
  /** Set the selected region */
  setSelectedRegion: (region: Region | null) => void;
  /** Set the selected batch */
  setSelectedBatchId: (batchId: BatchId | null) => void;
  /** Reset all selections to null */
  reset: () => void;
}

/**
 * Complete analysis context store type
 */
export type AnalysisContextStore = AnalysisContextState & AnalysisContextActions;
