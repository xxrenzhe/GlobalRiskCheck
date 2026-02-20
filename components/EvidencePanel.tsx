"use client";

import { ScanPayload } from "@/lib/types";

const boolLabel = (value?: boolean) => (value ? "是" : "否");

const formatIpList = (list: string[] | undefined) => {
  if (!list || list.length === 0) {
    return "未检测到";
  }
  return list.join(" / ");
};

type Props = {
  payload: ScanPayload;
};

export default function EvidencePanel({ payload }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-neon">Evidence 01</p>
        <p className="mt-2 text-sm font-semibold text-white">IP 信誉证据</p>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          <p>IP: {payload.ipQuality?.ip || "未知"}</p>
          <p>ISP: {payload.ipQuality?.isp || "未知"}</p>
          <p>ASN: {payload.ipQuality?.asn || "未知"}</p>
          <p>Hosting: {boolLabel(payload.ipQuality?.hosting)}</p>
          <p>Proxy: {boolLabel(payload.ipQuality?.proxy)}</p>
          <p>Country: {payload.ipQuality?.country || "未知"}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-neon">Evidence 02</p>
        <p className="mt-2 text-sm font-semibold text-white">WebRTC 泄露证据</p>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          <p>泄露状态: {payload.webrtc?.leakDetected ? "已检测到" : "未检测到"}</p>
          <p>本地 IP: {formatIpList(payload.webrtc?.localIps)}</p>
          <p>候选 IP: {formatIpList(payload.webrtc?.ips)}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-neon">Evidence 03</p>
        <p className="mt-2 text-sm font-semibold text-white">指纹欺骗检测</p>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          <p>Webdriver: {boolLabel(payload.creep?.webdriver)}</p>
          <p>Canvas 噪点: {boolLabel(payload.creep?.canvasNoise)}</p>
          <p>Math 引擎: {payload.creep?.mathLie ? "异常" : "正常"}</p>
          <p>备注: {payload.creep?.notes?.join("、") || "无异常"}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-neon">Evidence 04</p>
        <p className="mt-2 text-sm font-semibold text-white">设备指纹证据</p>
        <div className="mt-3 space-y-2 text-xs text-slate-300">
          <p>VisitorID: {payload.fingerprint?.visitorId || "未知"}</p>
          <p>CPU 核心: {payload.fingerprint?.components?.hardwareConcurrency || "未知"}</p>
          <p>内存: {payload.fingerprint?.components?.deviceMemory || "未知"}</p>
          <p>色深: {payload.fingerprint?.components?.colorDepth || "未知"}</p>
          <p>时区/语言: {payload.tzMismatch ? "不匹配" : "匹配"}</p>
        </div>
      </div>
    </div>
  );
}
