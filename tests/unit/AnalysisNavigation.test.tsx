import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AnalysisNavigation } from "@/components/analysis/AnalysisNavigation";
import { usePathname } from "next/navigation";
import { useAnalysisContext } from "@/stores/analysisContext";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

// Mock Zustand store
vi.mock("@/stores/analysisContext", () => ({
  useAnalysisContext: vi.fn(),
}));

describe("AnalysisNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/forecast/analysis/2d-map");
    (useAnalysisContext as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedVariableId: "T2m",
    });
  });

  describe("Rendering", () => {
    it("renders all 6 navigation tabs", () => {
      render(<AnalysisNavigation />);

      expect(screen.getByText("2D Map")).toBeInTheDocument();
      expect(screen.getByText("3D Terrain")).toBeInTheDocument();
      expect(screen.getByText("EC-AI Comparison")).toBeInTheDocument();
      expect(screen.getByText("Ensemble/Threshold")).toBeInTheDocument();
      expect(screen.getByText("Point/Region Analysis")).toBeInTheDocument();
      expect(screen.getByText("Cross-Cycle Evolution")).toBeInTheDocument();
    });

    it("renders with 240px width", () => {
      const { container } = render(<AnalysisNavigation />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("w-60"); // w-60 = 240px in Tailwind
    });

    it("applies custom className when provided", () => {
      const { container } = render(<AnalysisNavigation className="custom-class" />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveClass("custom-class");
    });
  });

  describe("Active Tab Highlighting", () => {
    it("highlights the active tab with neutral-200 background", () => {
      (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/forecast/analysis/2d-map");
      render(<AnalysisNavigation />);

      const activeTab = screen.getByText("2D Map").closest("a");
      expect(activeTab).toHaveClass("bg-neutral-200");
      expect(activeTab).toHaveClass("text-neutral-900");
    });

    it("highlights active tab with 3px left border (border-info-500)", () => {
      (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/forecast/analysis/ensemble");
      render(<AnalysisNavigation />);

      const activeTab = screen.getByText("Ensemble/Threshold").closest("a");
      expect(activeTab).toHaveClass("border-blue-500");
      expect(activeTab).toHaveClass("border-l-[3px]");
    });

    it("sets aria-current='page' on active tab", () => {
      (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/forecast/analysis/3d-terrain");
      render(<AnalysisNavigation />);

      const activeTab = screen.getByText("3D Terrain").closest("a");
      expect(activeTab).toHaveAttribute("aria-current", "page");
    });

    it("does not highlight inactive tabs", () => {
      (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/forecast/analysis/2d-map");
      render(<AnalysisNavigation />);

      const inactiveTab = screen.getByText("3D Terrain").closest("a");
      expect(inactiveTab).not.toHaveClass("bg-neutral-200");
      expect(inactiveTab).toHaveClass("border-transparent");
    });
  });

  describe("Tab Routes", () => {
    it("links to correct sub-page routes", () => {
      render(<AnalysisNavigation />);

      expect(screen.getByText("2D Map").closest("a")).toHaveAttribute(
        "href",
        "/forecast/analysis/2d-map"
      );
      expect(screen.getByText("3D Terrain").closest("a")).toHaveAttribute(
        "href",
        "/forecast/analysis/3d-terrain"
      );
      expect(screen.getByText("EC-AI Comparison").closest("a")).toHaveAttribute(
        "href",
        "/forecast/analysis/ec-ai-comparison"
      );
      expect(screen.getByText("Ensemble/Threshold").closest("a")).toHaveAttribute(
        "href",
        "/forecast/analysis/ensemble"
      );
      expect(screen.getByText("Point/Region Analysis").closest("a")).toHaveAttribute(
        "href",
        "/forecast/analysis/point-region"
      );
      expect(screen.getByText("Cross-Cycle Evolution").closest("a")).toHaveAttribute(
        "href",
        "/forecast/analysis/cross-cycle"
      );
    });
  });

  describe("Layer Support Validation", () => {
    it("shows warning icon for TP variable on Ensemble tab", () => {
      (useAnalysisContext as ReturnType<typeof vi.fn>).mockReturnValue({
        selectedVariableId: "TP",
      });
      render(<AnalysisNavigation />);

      const ensembleTab = screen.getByText("Ensemble/Threshold").closest("a");
      expect(ensembleTab).toHaveTextContent("⚠");
    });

    it("marks TP-gated tab as disabled with opacity-50", () => {
      (useAnalysisContext as ReturnType<typeof vi.fn>).mockReturnValue({
        selectedVariableId: "TP",
      });
      render(<AnalysisNavigation />);

      const ensembleTab = screen.getByText("Ensemble/Threshold").closest("a");
      expect(ensembleTab).toHaveClass("opacity-50");
      expect(ensembleTab).toHaveClass("cursor-not-allowed");
      expect(ensembleTab).toHaveAttribute("aria-disabled", "true");
    });

    it("does not show warning for non-TP variables on Ensemble tab", () => {
      (useAnalysisContext as ReturnType<typeof vi.fn>).mockReturnValue({
        selectedVariableId: "T2m",
      });
      render(<AnalysisNavigation />);

      const ensembleTab = screen.getByText("Ensemble/Threshold").closest("a");
      expect(ensembleTab).not.toHaveTextContent("⚠");
      expect(ensembleTab).not.toHaveClass("opacity-50");
    });

    it("allows navigation to 3D Terrain (DEM requirement is placeholder)", () => {
      render(<AnalysisNavigation />);

      const terrainTab = screen.getByText("3D Terrain").closest("a");
      expect(terrainTab).not.toHaveClass("opacity-50");
      expect(terrainTab).not.toHaveTextContent("⚠");
    });
  });

  describe("Context Preservation", () => {
    it("navigation preserves context via Zustand store (implicit behavior)", () => {
      // The component reads from useAnalysisContext, which means
      // context is preserved across navigation. This test verifies
      // the component accesses the store.
      render(<AnalysisNavigation />);

      expect(useAnalysisContext).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA label for navigation", () => {
      const { container } = render(<AnalysisNavigation />);
      const nav = container.querySelector("nav");
      expect(nav).toHaveAttribute("aria-label", "Analysis sub-page navigation");
    });

    it("renders navigation as semantic nav element", () => {
      const { container } = render(<AnalysisNavigation />);
      expect(container.querySelector("nav")).toBeInTheDocument();
    });

    it("renders tabs in an unordered list", () => {
      const { container } = render(<AnalysisNavigation />);
      const list = container.querySelector("ul");
      expect(list).toBeInTheDocument();
      expect(list?.querySelectorAll("li")).toHaveLength(6);
    });
  });
});
