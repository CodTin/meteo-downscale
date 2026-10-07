import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/unavailable-states/empty-state";

describe("EmptyState", () => {
  it("renders with default title", () => {
    render(
      <EmptyState message="No data available for this time range." />
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("No Products in This Time Range")).toBeInTheDocument();
    expect(screen.getByText("No data available for this time range.")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <EmptyState
        title="Custom Empty Title"
        message="Custom message"
      />
    );

    expect(screen.getByText("Custom Empty Title")).toBeInTheDocument();
    expect(screen.getByText("Custom message")).toBeInTheDocument();
  });

  it("renders action link when provided", () => {
    render(
      <EmptyState
        message="No data"
        actionLabel="View Directory"
        actionHref="/directory"
      />
    );

    const link = screen.getByRole("link", { name: "View Directory" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/directory");
  });

  it("does not render action link when not provided", () => {
    render(<EmptyState message="No data" actionLabel="" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    render(<EmptyState message="No data" />);

    const container = screen.getByRole("status");
    expect(container).toHaveAttribute("aria-live", "polite");
  });

  it("applies custom className", () => {
    render(
      <EmptyState message="No data" className="custom-class" />
    );

    const container = screen.getByRole("status");
    expect(container).toHaveClass("custom-class");
  });
});
