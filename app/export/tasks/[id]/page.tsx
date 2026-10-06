export default function ExportTaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        导出任务详情: {params.id}
      </h1>
      <p className="text-neutral-600">
        查看任务状态和元数据
      </p>
    </div>
  );
}
