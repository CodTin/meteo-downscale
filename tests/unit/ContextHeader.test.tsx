import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContextHeader } from "@/components/analysis/ContextHeader";
import { useAnalysisContext } from "@/stores/analysisContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Mock the store
vi.mock("@/stores/analysisContext", () => ({
  useAnalysisContext: vi.fn(),
}));

// Mock the EditContextModal
vi.mock("@/components/analysis/EditContextModal", () => ({
  EditContextModal: ({ open }: { open: boolean }) => (
    open ? <div data-testid="edit-modal">Edit Modal</div> : null
  ),
}));

// Mock the batch monitoring hook
vi.mock("@/hooks/useBatchMonitoring", () => ({
  useBatchMonitoring: vi.fn(() => ({
    isWithdrawn: false,
    withdrawal: null,
    newBatchAvailable: null,
    dismissNewBatchNotification: vi.fn(),
    isValidating: false,
  })),
}));

// Mock the batch withdrawal modal
vi.mock("@/components/analysis/BatchWithdrawalModal", () => ({
  BatchWithdrawalModal: () => null,
}));

// Mock the toast component
vi.mock("@/components/ui/toast", () => ({
  Toast: () => null,
}));

describe("ContextHeader", () => {
  let queryClient: QueryClient;

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
    setSelectedCycleId: vi.fn(),
    setSelectedValidTime: vi.fn(),
    setSelectedLeadTime: vi.fn(),
    setSelectedVariableId: vi.fn(),
    setSelectedRegion: vi.fn(),
    setSelectedBatchId: vi.fn(),
    setSelectedExpression: vi.fn(),
    reset: vi.fn(),
  };

  const renderWithQueryClient = (component: ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.mocked(useAnalysisContext).mockReturnValue(mockStoreState);
  });

  it("renders context display with all parameters", () => {
    renderWithQueryClient(<ContextHeader />);

    expect(screen.getByText(/Cycle: 2024-03-15 00Z/)).toBeInTheDocument();
    expect(screen.getByText(/Valid: 2024-03-17 12Z \(\+60h\)/)).toBeInTheDocument();
    expect(screen.getByText(/Var: T2m/)).toBeInTheDocument();
    expect(screen.getByText(/Region: East China/)).toBeInTheDocument();
    expect(screen.getByText(/Batch: v2\.3\.1/)).toBeInTheDocument();
  });

  it("displays 'No context selected' when no parameters are set", () => {
    vi.mocked(useAnalysisContext).mockReturnValue({
      ...mockStoreState,
      selectedCycleId: null,
      selectedValidTime: null,
      selectedLeadTime: null,
      selectedVariableId: null,
      selectedRegion: null,
      selectedBatchId: null,
    });

    renderWithQueryClient(<ContextHeader />);
    expect(screen.getByText("No context selected")).toBeInTheDocument();
  });

  it("opens edit modal when Edit button is clicked", () => {
    renderWithQueryClient(<ContextHeader />);

    const editButton = screen.getByRole("button", { name: /edit context parameters/i });
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
  });

  it("handles refresh button click", async () => {
    renderWithQueryClient(<ContextHeader />);

    const refreshButton = screen.getByRole("button", { name: /refresh batch status/i });
    expect(refreshButton).not.toBeDisabled();

    fireEvent.click(refreshButton);

    // Button should be disabled while refreshing
    expect(refreshButton).toBeDisabled();
  });

  it("disables refresh button when no batch is selected", () => {
    vi.mocked(useAnalysisContext).mockReturnValue({
      ...mockStoreState,
      selectedBatchId: null,
    });

    renderWithQueryClient(<ContextHeader />);

    const refreshButton = screen.getByRole("button", { name: /refresh batch status/i });
    expect(refreshButton).toBeDisabled();
  });

  it("applies custom className", () => {
    const { container } = renderWithQueryClient(<ContextHeader className="custom-class" />);
    const headerDiv = container.firstChild;
    expect(headerDiv).toHaveClass("custom-class");
  });

  it("uses Separator components between context items", () => {
    const { container } = renderWithQueryClient(<ContextHeader />);

    // Check that Separator components are present
    const separators = container.querySelectorAll('[data-slot="separator"]');
    // Should have 4 separators between 5 items
    expect(separators.length).toBe(4);
  });

  it("displays Edit button with PencilIcon", () => {
    renderWithQueryClient(<ContextHeader />);

    const editButton = screen.getByRole("button", { name: /edit context parameters/i });
    expect(editButton).toBeInTheDocument();
    expect(editButton.textContent).toContain("Edit");
  });

  it("displays Refresh button with ArrowPathIcon", () => {
    renderWithQueryClient(<ContextHeader />);

    const refreshButton = screen.getByRole("button", { name: /refresh batch status/i });
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton.textContent).toContain("Refresh");
  });
});
