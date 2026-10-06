import { describe, it, expect } from "vitest";
import {
  formatCycleDisplay,
  formatValidTimeDisplay,
  formatRegionDisplay,
} from "@/lib/formatters";
import type { Region } from "@/stores/analysisContext.types";

describe("formatCycleDisplay", () => {
  it("formats ISO timestamp to YYYY-MM-DD HHZ format", () => {
    const result = formatCycleDisplay("2024-03-15T00:00:00Z");
    expect(result).toBe("2024-03-15 00Z");
  });

  it("formats different times correctly", () => {
    expect(formatCycleDisplay("2024-03-15T12:00:00Z")).toBe("2024-03-15 12Z");
    expect(formatCycleDisplay("2024-12-31T23:00:00Z")).toBe("2024-12-31 23Z");
    expect(formatCycleDisplay("2024-01-01T06:00:00Z")).toBe("2024-01-01 06Z");
  });

  it("returns original string if parsing fails", () => {
    const invalidDate = "invalid-date";
    const result = formatCycleDisplay(invalidDate);
    expect(result).toBe(invalidDate);
  });
});

describe("formatValidTimeDisplay", () => {
  it("formats valid time with lead time offset", () => {
    const result = formatValidTimeDisplay("2024-03-17T12:00:00Z", 60);
    expect(result).toBe("2024-03-17 12Z (+60h)");
  });

  it("formats different lead times correctly", () => {
    expect(formatValidTimeDisplay("2024-03-15T00:00:00Z", 0)).toBe(
      "2024-03-15 00Z (+0h)"
    );
    expect(formatValidTimeDisplay("2024-03-15T12:00:00Z", 12)).toBe(
      "2024-03-15 12Z (+12h)"
    );
    expect(formatValidTimeDisplay("2024-03-20T18:00:00Z", 144)).toBe(
      "2024-03-20 18Z (+144h)"
    );
  });

  it("returns original string if parsing fails", () => {
    const invalidDate = "invalid-date";
    const result = formatValidTimeDisplay(invalidDate, 60);
    expect(result).toBe(invalidDate);
  });
});

describe("formatRegionDisplay", () => {
  it("returns region name", () => {
    const region: Region = {
      id: "east-china",
      name: "East China",
      north: 35,
      south: 25,
      east: 125,
      west: 115,
    };

    const result = formatRegionDisplay(region);
    expect(result).toBe("East China");
  });

  it("handles different region names", () => {
    const region1: Region = {
      id: "sichuan-chongqing",
      name: "川渝",
      north: 33,
      south: 27,
      east: 108,
      west: 102,
    };

    expect(formatRegionDisplay(region1)).toBe("川渝");

    const region2: Region = {
      id: "yangtze-delta",
      name: "Yangtze River Delta",
      north: 32,
      south: 28,
      east: 122,
      west: 118,
    };

    expect(formatRegionDisplay(region2)).toBe("Yangtze River Delta");
  });
});
