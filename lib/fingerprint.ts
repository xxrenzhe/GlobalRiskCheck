import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { FingerprintResult } from "@/lib/types";

export const getFingerprint = async (): Promise<FingerprintResult | null> => {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return {
      visitorId: result.visitorId,
      confidence: result.confidence?.score,
      components: {
        hardwareConcurrency: result.components?.hardwareConcurrency?.value,
        deviceMemory: result.components?.deviceMemory?.value,
        colorDepth: result.components?.colorDepth?.value
      }
    };
  } catch (error) {
    return null;
  }
};
