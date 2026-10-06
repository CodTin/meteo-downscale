export default function CycleDetailPage({
  params,
}: {
  params: { cycle: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        周期详情: {params.cycle}
      </h1>
      <p className="text-neutral-600">
        检查一个周期的发布状态、时效覆盖和溯源信息
      </p>
    </div>
  );
}
