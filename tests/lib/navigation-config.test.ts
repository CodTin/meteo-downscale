import { describe, it, expect } from "vitest";
import {
  businessTabs,
  independentEntries,
  allRoutes,
} from "@/lib/navigation-config";

describe("Navigation Configuration", () => {
  it("defines exactly 6 business tabs", () => {
    expect(businessTabs).toHaveLength(6);
  });

  it("defines exactly 2 independent entries", () => {
    expect(independentEntries).toHaveLength(2);
  });

  it("defines all routes (27 pages + root + parent pages)", () => {
    // 1 root + 1 forecast/overview + 7 forecast/analysis + 3 forecast/directory
    // + 1 weather-events + 2 verification + 4 export + 4 research + 3 operations = 26 total
    expect(allRoutes.length).toBeGreaterThanOrEqual(26);
  });

  it("includes all business tab routes", () => {
    const businessRoutes = businessTabs.map((tab) => tab.href);
    businessRoutes.forEach((route) => {
      expect(allRoutes).toContain(route);
    });
  });

  it("includes Forecast Analysis sub-pages", () => {
    const analysisTab = businessTabs.find(
      (tab) => tab.id === "forecast-analysis"
    );
    expect(analysisTab?.children).toHaveLength(6);
  });

  it("includes Forecast Directory sub-pages", () => {
    const directoryTab = businessTabs.find(
      (tab) => tab.id === "forecast-directory"
    );
    expect(directoryTab?.children).toHaveLength(3);
  });

  it("includes Historical Verification sub-pages", () => {
    const verificationTab = businessTabs.find(
      (tab) => tab.id === "historical-verification"
    );
    expect(verificationTab?.children).toHaveLength(2);
  });

  it("includes Export Center sub-pages", () => {
    const exportTab = businessTabs.find((tab) => tab.id === "export-center");
    expect(exportTab?.children).toHaveLength(3);
  });

  it("includes Research sub-pages", () => {
    const researchEntry = independentEntries.find(
      (entry) => entry.id === "research"
    );
    expect(researchEntry?.children).toHaveLength(3);
  });

  it("includes Operations sub-pages", () => {
    const operationsEntry = independentEntries.find(
      (entry) => entry.id === "operations"
    );
    expect(operationsEntry?.children).toHaveLength(2);
  });

  it("marks Operations as requiring special role", () => {
    const operationsEntry = independentEntries.find(
      (entry) => entry.id === "operations"
    );
    expect(operationsEntry?.requiresRole).toBe("operations");
  });
});
