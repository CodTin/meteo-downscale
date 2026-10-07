import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WithdrawnState } from "@/components/ui/withdrawn-state";

describe("WithdrawnState", () => {
  it("renders with default title", () => {
    render(
      <WithdrawnState message="Batch v2.3.1 was retracted." />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Source Product Retracted")).toBeInTheDocument();
    expect(screen.getByText("Batch v2.3.1 was retracted.")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <WithdrawnState
        title="Custom Withdrawn Title"
        message="Custom message"
      />
    );

    expect(screen.getByText("Custom Withdrawn Title")).toBeInTheDocument();
  });

  it("renders reason and timestamp when provided", () => {
    render(
      <WithdrawnState
        message="Batch was retracted"
        reason="Quality check failed"
        timestamp="2024-03-15 14:30 UTC"
      />
    );

    expect(screen.getByText(/Retracted: 2024-03-15 14:30 UTC/)).toBeInTheDocument();
    expect(screen.getByText(/Quality check failed/)).toBeInTheDocument();
  });

  it("renders alternatives list when provided", () => {
    const alternatives = [
      { label: "Alternative 1", href: "/alt1" },
      { label: "Alternative 2", href: "/alt2" },
    ];

    render(
      <WithdrawnState
        message="Batch was retracted"
        alternatives={alternatives}
      />
    );

    expect(screen.getByText("Alternative batches:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alternative 1" })).toHaveAttribute("href", "/alt1");
    expect(screen.getByRole("link", { name: "Alternative 2" })).toHaveAttribute("href", "/alt2");
  });

  it("does not render alternatives section when empty", () => {
    render(
      <WithdrawnState
        message="Batch was retracted"
        alternatives={[]}
      />
    );

    expect(screen.queryByText("Alternative batches:")).not.toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    render(<WithdrawnState message="Batch was retracted" />);

    const container = screen.getByRole("alert");
    expect(container).toHaveAttribute("aria-live", "assertive");
  });

  it("applies custom className", () => {
    render(
      <WithdrawnState message="Batch was retracted" className="custom-withdrawn-class" />
    );

    const container = screen.getByRole("alert");
    expect(container).toHaveClass("custom-withdrawn-class");
  });
});
