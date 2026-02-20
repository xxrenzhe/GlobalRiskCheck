export type RiskLevel = "A" | "B" | "C" | "D";

export type ScenarioId = "tiktok" | "amazon" | "indie";

export type ScanFinding = {
  key:
    | "hostingIp"
    | "creepLie"
    | "webrtcLeak"
    | "deviceRisk";
  label: string;
  severity: "info" | "warning" | "critical";
  triggered: boolean;
  detail: string;
  deduction: number;
};

export type ScoreResult = {
  score: number;
  level: RiskLevel;
  findings: ScanFinding[];
  scenarioId?: ScenarioId;
};

export type IpQualityResult = {
  ip: string;
  hosting: boolean;
  proxy: boolean;
  isp?: string;
  asn?: string;
  country?: string;
  source?: string;
};

export type FingerprintResult = {
  visitorId: string;
  confidence?: number;
  components?: Record<string, unknown>;
};

export type WebRTCResult = {
  ips: string[];
  localIps: string[];
  leakDetected: boolean;
};

export type CreepResult = {
  webdriver: boolean;
  canvasNoise: boolean;
  mathLie: boolean;
  notes: string[];
};

export type ScanPayload = {
  ipQuality: IpQualityResult | null;
  fingerprint: FingerprintResult | null;
  webrtc: WebRTCResult | null;
  creep: CreepResult | null;
  tzMismatch: boolean;
};
