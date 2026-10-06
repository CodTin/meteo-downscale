/**
 * URL Synchronization for Analysis Context
 *
 * Handles encoding/decoding analysis context to/from URL query parameters
 * for shareable deep links.
 *
 * Format: ?cycle=2024-03-15-00Z&validTime=2024-03-17T12:00Z&lead=60&variable=10m_wind&region=27,102,33,108&batch=v2.3.1
 */

import type {
  CycleId,
  ValidTime,
  LeadTime,
  VariableId,
  BatchId,
  Region,
  DataExpression,
} from "@/stores/analysisContext.types";

/**
 * Analysis context URL parameters
 */
export interface AnalysisUrlParams {
  cycle?: CycleId;
  validTime?: ValidTime;
  lead?: LeadTime;
  variable?: VariableId;
  expression?: DataExpression;
  region?: Region;
  batch?: BatchId;
}

/**
 * Encode a region to URL parameter format
 * Format: "south,west,north,east" (e.g., "27,102,33,108")
 *
 * @param region - Region object
 * @returns Encoded region string
 */
export function encodeRegionToUrl(region: Region): string {
  return `${region.south},${region.west},${region.north},${region.east}`;
}

/**
 * Decode a region from URL parameter format
 * Format: "south,west,north,east" (e.g., "27,102,33,108")
 *
 * @param regionStr - Encoded region string
 * @returns Decoded region object or null if invalid
 */
export function decodeRegionFromUrl(regionStr: string): Region | null {
  try {
    const parts = regionStr.split(",").map((s) => parseFloat(s.trim()));

    if (parts.length !== 4 || parts.some((n) => isNaN(n))) {
      return null;
    }

    const [south, west, north, east] = parts;

    // Validate coordinate ranges
    if (
      south < -90 ||
      south > 90 ||
      north < -90 ||
      north > 90 ||
      west < -180 ||
      west > 180 ||
      east < -180 ||
      east > 180
    ) {
      return null;
    }

    if (south >= north || west >= east) {
      return null;
    }

    return {
      id: `custom-${south}-${west}-${north}-${east}`,
      name: `Custom (${south}°S, ${west}°W, ${north}°N, ${east}°E)`,
      south,
      west,
      north,
      east,
    };
  } catch {
    return null;
  }
}

/**
 * Encode analysis context to URL search params
 *
 * @param context - Analysis context to encode
 * @returns URLSearchParams object
 */
export function encodeContextToUrl(context: AnalysisUrlParams): URLSearchParams {
  const params = new URLSearchParams();

  if (context.cycle) {
    params.set("cycle", context.cycle);
  }

  if (context.validTime) {
    params.set("validTime", context.validTime);
  }

  if (context.lead !== undefined && context.lead !== null) {
    params.set("lead", context.lead.toString());
  }

  if (context.variable) {
    params.set("variable", context.variable);
  }

  if (context.expression) {
    params.set("expression", context.expression);
  }

  if (context.region) {
    params.set("region", encodeRegionToUrl(context.region));
  }

  if (context.batch) {
    params.set("batch", context.batch);
  }

  return params;
}

/**
 * Validation result for URL parameters
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a cycle ID format
 * Expected format: ISO 8601 datetime (e.g., "2024-03-15T00:00:00Z" or "2024-03-15-00Z")
 *
 * @param cycleId - Cycle ID to validate
 * @returns True if valid format
 */
export function isValidCycleId(cycleId: string): boolean {
  // ISO 8601 format or simplified format
  const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  const simplifiedPattern = /^\d{4}-\d{2}-\d{2}-\d{2}Z$/;

  return isoPattern.test(cycleId) || simplifiedPattern.test(cycleId);
}

/**
 * Validate a variable ID
 *
 * @param variable - Variable ID to validate
 * @returns True if valid
 */
export function isValidVariable(variable: string): boolean {
  const validVariables: VariableId[] = [
    "T2m",
    "SP",
    "U10",
    "V10",
    "wind_speed",
    "TP",
  ];
  return validVariables.includes(variable as VariableId);
}

/**
 * Validate a data expression
 *
 * @param expression - Data expression to validate
 * @returns True if valid
 */
export function isValidExpression(expression: string): boolean {
  const validExpressions: DataExpression[] = [
    "ai_ensemble_mean",
    "ai_ensemble_median",
    "ec_deterministic",
    "specific_member",
  ];
  return validExpressions.includes(expression as DataExpression);
}

/**
 * Decode and validate analysis context from URL search params
 *
 * @param searchParams - URLSearchParams from URL
 * @returns Decoded context and validation result
 */
export function decodeContextFromUrl(searchParams: URLSearchParams): {
  context: AnalysisUrlParams;
  validation: ValidationResult;
} {
  const context: AnalysisUrlParams = {};
  const errors: string[] = [];

  // Decode cycle
  const cycle = searchParams.get("cycle");
  if (cycle) {
    if (isValidCycleId(cycle)) {
      context.cycle = cycle;
    } else {
      errors.push(`Invalid cycle ID format: ${cycle}`);
    }
  }

  // Decode valid time
  const validTime = searchParams.get("validTime");
  if (validTime) {
    // Validate ISO 8601 datetime
    const date = new Date(validTime);
    if (!isNaN(date.getTime())) {
      context.validTime = validTime;
    } else {
      errors.push(`Invalid valid time format: ${validTime}`);
    }
  }

  // Decode lead time
  const lead = searchParams.get("lead");
  if (lead) {
    const leadNum = parseInt(lead, 10);
    if (!isNaN(leadNum) && leadNum >= 0) {
      context.lead = leadNum;
    } else {
      errors.push(`Invalid lead time: ${lead}`);
    }
  }

  // Decode variable
  const variable = searchParams.get("variable");
  if (variable) {
    if (isValidVariable(variable)) {
      context.variable = variable as VariableId;
    } else {
      errors.push(`Invalid variable: ${variable}`);
    }
  }

  // Decode expression
  const expression = searchParams.get("expression");
  if (expression) {
    if (isValidExpression(expression)) {
      context.expression = expression as DataExpression;
    } else {
      errors.push(`Invalid expression: ${expression}`);
    }
  }

  // Decode region
  const region = searchParams.get("region");
  if (region) {
    const decoded = decodeRegionFromUrl(region);
    if (decoded) {
      context.region = decoded;
    } else {
      errors.push(`Invalid region format: ${region}`);
    }
  }

  // Decode batch
  const batch = searchParams.get("batch");
  if (batch) {
    // Basic validation: non-empty string
    if (batch.trim().length > 0) {
      context.batch = batch;
    } else {
      errors.push("Invalid batch ID: empty string");
    }
  }

  return {
    context,
    validation: {
      valid: errors.length === 0,
      errors,
    },
  };
}
