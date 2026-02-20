\"use client\";

import { ScanFinding } from "@/lib/types";

const severityColor = {
  info: "text-slate-400",
  warning: "text-yellow-300",
  critical: "text-danger"
};

type Props = {
  findings: ScanFinding[];
};

export default function FindingsList({ findings }: Props) {
  return (
    <div className="space-y-4">
      {findings.map((finding) => (
        <div
          key={finding.key}
          className="rounded-xl border border-white/10 bg-black/40 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">{finding.label}</p>
            <span className={`text-xs font-semibold ${severityColor[finding.severity]}`}>
              {finding.triggered ? `已触发 - 扣 ${finding.deduction} 分` : "未触发"}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            {finding.triggered ? finding.detail : "该项未检测到明显异常。"}
          </p>
        </div>
      ))}
    </div>
  );
}
