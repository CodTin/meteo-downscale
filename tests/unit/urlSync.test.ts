import { describe, it, expect } from "vitest";
import {
  encodeRegionToUrl,
  decodeRegionFromUrl,
  encodeContextToUrl,
  decodeContextFromUrl,
  isValidCycleId,
  isValidVariable,
  isValidExpression,
  type AnalysisUrlParams,
} from "@/lib/urlSync";
import type { Region } from "@/stores/analysisContext.types";

describe("urlSync", () => {
  describe("encodeRegionToUrl", () => {
    it("encodes region to south,west,north,east format", () => {
      const region: Region = {
        id: "sichuan",
        name: "Sichuan",
        south: 27,
        west: 102,
        north: 33,
        east: 108,
      };

      expect(encodeRegionToUrl(region)).toBe("27,102,33,108");
    });

    it("handles decimal coordinates", () => {
      const region: Region = {
        id: "custom",
        name: "Custom",
        south: 27.5,
        west: 102.25,
        north: 33.75,
        east: 108.5,
      };

      expect(encodeRegionToUrl(region)).toBe("27.5,102.25,33.75,108.5");
    });
  });

  describe("decodeRegionFromUrl", () => {
    it("decodes valid region string", () => {
      const result = decodeRegionFromUrl("27,102,33,108");

      expect(result).not.toBeNull();
      expect(result?.south).toBe(27);
      expect(result?.west).toBe(102);
      expect(result?.north).toBe(33);
      expect(result?.east).toBe(108);
      expect(result?.id).toBe("custom-27-102-33-108");
    });

    it("handles decimal coordinates", () => {
      const result = decodeRegionFromUrl("27.5,102.25,33.75,108.5");

      expect(result).not.toBeNull();
      expect(result?.south).toBe(27.5);
      expect(result?.west).toBe(102.25);
      expect(result?.north).toBe(33.75);
      expect(result?.east).toBe(108.5);
    });

    it("returns null for invalid format (wrong number of parts)", () => {
      expect(decodeRegionFromUrl("27,102,33")).toBeNull();
      expect(decodeRegionFromUrl("27,102,33,108,extra")).toBeNull();
    });

    it("returns null for non-numeric values", () => {
      expect(decodeRegionFromUrl("27,abc,33,108")).toBeNull();
    });

    it("returns null for out-of-range coordinates", () => {
      expect(decodeRegionFromUrl("-91,102,33,108")).toBeNull(); // south < -90
      expect(decodeRegionFromUrl("27,102,91,108")).toBeNull(); // north > 90
      expect(decodeRegionFromUrl("27,-181,33,108")).toBeNull(); // west < -180
      expect(decodeRegionFromUrl("27,102,33,181")).toBeNull(); // east > 180
    });

    it("returns null for invalid bounds (south >= north)", () => {
      expect(decodeRegionFromUrl("33,102,27,108")).toBeNull();
      expect(decodeRegionFromUrl("30,102,30,108")).toBeNull();
    });

    it("returns null for invalid bounds (west >= east)", () => {
      expect(decodeRegionFromUrl("27,108,33,102")).toBeNull();
      expect(decodeRegionFromUrl("27,105,33,105")).toBeNull();
    });
  });

  describe("isValidCycleId", () => {
    it("accepts ISO 8601 format with Z", () => {
      expect(isValidCycleId("2024-03-15T00:00:00Z")).toBe(true);
      expect(isValidCycleId("2024-12-31T23:59:59Z")).toBe(true);
    });

    it("accepts simplified format", () => {
      expect(isValidCycleId("2024-03-15-00Z")).toBe(true);
      expect(isValidCycleId("2024-12-31-23Z")).toBe(true);
    });

    it("rejects invalid formats", () => {
      expect(isValidCycleId("2024-03-15")).toBe(false);
      expect(isValidCycleId("2024-03-15T00:00:00")).toBe(false); // missing Z
      expect(isValidCycleId("invalid")).toBe(false);
      expect(isValidCycleId("")).toBe(false);
    });
  });

  describe("isValidVariable", () => {
    it("accepts valid variable IDs", () => {
      expect(isValidVariable("T2m")).toBe(true);
      expect(isValidVariable("SP")).toBe(true);
      expect(isValidVariable("U10")).toBe(true);
      expect(isValidVariable("V10")).toBe(true);
      expect(isValidVariable("wind_speed")).toBe(true);
      expect(isValidVariable("TP")).toBe(true);
    });

    it("rejects invalid variable IDs", () => {
      expect(isValidVariable("invalid")).toBe(false);
      expect(isValidVariable("temp")).toBe(false);
      expect(isValidVariable("")).toBe(false);
    });
  });

  describe("isValidExpression", () => {
    it("accepts valid expressions", () => {
      expect(isValidExpression("ai_ensemble_mean")).toBe(true);
      expect(isValidExpression("ai_ensemble_median")).toBe(true);
      expect(isValidExpression("ec_deterministic")).toBe(true);
      expect(isValidExpression("specific_member")).toBe(true);
    });

    it("rejects invalid expressions", () => {
      expect(isValidExpression("invalid")).toBe(false);
      expect(isValidExpression("mean")).toBe(false);
      expect(isValidExpression("")).toBe(false);
    });
  });

  describe("encodeContextToUrl", () => {
    it("encodes full context to URL params", () => {
      const context: AnalysisUrlParams = {
        cycle: "2024-03-15T00:00:00Z",
        validTime: "2024-03-17T12:00:00Z",
        lead: 60,
        variable: "T2m",
        expression: "ai_ensemble_mean",
        region: {
          id: "sichuan",
          name: "Sichuan",
          south: 27,
          west: 102,
          north: 33,
          east: 108,
        },
        batch: "v2.3.1",
      };

      const params = encodeContextToUrl(context);

      expect(params.get("cycle")).toBe("2024-03-15T00:00:00Z");
      expect(params.get("validTime")).toBe("2024-03-17T12:00:00Z");
      expect(params.get("lead")).toBe("60");
      expect(params.get("variable")).toBe("T2m");
      expect(params.get("expression")).toBe("ai_ensemble_mean");
      expect(params.get("region")).toBe("27,102,33,108");
      expect(params.get("batch")).toBe("v2.3.1");
    });

    it("handles partial context", () => {
      const context: AnalysisUrlParams = {
        cycle: "2024-03-15T00:00:00Z",
        variable: "T2m",
      };

      const params = encodeContextToUrl(context);

      expect(params.get("cycle")).toBe("2024-03-15T00:00:00Z");
      expect(params.get("variable")).toBe("T2m");
      expect(params.get("validTime")).toBeNull();
      expect(params.get("lead")).toBeNull();
      expect(params.get("batch")).toBeNull();
    });

    it("handles empty context", () => {
      const context: AnalysisUrlParams = {};
      const params = encodeContextToUrl(context);

      expect(params.toString()).toBe("");
    });

    it("handles lead time of 0", () => {
      const context: AnalysisUrlParams = {
        lead: 0,
      };

      const params = encodeContextToUrl(context);
      expect(params.get("lead")).toBe("0");
    });
  });

  describe("decodeContextFromUrl", () => {
    it("decodes full valid context", () => {
      const searchParams = new URLSearchParams({
        cycle: "2024-03-15T00:00:00Z",
        validTime: "2024-03-17T12:00:00Z",
        lead: "60",
        variable: "T2m",
        expression: "ai_ensemble_mean",
        region: "27,102,33,108",
        batch: "v2.3.1",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(context.cycle).toBe("2024-03-15T00:00:00Z");
      expect(context.validTime).toBe("2024-03-17T12:00:00Z");
      expect(context.lead).toBe(60);
      expect(context.variable).toBe("T2m");
      expect(context.expression).toBe("ai_ensemble_mean");
      expect(context.region?.south).toBe(27);
      expect(context.region?.north).toBe(33);
      expect(context.batch).toBe("v2.3.1");
    });

    it("validates invalid cycle ID", () => {
      const searchParams = new URLSearchParams({
        cycle: "invalid-cycle",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid cycle ID format: invalid-cycle");
      expect(context.cycle).toBeUndefined();
    });

    it("validates invalid valid time", () => {
      const searchParams = new URLSearchParams({
        validTime: "not-a-date",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid valid time format: not-a-date");
      expect(context.validTime).toBeUndefined();
    });

    it("validates invalid lead time", () => {
      const searchParams = new URLSearchParams({
        lead: "abc",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid lead time: abc");
      expect(context.lead).toBeUndefined();
    });

    it("rejects negative lead time", () => {
      const searchParams = new URLSearchParams({
        lead: "-5",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid lead time: -5");
    });

    it("validates invalid variable", () => {
      const searchParams = new URLSearchParams({
        variable: "invalid_var",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid variable: invalid_var");
      expect(context.variable).toBeUndefined();
    });

    it("validates invalid expression", () => {
      const searchParams = new URLSearchParams({
        expression: "invalid_expr",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid expression: invalid_expr");
      expect(context.expression).toBeUndefined();
    });

    it("validates invalid region", () => {
      const searchParams = new URLSearchParams({
        region: "27,102,33", // missing east
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid region format: 27,102,33");
      expect(context.region).toBeUndefined();
    });

    it("validates empty batch ID", () => {
      const searchParams = new URLSearchParams({
        batch: "   ", // whitespace only
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid batch ID: empty string");
      expect(context.batch).toBeUndefined();
    });

    it("accumulates multiple validation errors", () => {
      const searchParams = new URLSearchParams({
        cycle: "invalid",
        variable: "bad_var",
        region: "wrong",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(1);
    });

    it("handles empty search params", () => {
      const searchParams = new URLSearchParams();
      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(Object.keys(context)).toHaveLength(0);
    });

    it("accepts simplified cycle format", () => {
      const searchParams = new URLSearchParams({
        cycle: "2024-03-15-00Z",
      });

      const { context, validation } = decodeContextFromUrl(searchParams);

      expect(validation.valid).toBe(true);
      expect(context.cycle).toBe("2024-03-15-00Z");
    });
  });

  describe("Round-trip encoding/decoding", () => {
    it("preserves context through encode->decode cycle", () => {
      const original: AnalysisUrlParams = {
        cycle: "2024-03-15T00:00:00Z",
        validTime: "2024-03-17T12:00:00Z",
        lead: 60,
        variable: "T2m",
        expression: "ai_ensemble_mean",
        region: {
          id: "sichuan",
          name: "Sichuan",
          south: 27,
          west: 102,
          north: 33,
          east: 108,
        },
        batch: "v2.3.1",
      };

      const encoded = encodeContextToUrl(original);
      const { context: decoded, validation } = decodeContextFromUrl(encoded);

      expect(validation.valid).toBe(true);
      expect(decoded.cycle).toBe(original.cycle);
      expect(decoded.validTime).toBe(original.validTime);
      expect(decoded.lead).toBe(original.lead);
      expect(decoded.variable).toBe(original.variable);
      expect(decoded.expression).toBe(original.expression);
      expect(decoded.region?.south).toBe(original.region?.south);
      expect(decoded.region?.west).toBe(original.region?.west);
      expect(decoded.region?.north).toBe(original.region?.north);
      expect(decoded.region?.east).toBe(original.region?.east);
      expect(decoded.batch).toBe(original.batch);
    });
  });
});
