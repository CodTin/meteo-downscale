import Link from "next/link";

export default function ForecastDirectoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">预报目录</h1>
      <p className="text-neutral-600 mb-8">
        找到可用周期或固定有效时刻的预报，并核查发布状态、缺口、覆盖与溯源。
      </p>

      <div className="space-y-4">
        <div className="border border-neutral-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">周期列表</h2>
          <p className="text-sm text-neutral-600 mb-4">
            按周期找产品
          </p>
          <Link
            href="/forecast/directory/valid-time"
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
          >
            按有效时刻检索 →
          </Link>
        </div>
      </div>
    </div>
  );
}
