import { ScanFinding, ScanPayload, ScoreResult } from "@/lib/types";
import { getRuntimeConfig } from "@/lib/runtimeConfig";

const clampScore = (score: number) => Math.max(0, Math.min(100, score));

const formatIpDetail = (payload: ScanPayload) => {
  if (!payload.ipQuality) {
    return "⚠️ IP 质量检测失败，请重试或更换网络。";
  }
  const { ip, isp, asn } = payload.ipQuality;
  return `检测节点: ${ip} / ${isp || "未知 ISP"} / ${asn || "未知 ASN"}`;
};

export const buildFindings = (payload: ScanPayload): ScanFinding[] => {
  const config = getRuntimeConfig();
  const hostingRisk = !!payload.ipQuality?.hosting || !!payload.ipQuality?.proxy;
  const creepTriggered = !!payload.creep?.canvasNoise || !!payload.creep?.webdriver || !!payload.creep?.mathLie;
  const webrtcTriggered = !!payload.webrtc?.leakDetected;
  const deviceTriggered = !!payload.fingerprint?.visitorId || payload.tzMismatch;

  const creepNotes = payload.creep?.notes?.length ? `触发项：${payload.creep.notes.join("、")}` : "";
  const deviceNotes = [
    payload.fingerprint?.visitorId ? `VisitorID: ${payload.fingerprint.visitorId.slice(0, 8)}...` : "",
    payload.tzMismatch ? "时区与语言不匹配" : ""
  ]
    .filter(Boolean)
    .join("；");

  return [
    {
      key: "hostingIp",
      label: "机房/代理 IP 暴露",
      severity: "critical",
      triggered: hostingRisk,
      deduction: config.scoring.hostingDeduction,
      detail: config.messages.hosting
    },
    {
      key: "creepLie",
      label: "CreepJS 指纹欺骗",
      severity: "critical",
      triggered: creepTriggered,
      deduction: config.scoring.creepDeduction,
      detail: config.messages.creep
    },
    {
      key: "webrtcLeak",
      label: "WebRTC 真实 IP 泄露",
      severity: "warning",
      triggered: webrtcTriggered,
      deduction: config.scoring.webrtcDeduction,
      detail: config.messages.webrtc
    },
    {
      key: "deviceRisk",
      label: "硬件与时区关联风险",
      severity: "warning",
      triggered: deviceTriggered,
      deduction: config.scoring.deviceDeduction,
      detail: config.messages.device
    }
  ].map((finding) => {
    let detail = finding.detail;
    if (finding.key === "hostingIp") {
      detail = `${detail} ${formatIpDetail(payload)}`;
    }
    if (finding.key === "creepLie" && creepNotes) {
      detail = `${detail} ${creepNotes}`;
    }
    if (finding.key === "deviceRisk" && deviceNotes) {
      detail = `${detail} ${deviceNotes}`;
    }
    return {
      ...finding,
      detail
    };
  });
};

export const scorePayload = (payload: ScanPayload): ScoreResult => {
  const findings = buildFindings(payload);
  const deduction = findings.reduce(
    (sum, item) => (item.triggered ? sum + item.deduction : sum),
    0
  );
  const score = clampScore(100 - deduction);
  let level: ScoreResult["level"] = "D";
  if (score >= 90) {
    level = "A";
  } else if (score >= 70) {
    level = "B";
  } else if (score >= 50) {
    level = "C";
  }

  return {
    score,
    level,
    findings
  };
};
