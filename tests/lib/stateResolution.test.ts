import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  queryCatalog,
  selectValidTime,
  getDefaultRegion,
  resolveInitialState,
  isResolutionSuccessful,
  getResolutionMessage,
} from "@/lib/stateResolution";
import {
  DEFAULT_REGION,
  DEFAULT_VARIABLE,
} from "@/lib/stateResolution.types";
import type { Region } from "@/stores/analysisContext.types";

// Mock localStorage
class LocalStorageMock implements Storage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  get length(): number {
    return this.store.size;
  }
}

const localStorageMock = new LocalStorageMock();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

if (typeof window === "undefined") {
  (global as any).window = {};
}

Object.defineProperty(global.window, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

describe("State Resolution", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("selectValidTime", () => {
    it("returns null for empty valid times", () => {
      const result = selectValidTime([], "business");
      expect(result.validTime).toBeNull();
      expect(result.cycleExpired).toBe(false);
    });

    it("selects earliest time in historical mode", () => {
      const times = [
        "2024-10-06T18:00:00Z",
        "2024-10-06T12:00:00Z",
        "2024-10-06T06:00:00Z",
      ];

      const result = selectValidTime(times, "historical");
      expect(result.validTime).toBe("2024-10-06T06:00:00Z");
      expect(result.cycleExpired).toBe(false);
    });

    it("selects first future time in business mode", () => {
      // Use actual current time and construct test data relative to it
      const now = new Date();
      const pastTime = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
      const futureTime1 = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours ahead
      const futureTime2 = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(); // 8 hours ahead

      const times = [pastTime, futureTime1, futureTime2];

      const result = selectValidTime(times, "business");
      expect(result.validTime).toBe(futureTime1);
      expect(result.cycleExpired).toBe(false);
    });

    it("selects latest time and marks expired when all times are past", () => {
      // All times in the past
      const now = new Date();
      const pastTime1 = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
      const pastTime2 = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
      const pastTime3 = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();

      const times = [pastTime1, pastTime2, pastTime3];

      const result = selectValidTime(times, "business");
      expect(result.validTime).toBe(pastTime3); // Latest past time
      expect(result.cycleExpired).toBe(true);
    });

    it("handles unsorted times correctly", () => {
      const now = new Date();
      const futureTime1 = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();
      const pastTime = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      const futureTime2 = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();

      const times = [futureTime1, pastTime, futureTime2];

      const result = selectValidTime(times, "business");
      expect(result.validTime).toBe(futureTime2); // First future time when sorted
      expect(result.cycleExpired).toBe(false);
    });
  });

  describe("getDefaultRegion", () => {
    it("returns 川渝 default region when localStorage is empty", () => {
      const region = getDefaultRegion();
      expect(region).toEqual(DEFAULT_REGION);
      expect(region.name).toBe("川渝");
      expect(region.north).toBe(33);
      expect(region.south).toBe(27);
      expect(region.east).toBe(108);
      expect(region.west).toBe(102);
    });

    it("loads region from localStorage if available", () => {
      const customRegion: Region = {
        id: "custom-region",
        name: "华北",
        north: 42,
        south: 35,
        east: 120,
        west: 110,
      };

      localStorageMock.setItem("default-region", JSON.stringify(customRegion));

      const region = getDefaultRegion();
      expect(region).toEqual(customRegion);
    });

    it("falls back to default if localStorage contains invalid data", () => {
      localStorageMock.setItem("default-region", "invalid json");

      const region = getDefaultRegion();
      expect(region).toEqual(DEFAULT_REGION);
    });

    it("falls back to default if stored region is incomplete", () => {
      const incompleteRegion = {
        id: "incomplete",
        name: "Test",
        // missing boundaries
      };

      localStorageMock.setItem(
        "default-region",
        JSON.stringify(incompleteRegion)
      );

      const region = getDefaultRegion();
      expect(region).toEqual(DEFAULT_REGION);
    });
  });

  describe("resolveInitialState", () => {
    it("returns no_catalog status when catalog is unavailable", async () => {
      const result = await resolveInitialState();

      expect(result.status).toBe("no_catalog");
      expect(result.cycleId).toBeNull();
      expect(result.validTime).toBeNull();
      expect(result.variableId).toBe(DEFAULT_VARIABLE);
      expect(result.region).toEqual(DEFAULT_REGION);
      expect(result.reason).toContain("产品可用性未确认");
    });

    it("sets default variable to T2m", async () => {
      const result = await resolveInitialState();

      expect(result.variableId).toBe("T2m");
    });

    it("sets default region to 川渝", async () => {
      const result = await resolveInitialState();

      expect(result.region).toEqual(DEFAULT_REGION);
      expect(result.region.name).toBe("川渝");
    });

    it("respects requested cycle parameter", async () => {
      const result = await resolveInitialState("2024-10-06T12:00:00Z");

      // Should attempt to use requested cycle (will fail in mock)
      expect(result.status).not.toBe("success");
    });
  });

  describe("isResolutionSuccessful", () => {
    it("returns true for successful resolution", () => {
      const result = {
        cycleId: "2024-10-06T12:00:00Z",
        validTime: "2024-10-06T18:00:00Z",
        variableId: "T2m" as const,
        region: DEFAULT_REGION,
        mode: "business" as const,
        cycleExpired: false,
        status: "success" as const,
      };

      expect(isResolutionSuccessful(result)).toBe(true);
    });

    it("returns false when cycle is null", () => {
      const result = {
        cycleId: null,
        validTime: null,
        variableId: "T2m" as const,
        region: DEFAULT_REGION,
        mode: "business" as const,
        cycleExpired: false,
        status: "no_catalog" as const,
      };

      expect(isResolutionSuccessful(result)).toBe(false);
    });

    it("returns false when status is not success", () => {
      const result = {
        cycleId: "2024-10-06T12:00:00Z",
        validTime: "2024-10-06T18:00:00Z",
        variableId: "T2m" as const,
        region: DEFAULT_REGION,
        mode: "business" as const,
        cycleExpired: false,
        status: "partial" as const,
      };

      expect(isResolutionSuccessful(result)).toBe(false);
    });
  });

  describe("getResolutionMessage", () => {
    it("returns success message for successful resolution", () => {
      const result = {
        cycleId: "2024-10-06T12:00:00Z",
        validTime: "2024-10-06T18:00:00Z",
        variableId: "T2m" as const,
        region: DEFAULT_REGION,
        mode: "business" as const,
        cycleExpired: false,
        status: "success" as const,
      };

      const message = getResolutionMessage(result);
      expect(message).toContain("2024-10-06T12:00:00Z");
      expect(message).toContain("2024-10-06T18:00:00Z");
    });

    it("includes expired warning for expired cycles", () => {
      const result = {
        cycleId: "2024-10-06T12:00:00Z",
        validTime: "2024-10-06T18:00:00Z",
        variableId: "T2m" as const,
        region: DEFAULT_REGION,
        mode: "business" as const,
        cycleExpired: true,
        status: "success" as const,
      };

      const message = getResolutionMessage(result);
      expect(message).toContain("周期已过期");
    });

    it("returns reason for failed resolution", () => {
      const result = {
        cycleId: null,
        validTime: null,
        variableId: "T2m" as const,
        region: DEFAULT_REGION,
        mode: "business" as const,
        cycleExpired: false,
        status: "no_catalog" as const,
        reason: "产品可用性未确认",
      };

      const message = getResolutionMessage(result);
      expect(message).toBe("产品可用性未确认");
    });
  });

  describe("GLOSSARY.md Compliance", () => {
    it("defaults match GLOSSARY.md specifications", () => {
      expect(DEFAULT_REGION.north).toBe(33);
      expect(DEFAULT_REGION.south).toBe(27);
      expect(DEFAULT_REGION.east).toBe(108);
      expect(DEFAULT_REGION.west).toBe(102);
      expect(DEFAULT_VARIABLE).toBe("T2m");
    });

    it("川渝 region boundaries are correct", () => {
      const region = getDefaultRegion();
      expect(region.name).toBe("川渝");
      expect(region.north).toBe(33);
      expect(region.south).toBe(27);
      expect(region.east).toBe(108);
      expect(region.west).toBe(102);
    });

    it("business mode prioritizes future times", () => {
      const now = new Date();
      const pastTime = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      const futureTime1 = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
      const futureTime2 = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();

      const times = [pastTime, futureTime1, futureTime2];

      const result = selectValidTime(times, "business");
      expect(result.validTime).not.toBeNull();
      expect(new Date(result.validTime!) >= now).toBe(true);
      expect(result.cycleExpired).toBe(false);
    });

    it("historical mode uses earliest time", () => {
      const times = [
        "2024-10-06T18:00:00Z",
        "2024-10-06T12:00:00Z",
        "2024-10-06T06:00:00Z",
      ];

      const result = selectValidTime(times, "historical");
      expect(result.validTime).toBe("2024-10-06T06:00:00Z");
    });

    it("explicit unavailable states - no silent failures", async () => {
      const result = await resolveInitialState();

      // Even when failing, should have explicit status and reason
      expect(result.status).not.toBe("success");
      expect(result.reason).toBeDefined();
      expect(result.reason).not.toBe("");
    });
  });
});
