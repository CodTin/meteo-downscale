import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MainNavigation } from "@/components/main-navigation";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("MainNavigation", () => {
  it("renders all 6 business navigation tabs", () => {
    render(<MainNavigation />);

    expect(screen.getByText("预报总览")).toBeInTheDocument();
    expect(screen.getByText("预报分析")).toBeInTheDocument();
    expect(screen.getByText("预报目录")).toBeInTheDocument();
    expect(screen.getByText("天气过程发现")).toBeInTheDocument();
    expect(screen.getByText("历史验证")).toBeInTheDocument();
    expect(screen.getByText("导出中心")).toBeInTheDocument();
  });

  it("renders independent entries (Research and Operations)", () => {
    render(<MainNavigation />);

    expect(screen.getByText("研究评价")).toBeInTheDocument();
    expect(screen.getByText("运营工作区")).toBeInTheDocument();
  });

  it("disables Operations tab for non-ops roles", () => {
    render(<MainNavigation userRole="business" />);

    const operationsLink = screen.getByText("运营工作区");
    expect(operationsLink.tagName).toBe("SPAN");
    expect(operationsLink).toHaveClass("cursor-not-allowed");
  });

  it("enables Operations tab for operations role", () => {
    render(<MainNavigation userRole="operations" />);

    const operationsLink = screen.getByText("运营工作区");
    expect(operationsLink.tagName).toBe("A");
    expect(operationsLink).not.toHaveClass("cursor-not-allowed");
  });

  it("shows tooltip for disabled Operations tab", () => {
    render(<MainNavigation userRole="business" />);

    const operationsContainer = screen
      .getByText("运营工作区")
      .closest("div");
    expect(operationsContainer).toHaveAttribute(
      "title",
      "需要运营角色权限"
    );
  });
});
