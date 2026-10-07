import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "@/components/ui/error-state";

describe("ErrorState", () => {
  it("renders with default title", () => {
    render(
      <ErrorState message="Product catalog is temporarily unavailable." />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Cannot Verify Product Availability")).toBeInTheDocument();
    expect(screen.getByText("Product catalog is temporarily unavailable.")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <ErrorState
        title="Custom Error Title"
        message="Custom error message"
      />
    );

    expect(screen.getByText("Custom Error Title")).toBeInTheDocument();
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("renders retry button when onRetry provided", () => {
    const onRetry = vi.fn();

    render(
      <ErrorState
        message="Error occurred"
        onRetry={onRetry}
      />
    );

    const button = screen.getByRole("button", { name: "Retry" });
    expect(button).toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        message="Error occurred"
        onRetry={onRetry}
      />
    );

    const button = screen.getByRole("button", { name: "Retry" });
    await user.click(button);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render retry button when onRetry not provided", () => {
    render(<ErrorState message="Error occurred" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders custom action label", () => {
    const onRetry = vi.fn();

    render(
      <ErrorState
        message="Error occurred"
        onRetry={onRetry}
        actionLabel="Try Again"
      />
    );

    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    render(<ErrorState message="Error occurred" />);

    const container = screen.getByRole("alert");
    expect(container).toHaveAttribute("aria-live", "assertive");
  });

  it("applies custom className", () => {
    render(
      <ErrorState message="Error occurred" className="custom-error-class" />
    );

    const container = screen.getByRole("alert");
    expect(container).toHaveClass("custom-error-class");
  });
});
