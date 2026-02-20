export type RuntimeConfig = {
  affiliate: {
    ipFixUrl: string;
    ipFixName: string;
    fingerprintUrl: string;
    fingerprintName: string;
    privateQrLabel: string;
    privateNote: string;
  };
  scoring: {
    hostingDeduction: number;
    creepDeduction: number;
    webrtcDeduction: number;
    deviceDeduction: number;
  };
  messages: {
    hosting: string;
    creep: string;
    webrtc: string;
    device: string;
  };
};

const obfuscatedBuild = process.env.NEXT_PUBLIC_OBFUSCATED === "true";

const defaultConfig: RuntimeConfig = obfuscatedBuild
  ? {
      affiliate: {
        ipFixUrl: "#",
        ipFixName: "IP 纯净方案",
        fingerprintUrl: "#",
        fingerprintName: "指纹隔离方案",
        privateQrLabel: "微信二维码",
        privateNote: "扫码获取 1V1 诊断"
      },
      scoring: {
        hostingDeduction: 40,
        creepDeduction: 30,
        webrtcDeduction: 20,
        deviceDeduction: 20
      },
      messages: {
        hosting: "检测到 IP 风险，建议查看修复方案。",
        creep: "检测到指纹异常，建议隔离环境。",
        webrtc: "检测到 WebRTC 泄露风险。",
        device: "检测到设备与时区关联风险。"
      }
    }
  : {
      affiliate: {
        ipFixUrl: "https://example.com/affiliate-ip",
        ipFixName: "XX 纯净双 ISP 原生住宅代理",
        fingerprintUrl: "https://example.com/affiliate-fingerprint",
        fingerprintName: "XX 防关联指纹浏览器",
        privateQrLabel: "微信二维码",
        privateNote: "扫码备注：获取《2026 最新大厂风控绕过白皮书》并预约 1V1 诊断"
      },
      scoring: {
        hostingDeduction: 40,
        creepDeduction: 30,
        webrtcDeduction: 20,
        deviceDeduction: 20
      },
      messages: {
        hosting:
          "🚨 致命风险：您正在使用廉价机房 IP。大厂特征库已将此类 IP 标记为群控滥用节点，秒封率 >87%！",
        creep:
          "🚨 重度环境伪装：检测到您的浏览器正在尝试发送虚假的底层硬件数据，已被风控 AI 标记为【高危作弊设备】。",
        webrtc:
          "⚠️ 底层穿透风险：代理软件未能接管 UDP 流量，您的真实物理 IP 已暴露给网页。",
        device:
          "⚠️ 硬件裸奔：您的底层设备特征未做物理级隔离，且系统参数存在逻辑漏洞，易被判定为矩阵强关联。"
      }
    };

export const getRuntimeConfig = (): RuntimeConfig => {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  const runtime = (window as Window & { __GRC_CONFIG__?: Partial<RuntimeConfig> }).__GRC_CONFIG__;
  if (!runtime) {
    return defaultConfig;
  }

  return {
    ...defaultConfig,
    ...runtime,
    affiliate: {
      ...defaultConfig.affiliate,
      ...runtime.affiliate
    },
    scoring: {
      ...defaultConfig.scoring,
      ...runtime.scoring
    },
    messages: {
      ...defaultConfig.messages,
      ...runtime.messages
    }
  };
};
