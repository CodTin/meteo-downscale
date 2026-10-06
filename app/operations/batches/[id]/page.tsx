export default function OperationsBatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        生产批次详情: {params.id}
      </h1>
      <p className="text-neutral-600">
        查看该批次的输入来源、执行步骤、失败原因和发布状态
      </p>
    </div>
  );
}
