import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditContextModal } from "@/components/analysis/EditContextModal";
import { useAnalysisContext } from "@/stores/analysisContext";

// Mock the store
vi.mock("@/stores/analysisContext", () => ({
  useAnalysisContext: vi.fn(),
}));

describe("EditContextModal", () => {
  const mockSetters = {
    setSelectedCycleId: vi.fn(),
    setSelectedValidTime: vi.fn(),
    setSelectedLeadTime: vi.fn(),
    setSelectedVariableId: vi.fn(),
    setSelectedRegion: vi.fn(),
    setSelectedBatchId: vi.fn(),
    setSelectedExpression: vi.fn(),
    reset: vi.fn(),
  };

  const mockStoreState = {
    selectedCycleId: "2024-03-15T00:00:00Z",
    selectedValidTime: "2024-03-17T12:00:00Z",
    selectedLeadTime: 60,
    selectedVariableId: "T2m" as const,
    selectedRegion: {
      id: "east-china",
      name: "East China",
      north: 35,
      south: 25,
      east: 125,
      west: 115,
    },
    selectedBatchId: "v2.3.1",
    ...mockSetters,
  };

  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAnalysisContext).mockReturnValue(mockStoreState);
  });

  it("does not render when open is false", () => {
    render(<EditContextModal open={false} onOpenChange={mockOnOpenChange} />);
    expect(screen.queryByText("Edit Analysis Context")).not.toBeInTheDocument();
  });

  it("renders modal when open is true", () => {
    render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText("Edit Analysis Context")).toBeInTheDocument();
  });

  it("populates form fields with current store values", () => {
    render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    expect(screen.getByLabelText(/cycle/i)).toHaveValue("2024-03-15T00:00:00Z");
    expect(screen.getByLabelText(/valid time/i)).toHaveValue("2024-03-17T12:00:00Z");
    expect(screen.getByLabelText(/lead time/i)).toHaveValue(60);
    expect(screen.getByLabelText(/variable/i)).toHaveValue("T2m");
    expect(screen.getByLabelText(/region/i)).toHaveValue("east-china");
    expect(screen.getByLabelText(/batch/i)).toHaveValue("v2.3.1");
  });

  it("updates store when Save button is clicked", () => {
    render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    // Change some values
    const cycleInput = screen.getByLabelText(/cycle/i);
    fireEvent.change(cycleInput, { target: { value: "2024-03-16T00:00:00Z" } });

    const variableSelect = screen.getByLabelText(/variable/i);
    fireEvent.change(variableSelect, { target: { value: "SP" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // Verify store setters were called
    expect(mockSetters.setSelectedCycleId).toHaveBeenCalledWith("2024-03-16T00:00:00Z");
    expect(mockSetters.setSelectedVariableId).toHaveBeenCalledWith("SP");
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes modal when Cancel button is clicked", () => {
    render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    // Store setters should not have been called
    expect(mockSetters.setSelectedCycleId).not.toHaveBeenCalled();
  });

  it("closes modal when backdrop is clicked", () => {
    const { container } = render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    const backdrop = container.querySelector(".bg-black\\/50");
    fireEvent.click(backdrop!);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("displays all variable options", () => {
    render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    const variableSelect = screen.getByLabelText(/variable/i);
    const options = variableSelect.querySelectorAll("option");

    expect(options).toHaveLength(7); // 6 variables + "Select variable"
    expect(options[1].textContent).toContain("T2m");
    expect(options[2].textContent).toContain("SP");
    expect(options[3].textContent).toContain("U10");
    expect(options[4].textContent).toContain("V10");
    expect(options[5].textContent).toContain("Wind Speed");
    expect(options[6].textContent).toContain("TP");
  });

  it("handles empty values correctly", () => {
    render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    // Clear all inputs
    fireEvent.change(screen.getByLabelText(/cycle/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/valid time/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/lead time/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/variable/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/region/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/batch/i), { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // Verify store setters were called with null
    expect(mockSetters.setSelectedCycleId).toHaveBeenCalledWith(null);
    expect(mockSetters.setSelectedValidTime).toHaveBeenCalledWith(null);
    expect(mockSetters.setSelectedLeadTime).toHaveBeenCalledWith(null);
    expect(mockSetters.setSelectedVariableId).toHaveBeenCalledWith(null);
    expect(mockSetters.setSelectedRegion).toHaveBeenCalledWith(null);
    expect(mockSetters.setSelectedBatchId).toHaveBeenCalledWith(null);
  });

  it("resets form when modal reopens", () => {
    const { rerender } = render(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    // Change a value
    const cycleInput = screen.getByLabelText(/cycle/i);
    fireEvent.change(cycleInput, { target: { value: "2024-03-20T00:00:00Z" } });

    // Close modal
    rerender(<EditContextModal open={false} onOpenChange={mockOnOpenChange} />);

    // Reopen modal
    rerender(<EditContextModal open={true} onOpenChange={mockOnOpenChange} />);

    // Form should be reset to store values
    expect(screen.getByLabelText(/cycle/i)).toHaveValue("2024-03-15T00:00:00Z");
  });
});
