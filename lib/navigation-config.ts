/**
 * Navigation configuration for the meteo-downscale platform
 * Based on GLOSSARY.md specifications
 */

export interface NavigationRoute {
  path: string;
  label: string;
  description?: string;
}

export interface NavigationTab {
  id: string;
  label: string;
  href: string;
  children?: NavigationRoute[];
}

/**
 * 6 business navigation tabs
 * Maps to "业务主导航" in GLOSSARY.md
 */
export const businessTabs: NavigationTab[] = [
  {
    id: "forecast-overview",
    label: "预报总览",
    href: "/forecast/overview",
  },
  {
    id: "forecast-analysis",
    label: "预报分析",
    href: "/forecast/analysis",
    children: [
      { path: "/forecast/analysis/map-2d", label: "二维地图" },
      { path: "/forecast/analysis/terrain-3d", label: "三维地形" },
      { path: "/forecast/analysis/ec-ai-comparison", label: "EC–AI 对比" },
      { path: "/forecast/analysis/ensemble", label: "集合与阈值" },
      { path: "/forecast/analysis/location", label: "点位/区域分析" },
      { path: "/forecast/analysis/cross-cycle", label: "跨周期演变" },
    ],
  },
  {
    id: "forecast-directory",
    label: "预报目录",
    href: "/forecast/directory",
    children: [
      { path: "/forecast/directory", label: "周期列表" },
      { path: "/forecast/directory/[cycle]", label: "周期详情" },
      { path: "/forecast/directory/valid-time", label: "有效时刻检索" },
    ],
  },
  {
    id: "weather-events",
    label: "天气过程发现",
    href: "/weather-events",
  },
  {
    id: "historical-verification",
    label: "历史验证",
    href: "/verification",
    children: [
      { path: "/verification", label: "验证概览" },
      { path: "/verification/case/[id]", label: "验证个例详情" },
    ],
  },
  {
    id: "export-center",
    label: "导出中心",
    href: "/export",
    children: [
      { path: "/export/new", label: "新建导出" },
      { path: "/export/tasks", label: "任务列表" },
      { path: "/export/tasks/[id]", label: "任务详情" },
    ],
  },
];

/**
 * 2 independent entries (not in main tab bar)
 * Maps to "独立入口" in GLOSSARY.md
 */
export const independentEntries = [
  {
    id: "research",
    label: "研究评价",
    href: "/research",
    children: [
      { path: "/research/benchmarks", label: "基准指标" },
      { path: "/research/ablation", label: "消融实验" },
      { path: "/research/cases", label: "研究个例" },
    ],
  },
  {
    id: "operations",
    label: "运营工作区",
    href: "/operations",
    requiresRole: "operations",
    children: [
      { path: "/operations/batches", label: "生产批次列表" },
      { path: "/operations/batches/[id]", label: "生产批次详情" },
    ],
  },
] as const;

/**
 * All 27 routes defined in the platform
 * (28 including root)
 */
export const allRoutes = [
  // Root
  "/",

  // Forecast Overview (1 route)
  "/forecast/overview",

  // Forecast Analysis (6 sub-pages + 1 parent = 7 routes)
  "/forecast/analysis",
  "/forecast/analysis/map-2d",
  "/forecast/analysis/terrain-3d",
  "/forecast/analysis/ec-ai-comparison",
  "/forecast/analysis/ensemble",
  "/forecast/analysis/location",
  "/forecast/analysis/cross-cycle",

  // Forecast Directory (3 routes)
  "/forecast/directory",
  "/forecast/directory/[cycle]",
  "/forecast/directory/valid-time",

  // Weather Events (1 route)
  "/weather-events",

  // Historical Verification (2 routes)
  "/verification",
  "/verification/case/[id]",

  // Export Center (4 routes: parent + 3 sub-pages)
  "/export",
  "/export/new",
  "/export/tasks",
  "/export/tasks/[id]",

  // Research Evaluation (4 routes: parent + 3 sub-pages)
  "/research",
  "/research/benchmarks",
  "/research/ablation",
  "/research/cases",

  // Operations Workspace (3 routes: parent + 2 sub-pages)
  "/operations",
  "/operations/batches",
  "/operations/batches/[id]",
] as const;

export type RoutePathname = typeof allRoutes[number];
