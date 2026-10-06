import Link from "next/link";

export default function ForecastAnalysisPage() {
  const subPages = [
    { href: "/forecast/analysis/map-2d", label: "二维地图" },
    { href: "/forecast/analysis/terrain-3d", label: "三维地形" },
    { href: "/forecast/analysis/ec-ai-comparison", label: "EC–AI 对比" },
    { href: "/forecast/analysis/ensemble", label: "集合与阈值" },
    { href: "/forecast/analysis/location", label: "点位/区域分析" },
    { href: "/forecast/analysis/cross-cycle", label: "跨周期演变" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">预报分析</h1>
      <p className="text-neutral-600 mb-8">
        在同一周期、有效时刻、区域和产品批次下查看气象场，做局地、对比、集合和跨周期分析。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="border border-neutral-200 rounded-lg p-6 hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-semibold text-neutral-900">
              {page.label}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
