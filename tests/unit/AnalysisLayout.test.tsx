import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnalysisLayout from "@/app/forecast/analysis/layout";
import { usePathname } from "next/navigation";
import { useAnalysisContext } from "@/stores/analysisContext";
import { useAnalysisUrlSync } from "@/hooks/useAnalysisUrlSync";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock Zustand store
vi.mock("@/stores/analysisContext", () => ({
  useAnalysisContext: vi.fn(),
}));

// Mock URL sync hook
vi.mock("@/hooks/useAnalysisUrlSync", () => ({
  useAnalysisUrlSync: vi.fn(),
}));

describe("AnalysisLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/forecast/analysis/2d-map");
    (useAnalysisContext as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedCycleId: "2024-10-06T12:00:00Z",
      selectedValidTime: "2024-10-06T18:00:00Z",
      selectedLeadTime: 6,
      selectedVariableId: "T2m",
      selectedRegion: { id: "sichuan", name: "Sichuan", north: 33, south: 27, east: 108, west: 102 },
      selectedBatchId: "batch-001",
    });
    (useAnalysisUrlSync as ReturnType<typeof vi.fn>).mockReturnValue({
      urlErrors: [],
      hasUrlParams: false,
    });
  });

  describe("Layout Structure", () => {
    it("renders the context header above the sidebar", () => {
      const { container } = render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      // Check structure: header should be first, then main area with sidebar and content
      const header = container.querySelector(".border-b");
      const mainArea = container.querySelector(".flex-1");

      expect(header).toBeInTheDocument();
      expect(mainArea).toBeInTheDocument();
    });

    it("renders the navigation sidebar", () => {
      render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      // Navigation tabs should be present
      expect(screen.getByText("2D Map")).toBeInTheDocument();
      expect(screen.getByText("3D Terrain")).toBeInTheDocument();
    });

    it("renders children in the main content area", () => {
      render(
        <AnalysisLayout>
          <div data-testid="test-content">Test Content</div>
        </AnalysisLayout>
      );

      expect(screen.getByTestId("test-content")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("applies flex layout to separate sidebar and content", () => {
      const { container } = render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      const mainArea = container.querySelector(".flex-1.overflow-hidden");
      expect(mainArea).toBeInTheDocument();
      expect(mainArea).toHaveClass("flex");
    });
  });

  describe("Context Header Integration", () => {
    it("displays context information from Zustand store", () => {
      render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      // Context header should display the current selections
      expect(screen.getByText(/Cycle:/)).toBeInTheDocument();
      expect(screen.getByText(/Var:/)).toBeInTheDocument();
    });

    it("shows Edit and Refresh buttons in context header", () => {
      render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      expect(screen.getByRole("button", { name: /Edit context parameters/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Refresh batch status/i })).toBeInTheDocument();
    });
  });

  describe("Responsive Layout", () => {
    it("makes content area scrollable", () => {
      const { container } = render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      const mainContent = container.querySelector("main");
      expect(mainContent).toHaveClass("overflow-auto");
    });

    it("uses full screen height", () => {
      const { container } = render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      const outerContainer = container.querySelector(".h-screen");
      expect(outerContainer).toBeInTheDocument();
    });
  });

  describe("URL Error Display", () => {
    it("shows error banner when URL params are invalid", () => {
      (useAnalysisUrlSync as ReturnType<typeof vi.fn>).mockReturnValue({
        urlErrors: ["Invalid cycle ID format: invalid-cycle", "Invalid variable: bad_var"],
        hasUrlParams: true,
      });

      render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      expect(screen.getByText("Invalid URL parameters:")).toBeInTheDocument();
      expect(screen.getByText("Invalid cycle ID format: invalid-cycle")).toBeInTheDocument();
      expect(screen.getByText("Invalid variable: bad_var")).toBeInTheDocument();
    });

    it("does not show error banner when URL params are valid", () => {
      (useAnalysisUrlSync as ReturnType<typeof vi.fn>).mockReturnValue({
        urlErrors: [],
        hasUrlParams: true,
      });

      render(
        <AnalysisLayout>
          <div>Test Content</div>
        </AnalysisLayout>
      );

      expect(screen.queryByText("Invalid URL parameters:")).not.toBeInTheDocument();
    });
  });
});
