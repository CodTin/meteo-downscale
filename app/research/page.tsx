import Link from "next/link";

export default function ResearchPage() {
  const subPages = [
    { href: "/research/benchmarks", label: "基准指标" },
    { href: "/research/ablation", label: "消融实验" },
    { href: "/research/cases", label: "研究个例" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-4">研究评价</h1>
      <p className="text-neutral-600 mb-8">
        查看基准指标、消融实验和研究个例的证据及局限。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
