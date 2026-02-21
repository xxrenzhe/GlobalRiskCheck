import { ScanFinding, ScanPayload, ScoreResult, ScenarioId } from "@/lib/types";
import { getRuntimeConfig } from "@/lib/runtimeConfig";
import { getScenarioConfig } from "@/lib/scenario";

const clampScore = (score: number) => Math.max(0, Math.min(100, score));

const formatIpDetail = (payload: ScanPayload) => {
  if (!payload.ipQuality) {
    return "⚠️ IP 质量检测失败，请重试或更换网络。";
  }
  const { ip, isp, asn, ipTypeLabel, riskScore, abuseConfidence, source } = payload.ipQuality;
  const segments = [
    `检测节点: ${ip} / ${isp || "未知 ISP"} / ${asn || "未知 ASN"}`
  ];
  if (ipTypeLabel) segments.push(`类型: ${ipTypeLabel}`);
  if (typeof riskScore === "number") segments.push(`欺诈分: ${riskScore}/100`);
  if (typeof abuseConfidence === "number") segments.push(`Abuse: ${abuseConfidence}%`);
  if (source) segments.push(`来源: ${source}`);
  return segments.join(" | ");
};

export const buildFindings = (payload: ScanPayload, scenarioId: ScenarioId): ScanFinding[] => {
  const config = getRuntimeConfig();
  const scenario = getScenarioConfig(scenarioId);
  const ipQuality = payload.ipQuality;
  const riskScore = ipQuality?.riskScore ?? 0;
  const abuseScore = ipQuality?.abuseConfidence ?? 0;
  const ipSignals: string[] = [];
  if (ipQuality?.proxy) ipSignals.push("代理标记");
  if (ipQuality?.vpn) ipSignals.push("VPN 标记");
  if (ipQuality?.hosting) ipSignals.push("Hosting 标记");
  if (ipQuality?.ipTypeLabel) ipSignals.push(`类型: ${ipQuality.ipTypeLabel}`);
  if (typeof ipQuality?.riskScore === "number") ipSignals.push(`欺诈分 ${ipQuality.riskScore}/100`);
  if (typeof ipQuality?.abuseConfidence === "number")
    ipSignals.push(`Abuse ${ipQuality.abuseConfidence}%`);
  const hostingRisk = !!ipQuality && (
    ipQuality.ipType === "hosting" ||
    ipQuality.ipType === "vpn" ||
    ipQuality.hosting ||
    ipQuality.proxy ||
    riskScore >= 75 ||
    abuseScore >= 50
  );
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

  const baseFindings: ScanFinding[] = [
    {
      key: "hostingIp",
      label: "机房/代理 IP 暴露",
      severity: "critical",
      triggered: hostingRisk,
      deduction: Math.round(config.scoring.hostingDeduction * scenario.weights.hosting),
      detail: config.messages.hosting
    },
    {
      key: "creepLie",
      label: "CreepJS 指纹欺骗",
      severity: "critical",
      triggered: creepTriggered,
      deduction: Math.round(config.scoring.creepDeduction * scenario.weights.creep),
      detail: config.messages.creep
    },
    {
      key: "webrtcLeak",
      label: "WebRTC 真实 IP 泄露",
      severity: "warning",
      triggered: webrtcTriggered,
      deduction: Math.round(config.scoring.webrtcDeduction * scenario.weights.webrtc),
      detail: config.messages.webrtc
    },
    {
      key: "deviceRisk",
      label: "硬件与时区关联风险",
      severity: "warning",
      triggered: deviceTriggered,
      deduction: Math.round(config.scoring.deviceDeduction * scenario.weights.device),
      detail: config.messages.device
    }
  ];

  return baseFindings.map((finding) => {
    let detail = finding.detail;
    if (finding.key === "hostingIp") {
      detail = `${detail} ${formatIpDetail(payload)}`;
      if (ipSignals.length > 0) {
        detail = `${detail} | 风险信号: ${ipSignals.join(" / ")}`;
      }
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

export const scorePayload = (payload: ScanPayload, scenarioId: ScenarioId): ScoreResult => {
  const findings = buildFindings(payload, scenarioId);
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
    findings,
    scenarioId
  };
};
