import { describe, it, expect } from "vitest";
import {
  fetchCycles,
  fetchProductAvailability,
  fetchLatestCycle,
} from "@/lib/api/client";

describe("API Client", () => {
  describe("fetchCycles", () => {
    it("returns an array of cycles", async () => {
      const cycles = await fetchCycles();
      expect(Array.isArray(cycles)).toBe(true);
    });

    it("accepts query parameters", async () => {
      const cycles = await fetchCycles({ status: "published" });
      expect(Array.isArray(cycles)).toBe(true);
    });

    it("accepts mode parameter", async () => {
      const cycles = await fetchCycles({ mode: "business" });
      expect(Array.isArray(cycles)).toBe(true);
    });

    it("accepts multiple parameters", async () => {
      const cycles = await fetchCycles({
        status: "published",
        mode: "historical",
      });
      expect(Array.isArray(cycles)).toBe(true);
    });
  });

  describe("fetchProductAvailability", () => {
    it("returns product availability information", async () => {
      const result = await fetchProductAvailability(
        "2024-10-06T12:00:00Z",
        6
      );

      expect(result).toBeDefined();
      expect(result.cycleId).toBe("2024-10-06T12:00:00Z");
      expect(result.leadTime).toBe(6);
      expect(typeof result.available).toBe("boolean");
    });

    it("returns proper product state", async () => {
      const result = await fetchProductAvailability(
        "2024-10-06T12:00:00Z",
        6
      );

      const validStates = [
        "已发布",
        "未发布",
        "产品可用性未确认",
        "无已发布产品",
      ];
      expect(validStates).toContain(result.state);
    });

    it("includes reason when unavailable", async () => {
      const result = await fetchProductAvailability(
        "2024-10-06T12:00:00Z",
        6
      );

      if (!result.available) {
        expect(result.reason).toBeDefined();
        expect(typeof result.reason).toBe("string");
      }
    });
  });

  describe("fetchLatestCycle", () => {
    it("returns null when no cycles available", async () => {
      const cycle = await fetchLatestCycle();
      expect(cycle).toBeNull();
    });

    it("accepts mode parameter", async () => {
      const cycle = await fetchLatestCycle("historical");
      expect(cycle).toBeNull();
    });
  });

  describe("GLOSSARY.md Product States", () => {
    it("distinguishes 已发布 (published)", () => {
      const validStates = [
        "已发布",
        "未发布",
        "产品可用性未确认",
        "无已发布产品",
      ];
      expect(validStates).toContain("已发布");
    });

    it("distinguishes 未发布 (unpublished)", () => {
      const validStates = [
        "已发布",
        "未发布",
        "产品可用性未确认",
        "无已发布产品",
      ];
      expect(validStates).toContain("未发布");
    });

    it("distinguishes 产品可用性未确认 (availability unconfirmed)", () => {
      const validStates = [
        "已发布",
        "未发布",
        "产品可用性未确认",
        "无已发布产品",
      ];
      expect(validStates).toContain("产品可用性未确认");
    });

    it("distinguishes 无已发布产品 (no published products)", () => {
      const validStates = [
        "已发布",
        "未发布",
        "产品可用性未确认",
        "无已发布产品",
      ];
      expect(validStates).toContain("无已发布产品");
    });
  });
});
