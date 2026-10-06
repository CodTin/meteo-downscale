"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { businessTabs, independentEntries } from "@/lib/navigation-config";
import { cn } from "@/lib/utils";

interface MainNavigationProps {
  userRole?: "business" | "operations" | "admin";
}

export function MainNavigation({ userRole = "business" }: MainNavigationProps) {
  const pathname = usePathname();

  // Check if current path matches a tab
  const isTabActive = (tabHref: string) => {
    if (tabHref === "/") return pathname === "/";
    return pathname.startsWith(tabHref);
  };

  // Check if operations is accessible
  const canAccessOperations = userRole === "operations" || userRole === "admin";

  return (
    <nav className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main business tabs */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Business navigation tabs */}
            <div className="flex gap-1">
              {businessTabs.map((tab) => {
                const isActive = isTabActive(tab.href);
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                      "relative px-4 py-2 text-sm transition-colors",
                      isActive
                        ? "font-semibold text-neutral-900 border-b-2 border-neutral-900"
                        : "font-normal text-neutral-600 hover:text-neutral-900"
                    )}
                    style={isActive ? { fontWeight: 600 } : undefined}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-neutral-200" />

            {/* Independent entries */}
            <div className="flex gap-4">
              {independentEntries.map((entry) => {
                const isActive = isTabActive(entry.href);
                const isOperations = entry.id === "operations";
                const disabled = isOperations && !canAccessOperations;

                if (disabled) {
                  return (
                    <div
                      key={entry.id}
                      className="group relative"
                      title="需要运营角色权限"
                    >
                      <span className="cursor-not-allowed px-3 py-2 text-sm font-normal text-neutral-400">
                        {entry.label}
                      </span>
                      {/* Tooltip */}
                      <div className="invisible absolute left-0 top-full z-10 mt-2 w-48 rounded-md bg-neutral-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                        此功能需要运营角色权限
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={entry.id}
                    href={entry.href}
                    className={cn(
                      "px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "font-semibold text-neutral-900"
                        : "font-normal text-neutral-600 hover:text-neutral-900"
                    )}
                  >
                    {entry.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
