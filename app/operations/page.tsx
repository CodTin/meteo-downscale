import Link from "next/link";

export default function OperationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">运营工作区</h1>
      <p className="text-neutral-600 mb-8">
        查看生产批次与失败原因，重试失败步骤，发布或撤回产品。
      </p>

      <div className="border border-neutral-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">生产批次列表</h2>
        <p className="text-sm text-neutral-600 mb-4">
          查看生产记录和状态
        </p>
        <Link
          href="/operations/batches"
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          查看批次列表 →
        </Link>
      </div>
    </div>
  );
}
