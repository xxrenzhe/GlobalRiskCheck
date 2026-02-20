import { notFound } from "next/navigation";
import { decodeShareToken } from "@/lib/shareToken";
import { getScenarioConfig } from "@/lib/scenario";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { token: string } }) {
  const payload = decodeShareToken(params.token);
  if (!payload) {
    return {
      title: "GlobalRiskCheck | 分享结果"
    };
  }
  return {
    title: `GlobalRiskCheck | 风险评分 ${payload.score}`,
    description: `场景：${getScenarioConfig(payload.scenarioId).label} · 风险等级 ${payload.level}`
  };
}

export default function SharePage({ params }: { params: { token: string } }) {
  const payload = decodeShareToken(params.token);
  if (!payload) {
    notFound();
  }

  const scenario = getScenarioConfig(payload.scenarioId);

  return (
    <main className="min-h-screen bg-night px-6 py-16 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-neon">Share Report</p>
          <h1 className="mt-3 text-3xl font-semibold">GlobalRiskCheck 风险评分</h1>
          <p className="mt-2 text-sm text-slate-300">
            场景：{scenario.label} · 平均分 {scenario.avgScore} · 高危率 {scenario.riskRate}
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">评分结果</p>
              <span className="text-xs text-slate-400">{payload.createdAt.slice(0, 10)}</span>
            </div>
            <p className="mt-4 text-5xl font-semibold">
              {payload.score}
              <span className="text-xl text-slate-400"> / 100</span>
            </p>
            <p className="mt-2 text-sm text-neon">等级 {payload.level}</p>
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-white">高危触发项</p>
            {payload.highlights.length === 0 ? (
              <p className="text-xs text-slate-400">暂无高危项</p>
            ) : (
              payload.highlights.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/10 bg-black/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <span className="text-xs text-danger">-{item.deduction}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neon/30 bg-black/60 p-6 text-center">
          <p className="text-sm text-slate-200">想知道你的账号风险？立即获取完整检测报告</p>
          <a
            href="/"
            className="mt-4 inline-flex items-center rounded-full bg-neon px-6 py-3 text-xs font-semibold text-black"
          >
            进入检测入口
          </a>
        </div>
      </div>
    </main>
  );
}
