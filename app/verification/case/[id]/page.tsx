export default function VerificationCasePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">
        验证个例详情: {params.id}
      </h1>
      <p className="text-neutral-600">
        查看单个案例的误差详情
      </p>
    </div>
  );
}
