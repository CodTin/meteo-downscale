"use client";

/**
 * React Query Provider
 *
 * Wraps the application with QueryClientProvider for TanStack Query
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

/**
 * Providers component that wraps the app with all context providers
 *
 * @param children - Child components
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default staleTime: 60 seconds per requirements
            staleTime: 60 * 1000,
            // No auto-refresh on window focus per DESIGN.md
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
            // Consider data stale after the staleTime
            refetchOnMount: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
