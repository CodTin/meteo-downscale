import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotAvailableState } from "@/components/unavailable-states/not-available-state";

describe("NotAvailableState", () => {
  it("renders with default title", () => {
    render(
      <NotAvailableState message="Cycle has not been published." />
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Not Yet Available")).toBeInTheDocument();
    expect(screen.getByText("Cycle has not been published.")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <NotAvailableState
        title="Custom Not Available Title"
        message="Custom message"
      />
    );

    expect(screen.getByText("Custom Not Available Title")).toBeInTheDocument();
  });

  it("renders cycle ID when provided", () => {
    render(
      <NotAvailableState
        message="Cycle has not been published"
        cycleId="2024-03-15 06Z"
      />
    );

    expect(screen.getByText("Cycle: 2024-03-15 06Z")).toBeInTheDocument();
  });

  it("renders action link when provided", () => {
    render(
      <NotAvailableState
        message="Not published"
        actionLabel="View Detail"
        actionHref="/cycles/detail"
      />
    );

    const link = screen.getByRole("link", { name: "View Detail" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/cycles/detail");
  });

  it("does not render action link when not provided", () => {
    render(<NotAvailableState message="Not published" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    render(<NotAvailableState message="Not published" />);

    const container = screen.getByRole("status");
    expect(container).toHaveAttribute("aria-live", "polite");
  });

  it("applies custom className", () => {
    render(
      <NotAvailableState message="Not published" className="custom-class" />
    );

    const container = screen.getByRole("status");
    expect(container).toHaveClass("custom-class");
  });
});
