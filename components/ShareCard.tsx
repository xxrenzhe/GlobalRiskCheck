"use client";

import { ShareHighlight } from "@/lib/shareToken";

const levelTone: Record<string, string> = {
  A: "text-neon",
  B: "text-yellow-300",
  C: "text-danger",
  D: "text-danger"
};

type Props = {
  score: number;
  level: string;
  scenarioLabel: string;
  avgScore: number;
  riskRate: string;
  highlights: ShareHighlight[];
  createdAt: string;
};

export default function ShareCard({
  score,
  level,
  scenarioLabel,
  avgScore,
  riskRate,
  highlights,
  createdAt
}: Props) {
  return (
    <div className="w-[520px] rounded-3xl border border-white/10 bg-black/80 p-8 text-white shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-neon">GlobalRiskCheck</p>
      <h2 className="mt-3 text-2xl font-semibold">风险评分报告</h2>
      <p className="mt-2 text-xs text-slate-400">
        场景：{scenarioLabel} · 平均分 {avgScore} · 高危率 {riskRate}
      </p>
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-5xl font-semibold">
            {score}
            <span className="text-xl text-slate-400"> / 100</span>
          </p>
          <p className={`mt-2 text-sm font-semibold ${levelTone[level] || "text-white"}`}>
            等级 {level}
          </p>
        </div>
        <div className="text-xs text-slate-400">{createdAt}</div>
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-sm font-semibold text-white">高危触发项</p>
        {highlights.length === 0 ? (
          <p className="text-xs text-slate-400">暂无高危项</p>
        ) : (
          highlights.map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-black/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{item.label}</span>
                <span className="text-xs text-danger">-{item.deduction}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-6 rounded-xl border border-neon/30 bg-neon/10 p-3 text-xs text-neon">
        扫描得分越低，封号概率越高。立即访问 globalriskcheck.co 进行完整检测。
      </div>
    </div>
  );
}
