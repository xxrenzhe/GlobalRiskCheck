"use client";

import { getRuntimeConfig } from "@/lib/runtimeConfig";
import { ScoreResult } from "@/lib/types";

const isTriggered = (result: ScoreResult, key: string) =>
  result.findings.some((finding) => finding.key === key && finding.triggered);

type Props = {
  result: ScoreResult;
};

export default function Offers({ result }: Props) {
  const config = getRuntimeConfig();
  const showIpFix = isTriggered(result, "hostingIp");
  const showFingerprintFix = result.findings.some(
    (finding) => ["creepLie", "webrtcLeak", "deviceRisk"].includes(finding.key) && finding.triggered
  );
  const creepRisk = isTriggered(result, "creepLie");
  const webrtcRisk = isTriggered(result, "webrtcLeak");
  const chainCount = [showIpFix, creepRisk, webrtcRisk].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-neon">Risk Chain</p>
        <h4 className="mt-2 text-lg font-semibold text-white">封号触发核心链路</h4>
        <p className="mt-2 text-sm text-slate-300">
          IP 风险 → 指纹欺骗 → WebRTC 泄露。当前已触发 <span className="font-semibold text-danger">{chainCount}</span> / 3。
        </p>
        <div className="mt-4 grid gap-3 text-xs text-slate-300 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-black/50 p-3">
            <p className="font-semibold text-white">IP 风险</p>
            <p className={showIpFix ? "text-danger" : "text-slate-400"}>
              {showIpFix ? "已触发" : "未触发"}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/50 p-3">
            <p className="font-semibold text-white">指纹欺骗</p>
            <p className={creepRisk ? "text-danger" : "text-slate-400"}>
              {creepRisk ? "已触发" : "未触发"}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/50 p-3">
            <p className="font-semibold text-white">WebRTC 泄露</p>
            <p className={webrtcRisk ? "text-danger" : "text-slate-400"}>
              {webrtcRisk ? "已触发" : "未触发"}
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          建议按链路顺序修复：先解决 IP，再隔离指纹并封堵 WebRTC。
        </p>
      </div>

      {showIpFix ? (
        <div className="rounded-2xl border border-danger/40 bg-black/60 p-6">
          <p className="text-sm font-semibold text-danger">Step 1 · IP 纯净度修复方案</p>
          <p className="mt-3 text-sm text-slate-200">
            想要彻底解决机房 IP 被秒封的问题？跨境大卖都在使用
            <span className="font-semibold text-white"> {config.affiliate.ipFixName}</span>。
            0 污染池，100% 模拟真实海外当地宽带。
          </p>
          <a
            href={config.affiliate.ipFixUrl}
            className="mt-4 inline-flex items-center rounded-full border border-danger/60 px-5 py-2 text-xs font-semibold text-danger transition hover:bg-danger hover:text-black"
          >
            👉 立即获取专属内部折扣
          </a>
        </div>
      ) : null}

      {showFingerprintFix ? (
        <div className="rounded-2xl border border-neon/40 bg-black/60 p-6">
          <p className="text-sm font-semibold text-neon">Step 2 · 指纹隔离 & WebRTC 保护</p>
          <p className="mt-3 text-sm text-slate-200">
            普通浏览器无法阻挡底层特征抓取与 Lie Detection 校验，也难以彻底封堵 WebRTC 泄露。强烈建议使用
            <span className="font-semibold text-white"> {config.affiliate.fingerprintName}</span>，为每个账号创建独立物理沙盒，
            告别强关联。
          </p>
          <a
            href={config.affiliate.fingerprintUrl}
            className="mt-4 inline-flex items-center rounded-full border border-neon/60 px-5 py-2 text-xs font-semibold text-neon transition hover:bg-neon hover:text-black"
          >
            👉 免费下载顶级防关联浏览器
          </a>
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-black/70 p-6">
        <p className="text-sm font-semibold text-white">高端私域导流</p>
        <p className="mt-3 text-sm text-slate-200">
          以上自动化工具仍无法解决您的封控问题？我们提供深度的定制化出海网络架构。
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-6">
          <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300">
            {config.affiliate.privateQrLabel}
          </div>
          <div className="text-xs text-slate-400">{config.affiliate.privateNote}</div>
        </div>
      </div>
    </div>
  );
}
