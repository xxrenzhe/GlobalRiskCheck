import { IpQualityResult } from "@/lib/types";

export const fetchIpQuality = async (): Promise<IpQualityResult | null> => {
  try {
    const response = await fetch("/api/ip-quality", {
      cache: "no-store"
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as IpQualityResult;
    return data;
  } catch (error) {
    return null;
  }
};
