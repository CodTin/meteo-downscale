import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-neutral-900 mb-6">
          气象降尺度平台
        </h1>
        <p className="text-lg text-neutral-600 mb-8">
          欢迎使用 AI 驱动的气象降尺度平台。请从顶部导航栏选择功能模块。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">
              业务主导航
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              面向区域气象分析/预报人员的主流程
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/forecast/overview"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  预报总览
                </Link>
              </li>
              <li>
                <Link
                  href="/forecast/analysis"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  预报分析
                </Link>
              </li>
              <li>
                <Link
                  href="/forecast/directory"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  预报目录
                </Link>
              </li>
              <li>
                <Link
                  href="/weather-events"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  天气过程发现
                </Link>
              </li>
              <li>
                <Link
                  href="/verification"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  历史验证
                </Link>
              </li>
              <li>
                <Link
                  href="/export"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  导出中心
                </Link>
              </li>
            </ul>
          </div>

          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">
              独立入口
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              研究评价与运营工作区
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/research"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  研究评价
                </Link>
              </li>
              <li>
                <span className="text-neutral-400">
                  运营工作区 <span className="text-xs">(需要运营角色权限)</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
