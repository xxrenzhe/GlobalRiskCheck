import { WebRTCResult } from "@/lib/types";

const isPrivateIp = (ip: string) => {
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("169.254.")) return true;
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true;
  }
  return false;
};

const extractIp = (candidate: string) => {
  const ipMatch = candidate.match(/([0-9]{1,3}(?:\.[0-9]{1,3}){3})/);
  return ipMatch ? ipMatch[1] : null;
};

export const detectWebRTCLeak = async (): Promise<WebRTCResult | null> => {
  if (typeof window === "undefined" || !window.RTCPeerConnection) {
    return null;
  }

  const rtc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  const ips = new Set<string>();
  return new Promise<WebRTCResult>((resolve) => {
    let settled = false;
    const finalize = () => {
      if (settled) return;
      settled = true;
      rtc.close();
      const allIps = Array.from(ips);
      const localIps = allIps.filter(isPrivateIp);
      resolve({
        ips: allIps,
        localIps,
        leakDetected: localIps.length > 0
      });
    };

    rtc.createDataChannel("grc");
    rtc.onicecandidate = (event) => {
      if (!event.candidate) {
        finalize();
        return;
      }
      const candidate = event.candidate.candidate || "";
      const ip = extractIp(candidate);
      if (ip) {
        ips.add(ip);
      }
    };

    rtc
      .createOffer()
      .then((offer) => rtc.setLocalDescription(offer))
      .catch(() => finalize());

    setTimeout(finalize, 2000);
  });
};
