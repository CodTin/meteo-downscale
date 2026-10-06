import Link from "next/link";

export default function VerificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">历史验证</h1>
      <p className="text-neutral-600 mb-8">
        用对齐的 3 km 参考分析场检查历史预报误差及具备条件的改进证据。
      </p>

      <div className="border border-neutral-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">验证概览</h2>
        <p className="text-sm text-neutral-600">
          查看验证指标和案例列表
        </p>
      </div>
    </div>
  );
}
