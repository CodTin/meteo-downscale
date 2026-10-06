# Recharts (via shadcn/ui) for Charts and Time Series

We chose **Recharts** (~400KB) accessed through **shadcn/ui chart components** for ensemble visualization. The `charts` prototype validates Recharts handles multi-member ensemble time series (10+ members), ensemble spread bands (area visualization), EC baseline comparison overlay, threshold exceedance bar charts, cross-cycle evolution tables, and missing data gaps with a declarative React API.

shadcn/ui chart components (`ChartContainer`, `ChartTooltip`, `ChartConfig`) are thin wrappers that add theming, accessibility layer, and consistent styling on top of Recharts. This delivers the proven visualization capability from the prototype plus automatic dark mode and design system integration with minimal migration effort.

This explicitly rejects ECharts (imperative API less idiomatic with React) and serves requirements YU-286 (ensemble spread bands) and YU-288 (cross-cycle evolution).

## Considered Options

- **ECharts**: Rejected due to imperative API that's less idiomatic with React's declarative model
- **Victory**: Rejected due to smaller community, fewer examples, and uncertain Next.js 16 compatibility
- **Raw Recharts without shadcn wrappers**: Rejected because shadcn integration provides theming and accessibility for free
