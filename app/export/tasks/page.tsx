import Link from "next/link";

export default function ExportTasksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">导出任务列表</h1>
      <p className="text-neutral-600 mb-8">
        查看导出任务状态和下载文件
      </p>

      <div className="space-y-4">
        <Link
          href="/export/new"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          新建导出
        </Link>
      </div>
    </div>
  );
}
