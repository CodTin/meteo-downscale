"use client";

import { ContextHeader } from "@/components/analysis/ContextHeader";
import { AnalysisNavigation } from "@/components/analysis/AnalysisNavigation";
import { useAnalysisUrlSync } from "@/hooks/useAnalysisUrlSync";

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sync analysis context with URL parameters
  const { urlErrors, hasUrlParams } = useAnalysisUrlSync();

  return (
    <div className="flex flex-col h-screen">
      {/* Show URL validation errors if any */}
      {urlErrors.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="text-sm text-amber-900">
            <strong>Invalid URL parameters:</strong>
            <ul className="list-disc list-inside mt-1">
              {urlErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Context Header appears above the sidebar and content */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <ContextHeader />
      </div>

      {/* Main content area with sidebar and page content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar navigation (240px width as per spec) */}
        <AnalysisNavigation />

        {/* Page content area */}
        <main className="flex-1 overflow-auto bg-neutral-50">
          {children}
        </main>
      </div>
    </div>
  );
}
