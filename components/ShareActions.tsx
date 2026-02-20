"use client";

import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { ScoreResult, ScanPayload, ScenarioId } from "@/lib/types";
import { getScenarioConfig } from "@/lib/scenario";
import { ShareHighlight } from "@/lib/shareToken";
import ShareCard from "@/components/ShareCard";

const buildHighlights = (result: ScoreResult): ShareHighlight[] => {
  return result.findings
    .filter((finding) => finding.triggered)
    .sort((a, b) => b.deduction - a.deduction)
    .slice(0, 3)
    .map((finding) => ({
      label: finding.label,
      severity: finding.severity === "critical" ? "critical" : "warning",
      deduction: finding.deduction
    }));
};

type Props = {
  result: ScoreResult;
  payload: ScanPayload;
  scenarioId: ScenarioId;
};

export default function ShareActions({ result, payload, scenarioId }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [shareLink, setShareLink] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const scenario = getScenarioConfig(scenarioId);
  const highlights = useMemo(() => buildHighlights(result), [result]);
  const createdAt = useMemo(() => new Date().toISOString().slice(0, 10), [result]);

  const createShareLink = async () => {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          score: result.score,
          level: result.level,
          scenarioId,
          highlights,
          visitor: payload.fingerprint?.visitorId?.slice(0, 8)
        })
      });
      if (!response.ok) {
        throw new Error("share failed");
      }
      const data = (await response.json()) as { sharePath: string };
      const link = `${window.location.origin}${data.sharePath}`;
      setShareLink(link);
      try {
        await navigator.clipboard.writeText(link);
        setStatus("分享链接已复制");
      } catch (clipboardError) {
        setStatus("已生成分享链接，可手动复制");
      }
    } catch (error) {
      setStatus("生成分享链接失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) {
      return;
    }
    setStatus("");
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: "#0b0f0b"
    });
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus("生成海报失败");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `GlobalRiskCheck-${result.score}.png`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus("海报已下载");
    });
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neon">Share</p>
          <h4 className="mt-2 text-lg font-semibold text-white">一键生成分享卡片</h4>
          <p className="mt-1 text-xs text-slate-400">分享结果可解锁进阶报告</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadCard}
            className="rounded-full border border-neon/60 px-5 py-2 text-xs font-semibold text-neon transition hover:bg-neon hover:text-black"
          >
            下载海报
          </button>
          <button
            type="button"
            onClick={createShareLink}
            disabled={loading}
            className="rounded-full bg-neon px-5 py-2 text-xs font-semibold text-black transition hover:scale-[1.02]"
          >
            {loading ? "生成中..." : "复制分享链接"}
          </button>
        </div>
      </div>
      {shareLink ? (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/50 p-3 text-xs text-slate-300">
          分享链接：{shareLink}
        </div>
      ) : null}
      {status ? <p className="mt-3 text-xs text-slate-400">{status}</p> : null}

      <div className="pointer-events-none absolute left-[-9999px] top-0">
        <div ref={cardRef}>
          <ShareCard
            score={result.score}
            level={result.level}
            scenarioLabel={scenario.label}
            avgScore={scenario.avgScore}
            riskRate={scenario.riskRate}
            highlights={highlights}
            createdAt={createdAt}
          />
        </div>
      </div>
    </div>
  );
}
