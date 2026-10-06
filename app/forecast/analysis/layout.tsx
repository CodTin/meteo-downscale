import { ContextHeader } from "@/components/analysis/ContextHeader";
import { AnalysisNavigation } from "@/components/analysis/AnalysisNavigation";

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
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
