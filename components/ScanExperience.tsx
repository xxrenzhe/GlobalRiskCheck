"use client";

import { useMemo, useState } from "react";
import TerminalScan from "@/components/TerminalScan";
import ScorePanel from "@/components/ScorePanel";
import FindingsList from "@/components/FindingsList";
import Offers from "@/components/Offers";
import ScenarioSelector from "@/components/ScenarioSelector";
import EvidencePanel from "@/components/EvidencePanel";
import ShareActions from "@/components/ShareActions";
import { detectCreep } from "@/lib/creep";
import { getFingerprint } from "@/lib/fingerprint";
import { detectWebRTCLeak } from "@/lib/webrtc";
import { fetchIpQuality } from "@/lib/ipQuality";
import { isTimezoneMismatch } from "@/lib/timezone";
import { scorePayload } from "@/lib/scoring";
import { createWatermark } from "@/lib/watermark";
import { ScanPayload, ScenarioId, ScoreResult } from "@/lib/types";
import { getScenarioConfig } from "@/lib/scenario";

const scanLines = [
  "[OK] Injecting JS Probes...",
  "[INFO] Calibrating Canvas Engine...",
  "[WARNING] Testing WebRTC Leak...",
  "[INFO] Querying Global ASN Blacklist...",
  "[OK] Extracting Hardware Canvas Hash...",
  "[INFO] Collecting AudioContext Fingerprint...",
  "[WARNING] Checking Webdriver Masking...",
  "[OK] Reading GPU Renderer Profile...",
  "[INFO] Validating Timezone & Locale Sync...",
  "[OK] Cross-checking IP Reputation...",
  "[WARNING] Inspecting Proxy Trace...",
  "[OK] Building VisitorID...",
  "[INFO] Running Lie Detection Engine...",
  "[OK] Correlating Device Entropy...",
  "[INFO] Simulating Risk AI Model...",
  "[OK] Finalizing Risk Score..."
];

const randomDuration = () => 8000 + Math.floor(Math.random() * 4000);


export default function ScanExperience() {
  const [stage, setStage] = useState<"idle" | "scanning" | "done">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [payload, setPayload] = useState<ScanPayload | null>(null);
  const [watermark, setWatermark] = useState<string>("");
  const [scenarioId, setScenarioId] = useState<ScenarioId>("tiktok");

  const runScan = async (): Promise<ScanPayload> => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language || "";

    const creep = detectCreep();
    const [ipResult, fingerprintResult, webrtcResult] = await Promise.allSettled([
      fetchIpQuality(),
      getFingerprint(),
      detectWebRTCLeak()
    ]);
    const ipQuality = ipResult.status === "fulfilled" ? ipResult.value : null;
    const fingerprint = fingerprintResult.status === "fulfilled" ? fingerprintResult.value : null;
    const webrtc = webrtcResult.status === "fulfilled" ? webrtcResult.value : null;

    return {
      ipQuality,
      fingerprint,
      webrtc,
      creep,
      tzMismatch: isTimezoneMismatch(language, timezone)
    };
  };

  const startScan = async () => {
    if (stage === "scanning") {
      return;
    }
    setStage("scanning");
    setLogs([]);
    setProgress(0);
    setResult(null);
    setPayload(null);

    const duration = randomDuration();
    const interval = Math.max(120, Math.floor(duration / scanLines.length));
    let index = 0;

    const logTimer = window.setInterval(() => {
      setLogs((prev) => {
        if (index >= scanLines.length) {
          return prev;
        }
        const next = [...prev, scanLines[index]];
        index += 1;
        return next;
      });
      setProgress((prev) => Math.min(100, prev + 100 / scanLines.length));
    }, interval);

    const [payload] = await Promise.all([
      runScan(),
      new Promise((resolve) => setTimeout(resolve, duration))
    ]);

    window.clearInterval(logTimer);
    setProgress(100);
    setLogs(scanLines);

    const scored = scorePayload(payload, scenarioId);
    setResult(scored);
    setPayload(payload);
    setStage("done");

    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    const visitorId = payload.fingerprint?.visitorId || "ANON";
    const watermarkText = `VisitorID:${visitorId} | ${timestamp}`;
    const watermarkUrl = createWatermark(watermarkText);
    setWatermark(watermarkUrl);
  };

  const scenario = useMemo(() => getScenarioConfig(scenarioId), [scenarioId]);

  const scoreHighlight = useMemo(() => {
    if (!result) return "";
    return result.score < 70 ? "text-danger" : "text-neon";
  }, [result]);

  return (
    <section id="scan" className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neon">深度扫描入口</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">一键深度扫描</h2>
          <p className="mt-2 text-sm text-slate-300">
            扫描过程中将持续构建指纹与 IP 信誉模型，请勿关闭页面。
          </p>
          <div className="mt-4">
            <ScenarioSelector
              value={scenarioId}
              onChange={setScenarioId}
              disabled={stage === "scanning"}
            />
            <p className="mt-2 text-xs text-slate-400">
              当前场景：{scenario.label} · 平均分 {scenario.avgScore} · 高危率 {scenario.riskRate}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={startScan}
          className="rounded-full bg-neon px-6 py-3 text-xs font-semibold text-black shadow-glow transition hover:scale-[1.02]"
        >
          {stage === "scanning" ? "扫描进行中..." : "初始化深度扫描"}
        </button>
      </div>

      {stage === "scanning" ? (
        <TerminalScan logs={logs} progress={progress} />
      ) : null}

      {stage === "done" && result ? (
        <div id="result" className="mt-10 space-y-8">
          <div
            className="rounded-2xl border border-white/10 bg-black/60 p-6"
            style={{
              backgroundImage: watermark ? `url(${watermark})` : undefined,
              backgroundRepeat: "repeat"
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">最终评分</p>
              <span className={`text-sm font-semibold ${scoreHighlight}`}>风险指数已锁定</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">场景：{scenario.label}</p>
            <div className="mt-6">
              <ScorePanel result={result} />
            </div>
            <div className="mt-6">
              <FindingsList findings={result.findings} />
            </div>
            {payload ? (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.3em] text-neon">Evidence</p>
                <h3 className="mt-2 text-lg font-semibold text-white">证据快照</h3>
                <p className="mt-1 text-xs text-slate-400">
                  以下为检测证据链截图，用于验证风险触发原因。
                </p>
                <div className="mt-4">
                  <EvidencePanel payload={payload} />
                </div>
              </div>
            ) : null}
          </div>

          <section id="solutions" className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neon">Risk Fix</p>
              <h3 className="mt-2 text-xl font-semibold text-white">风险修复建议</h3>
            </div>
            <Offers result={result} />
          </section>

          {payload ? <ShareActions result={result} payload={payload} scenarioId={scenarioId} /> : null}
        </div>
      ) : null}
    </section>
  );
}
