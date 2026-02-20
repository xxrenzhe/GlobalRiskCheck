\"use client\";

import { ScoreResult } from "@/lib/types";

const levelMap = {
  A: { label: "A级 / 极度安全", color: "text-neon", bg: "bg-neon/10" },
  B: { label: "B级 / 中度风险", color: "text-yellow-300", bg: "bg-yellow-500/10" },
  C: { label: "C级 / 高危状态", color: "text-danger", bg: "bg-danger/10" },
  D: { label: "D级 / 极高风险", color: "text-danger", bg: "bg-danger/15" }
};

type Props = {
  result: ScoreResult;
};

export default function ScorePanel({ result }: Props) {
  const level = levelMap[result.level];

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${level.bg}`}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">安全评分</p>
          <p className="mt-3 text-5xl font-semibold text-white">
            {result.score}
            <span className="text-xl text-slate-400"> / 100</span>
          </p>
          <p className={`mt-2 text-sm font-semibold ${level.color}`}>{level.label}</p>
        </div>
        <div className="max-w-sm text-sm text-slate-300">
          <p>
            平台风控对您的环境评分极其严苛。红区用户往往在 48 小时内触发批量封禁。
          </p>
          <p className="mt-3 text-xs text-slate-400">评分为内部模型模拟，仅用于风险提示。</p>
        </div>
      </div>
    </div>
  );
}
