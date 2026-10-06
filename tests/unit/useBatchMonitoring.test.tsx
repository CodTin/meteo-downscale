import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useBatchMonitoring } from "@/hooks/useBatchMonitoring";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Mock the API queries
vi.mock("@/lib/api/queries", () => ({
  useBatchValidationQuery: vi.fn(),
  useBatchUpdateQuery: vi.fn(),
}));

import { useBatchValidationQuery, useBatchUpdateQuery } from "@/lib/api/queries";

describe("useBatchMonitoring", () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Default mock implementations
    (useBatchValidationQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { valid: true, status: "published" },
      isLoading: false,
    });
    (useBatchUpdateQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
    });
  });

  describe("Batch Validation", () => {
    it("detects when batch is withdrawn", () => {
      const withdrawal = {
        reason: "Data quality issue detected",
        timestamp: "2024-10-06T15:00:00Z",
        operator: "system",
        alternatives: ["v2.3.2", "v2.3.3"],
      };

      (useBatchValidationQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: {
          valid: false,
          status: "withdrawn",
          withdrawal,
        },
        isLoading: false,
      });

      const { result } = renderHook(
        () => useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z"),
        { wrapper }
      );

      expect(result.current.isWithdrawn).toBe(true);
      expect(result.current.withdrawal).toEqual(withdrawal);
    });

    it("reports batch as valid when not withdrawn", () => {
      (useBatchValidationQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: {
          valid: true,
          status: "published",
          withdrawal: null,
        },
        isLoading: false,
      });

      const { result } = renderHook(
        () => useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z"),
        { wrapper }
      );

      expect(result.current.isWithdrawn).toBe(false);
      expect(result.current.withdrawal).toBeNull();
    });

    it("reports validating state correctly", () => {
      (useBatchValidationQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      const { result } = renderHook(
        () => useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z"),
        { wrapper }
      );

      expect(result.current.isValidating).toBe(true);
    });
  });

  describe("Batch Update Detection", () => {
    it("detects new batch availability", () => {
      const newBatch = {
        currentBatchId: "v2.3.1",
        newBatchId: "v2.3.2",
        cycleId: "2024-10-06T12:00:00Z",
        publishedAt: "2024-10-06T16:00:00Z",
      };

      (useBatchUpdateQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: newBatch,
      });

      const { result } = renderHook(
        () => useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z", {
          enablePolling: true,
        }),
        { wrapper }
      );

      expect(result.current.newBatchAvailable).toEqual(newBatch);
    });

    it("returns null when no new batch available", () => {
      (useBatchUpdateQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
      });

      const { result } = renderHook(
        () => useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z", {
          enablePolling: true,
        }),
        { wrapper }
      );

      expect(result.current.newBatchAvailable).toBeNull();
    });

    it("dismisses new batch notification", async () => {
      const newBatch = {
        currentBatchId: "v2.3.1",
        newBatchId: "v2.3.2",
        cycleId: "2024-10-06T12:00:00Z",
        publishedAt: "2024-10-06T16:00:00Z",
      };

      (useBatchUpdateQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: newBatch,
      });

      const { result } = renderHook(
        () => useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z", {
          enablePolling: true,
        }),
        { wrapper }
      );

      expect(result.current.newBatchAvailable).toEqual(newBatch);

      // Dismiss the notification
      await waitFor(() => {
        result.current.dismissNewBatchNotification();
      });

      await waitFor(() => {
        expect(result.current.newBatchAvailable).toBeNull();
      });
    });
  });

  describe("Polling Configuration", () => {
    it("enables polling when enablePolling is true", () => {
      renderHook(
        () =>
          useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z", {
            enablePolling: true,
            pollInterval: 30000,
          }),
        { wrapper }
      );

      expect(useBatchValidationQuery).toHaveBeenCalledWith(
        "v2.3.1",
        "2024-10-06T12:00:00Z",
        expect.objectContaining({
          refetchInterval: 30000,
        })
      );
    });

    it("disables polling when enablePolling is false", () => {
      renderHook(
        () =>
          useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z", {
            enablePolling: false,
          }),
        { wrapper }
      );

      expect(useBatchValidationQuery).toHaveBeenCalledWith(
        "v2.3.1",
        "2024-10-06T12:00:00Z",
        expect.objectContaining({
          refetchInterval: false,
        })
      );
    });

    it("uses default 60 second interval when not specified", () => {
      renderHook(
        () =>
          useBatchMonitoring("v2.3.1", "2024-10-06T12:00:00Z", {
            enablePolling: true,
          }),
        { wrapper }
      );

      expect(useBatchValidationQuery).toHaveBeenCalledWith(
        "v2.3.1",
        "2024-10-06T12:00:00Z",
        expect.objectContaining({
          refetchInterval: 60000,
        })
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles null batch ID", () => {
      const { result } = renderHook(
        () => useBatchMonitoring(null, "2024-10-06T12:00:00Z"),
        { wrapper }
      );

      expect(result.current.isWithdrawn).toBe(false);
      expect(result.current.withdrawal).toBeNull();
      expect(result.current.newBatchAvailable).toBeNull();
    });

    it("handles null cycle ID", () => {
      const { result } = renderHook(
        () => useBatchMonitoring("v2.3.1", null),
        { wrapper }
      );

      expect(result.current.isWithdrawn).toBe(false);
      expect(result.current.withdrawal).toBeNull();
      expect(result.current.newBatchAvailable).toBeNull();
    });

    it("resets dismissed state when batch ID changes", async () => {
      const newBatch = {
        currentBatchId: "v2.3.1",
        newBatchId: "v2.3.2",
        cycleId: "2024-10-06T12:00:00Z",
        publishedAt: "2024-10-06T16:00:00Z",
      };

      (useBatchUpdateQuery as ReturnType<typeof vi.fn>).mockReturnValue({
        data: newBatch,
      });

      const { result, rerender } = renderHook(
        ({ batchId }) => useBatchMonitoring(batchId, "2024-10-06T12:00:00Z", {
          enablePolling: true,
        }),
        {
          wrapper,
          initialProps: { batchId: "v2.3.1" },
        }
      );

      // Dismiss notification
      await waitFor(() => {
        result.current.dismissNewBatchNotification();
      });

      await waitFor(() => {
        expect(result.current.newBatchAvailable).toBeNull();
      });

      // Change batch ID
      rerender({ batchId: "v2.3.2" });

      // Should show notification again after batch ID changes
      await waitFor(() => {
        expect(result.current.newBatchAvailable).toEqual(newBatch);
      });
    });
  });
});
