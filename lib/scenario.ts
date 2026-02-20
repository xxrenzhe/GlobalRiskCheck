import { ScenarioId } from "@/lib/types";

export type ScenarioConfig = {
  id: ScenarioId;
  label: string;
  description: string;
  weights: {
    hosting: number;
    creep: number;
    webrtc: number;
    device: number;
  };
  avgScore: number;
  riskRate: string;
};

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "tiktok",
    label: "TikTok 矩阵",
    description: "高频多账号运营，强调 IP 与指纹一致性。",
    weights: {
      hosting: 1.2,
      creep: 1.1,
      webrtc: 1.1,
      device: 1.0
    },
    avgScore: 62,
    riskRate: "87%"
  },
  {
    id: "amazon",
    label: "亚马逊测评",
    description: "强风控审查，重视 IP 与设备稳定性。",
    weights: {
      hosting: 1.3,
      creep: 1.0,
      webrtc: 1.0,
      device: 1.1
    },
    avgScore: 66,
    riskRate: "82%"
  },
  {
    id: "indie",
    label: "独立站站群",
    description: "多站点投放，均衡看待所有风险维度。",
    weights: {
      hosting: 1.0,
      creep: 1.0,
      webrtc: 1.0,
      device: 1.0
    },
    avgScore: 71,
    riskRate: "74%"
  }
];

export const getScenarioConfig = (id: ScenarioId): ScenarioConfig =>
  SCENARIOS.find((item) => item.id === id) || SCENARIOS[0];
