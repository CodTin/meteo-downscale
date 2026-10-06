"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAnalysisContext } from "@/stores/analysisContext";
import type { VariableId } from "@/stores/analysisContext.types";

interface NavigationTab {
  href: string;
  label: string;
  /** Variables that require special validation (e.g., TP gated, 3D requires DEM) */
  requiresDEM?: boolean;
  gatedVariables?: VariableId[];
}

const NAVIGATION_TABS: NavigationTab[] = [
  {
    href: "/forecast/analysis/2d-map",
    label: "2D Map",
  },
  {
    href: "/forecast/analysis/3d-terrain",
    label: "3D Terrain",
    requiresDEM: true,
  },
  {
    href: "/forecast/analysis/ec-ai-comparison",
    label: "EC-AI Comparison",
  },
  {
    href: "/forecast/analysis/ensemble",
    label: "Ensemble/Threshold",
    gatedVariables: ["TP"],
  },
  {
    href: "/forecast/analysis/point-region",
    label: "Point/Region Analysis",
  },
  {
    href: "/forecast/analysis/cross-cycle",
    label: "Cross-Cycle Evolution",
  },
];

interface AnalysisNavigationProps {
  className?: string;
}

/**
 * Analysis Sub-Page Navigation Component
 *
 * Left sidebar with 6 vertical tabs for different analysis visualization modes.
 * Preserves context (cycle/variable/region/batch) on navigation via Zustand store.
 *
 * @example
 * ```tsx
 * <AnalysisNavigation />
 * ```
 */
export function AnalysisNavigation({ className }: AnalysisNavigationProps) {
  const pathname = usePathname();
  const { selectedVariableId } = useAnalysisContext();

  /**
   * Check if a tab can display the current data layer
   * Returns: { canDisplay: boolean, reason?: string }
   */
  const validateTabSupport = (tab: NavigationTab) => {
    // Check if TP is gated for this tab
    if (tab.gatedVariables?.includes("TP") && selectedVariableId === "TP") {
      return {
        canDisplay: false,
        reason: "TP (precipitation) is not yet supported for this view. Please select another variable.",
      };
    }

    // Check if DEM is required (placeholder - actual DEM check would query availability)
    if (tab.requiresDEM) {
      // TODO: Implement actual DEM availability check
      // For now, we allow navigation but could add validation later
      return { canDisplay: true };
    }

    return { canDisplay: true };
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: NavigationTab
  ) => {
    const validation = validateTabSupport(tab);

    if (!validation.canDisplay) {
      e.preventDefault();
      // Show inline error - in a real implementation, this would be a toast or modal
      alert(validation.reason);
    }
    // If canDisplay is true, the Link component handles navigation normally
  };

  return (
    <nav
      className={`w-60 bg-white border-r border-neutral-200 ${className || ""}`}
      aria-label="Analysis sub-page navigation"
    >
      <ul className="flex flex-col py-4">
        {NAVIGATION_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const validation = validateTabSupport(tab);
          const isUnsupported = !validation.canDisplay;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                onClick={(e) => handleTabClick(e, tab)}
                className={`
                  relative flex items-center px-6 py-3 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-neutral-200 text-neutral-900 border-l-[3px] border-blue-500"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 border-l-[3px] border-transparent"
                  }
                  ${isUnsupported ? "opacity-50 cursor-not-allowed" : ""}
                `}
                aria-current={isActive ? "page" : undefined}
                aria-disabled={isUnsupported}
              >
                {tab.label}
                {isUnsupported && (
                  <span className="ml-2 text-xs text-amber-600" title={validation.reason}>
                    ⚠
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
