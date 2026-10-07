import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

/**
 * Create a test QueryClient with sensible defaults
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

/**
 * Render a component wrapped with QueryClientProvider for testing
 *
 * Use this for any component that uses TanStack Query hooks.
 *
 * @example
 * ```typescript
 * import { renderWithQueryClient } from "@/tests/utils/test-utils";
 *
 * it("renders with query", () => {
 *   renderWithQueryClient(<MyComponent />);
 *   expect(screen.getByText("Hello")).toBeInTheDocument();
 * });
 * ```
 */
export function renderWithQueryClient(
  ui: ReactElement,
  options?: RenderOptions
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react";
