import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RestrictedState } from "@/components/unavailable-states/restricted-state";

describe("RestrictedState", () => {
  it("renders with default title", () => {
    render(
      <RestrictedState message="Precipitation is restricted." />
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("TP Restricted")).toBeInTheDocument();
    expect(screen.getByText("Precipitation is restricted.")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <RestrictedState
        title="Custom Restricted Title"
        message="Custom message"
      />
    );

    expect(screen.getByText("Custom Restricted Title")).toBeInTheDocument();
  });

  it("renders alternatives when provided", () => {
    const alternatives = [
      { label: "10m Wind", value: "10m_wind" },
      { label: "2m Temperature", value: "2m_temp" },
    ];

    render(
      <RestrictedState
        message="Restricted"
        alternatives={alternatives}
      />
    );

    expect(screen.getByText("Try:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10m Wind" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2m Temperature" })).toBeInTheDocument();
  });

  it("does not render alternatives section when empty", () => {
    render(
      <RestrictedState
        message="Restricted"
        alternatives={[]}
      />
    );

    expect(screen.queryByText("Try:")).not.toBeInTheDocument();
  });

  it("dispatches custom event when alternative button clicked", async () => {
    const user = userEvent.setup();
    const eventListener = vi.fn();
    window.addEventListener("variableSelected", eventListener);

    const alternatives = [
      { label: "10m Wind", value: "10m_wind" },
    ];

    render(
      <RestrictedState
        message="Restricted"
        alternatives={alternatives}
      />
    );

    const button = screen.getByRole("button", { name: "10m Wind" });
    await user.click(button);

    expect(eventListener).toHaveBeenCalled();
    const event = eventListener.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual({ value: "10m_wind" });

    window.removeEventListener("variableSelected", eventListener);
  });

  it("has proper ARIA attributes", () => {
    render(<RestrictedState message="Restricted" />);

    const container = screen.getByRole("status");
    expect(container).toHaveAttribute("aria-live", "polite");
  });

  it("applies custom className", () => {
    render(
      <RestrictedState message="Restricted" className="custom-restricted-class" />
    );

    const container = screen.getByRole("status");
    expect(container).toHaveClass("custom-restricted-class");
  });
});
