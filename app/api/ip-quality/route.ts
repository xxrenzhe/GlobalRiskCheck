import { NextRequest, NextResponse } from "next/server";

const ipqsKey = process.env.IPQS_API_KEY;
const abuseKey = process.env.ABUSEIPDB_API_KEY;

type IpQualityData = {
  ip: string;
  hosting: boolean;
  proxy: boolean;
  isp?: string;
  asn?: string;
  org?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  mobile?: boolean;
  vpn?: boolean;
  tor?: boolean;
  ipType?: "residential" | "hosting" | "mobile" | "vpn" | "unknown";
  ipTypeLabel?: string;
  riskScore?: number;
  abuseConfidence?: number;
  abuseReports?: number;
  source: string;
};

const buildResponse = (data: IpQualityData) =>
  NextResponse.json({
    ip: data.ip,
    hosting: data.hosting,
    proxy: data.proxy,
    isp: data.isp,
    asn: data.asn,
    org: data.org,
    country: data.country,
    countryCode: data.countryCode,
    city: data.city,
    region: data.region,
    mobile: data.mobile,
    vpn: data.vpn,
    tor: data.tor,
    ipType: data.ipType,
    ipTypeLabel: data.ipTypeLabel,
    riskScore: data.riskScore,
    abuseConfidence: data.abuseConfidence,
    abuseReports: data.abuseReports,
    source: data.source
  });

const detectIpType = (data: {
  proxy?: boolean;
  vpn?: boolean;
  tor?: boolean;
  hosting?: boolean;
  mobile?: boolean;
  isp?: string;
  org?: string;
  asn?: string;
}) => {
  const orgText = `${data.isp || ""} ${data.org || ""} ${data.asn || ""}`.toLowerCase();
  const dcKw =
    /amazon|aws|google|microsoft|azure|alibaba|tencent|cloudflare|linode|digitalocean|vultr|hetzner|ovh|choopa|zenlayer|leaseweb|serverius|quadranet|colocrossing|psychz|coresite|navisite|ntt|cogent|lumen|centurylink|hosting|server|cloud|vps|dedicated|datacenter|data center|cdn|coloc|idc/;
  const mobileKw =
    /mobile|cellular|t-mobile|verizon|at&t|sprint|china mobile|china unicom|docomo|softbank|kddi|singtel|starhub|telkomsel|airtel|jio|vodafone|orange/;
  const vpnKw =
    /vpn|proxy|tor|nordvpn|expressvpn|surfshark|protonvpn|mullvad|purevpn|cyberghost|ipvanish|windscribe|hideip|privatevpn/;

  if (data.proxy || data.vpn || data.tor || vpnKw.test(orgText)) {
    return { ipType: "vpn", ipTypeLabel: "VPN / 代理" };
  }
  if (data.hosting || dcKw.test(orgText)) {
    return { ipType: "hosting", ipTypeLabel: "机房 IP (Datacenter/IDC)" };
  }
  if (data.mobile || mobileKw.test(orgText)) {
    return { ipType: "mobile", ipTypeLabel: "移动网络 IP (Mobile)" };
  }
  return { ipType: "residential", ipTypeLabel: "家庭宽带 IP (Residential)" };
};

const computeRiskScore = (fraudScore?: number, abuseConfidence?: number) => {
  const scores = [fraudScore, abuseConfidence].filter(
    (value): value is number => typeof value === "number" && !Number.isNaN(value)
  );
  if (scores.length === 0) return undefined;
  return Math.max(...scores);
};

const fetchIpApi = async (ip?: string) => {
  const fields = [
    "query",
    "isp",
    "org",
    "as",
    "country",
    "countryCode",
    "regionName",
    "city",
    "hosting",
    "proxy",
    "mobile"
  ].join(",");
  const target = ip ? `http://ip-api.com/json/${ip}?fields=${fields}` : `http://ip-api.com/json/?fields=${fields}`;
  const response = await fetch(target, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("ip-api failed");
  }
  const data = (await response.json()) as {
    query: string;
    isp?: string;
    org?: string;
    as?: string;
    country?: string;
    countryCode?: string;
    regionName?: string;
    city?: string;
    hosting?: boolean;
    proxy?: boolean;
    mobile?: boolean;
  };
  const ipType = detectIpType({
    proxy: data.proxy,
    hosting: data.hosting,
    mobile: data.mobile,
    isp: data.isp,
    org: data.org,
    asn: data.as
  });
  return {
    ip: data.query,
    hosting: Boolean(data.hosting),
    proxy: Boolean(data.proxy),
    isp: data.isp,
    asn: data.as,
    org: data.org,
    country: data.country,
    countryCode: data.countryCode,
    region: data.regionName,
    city: data.city,
    mobile: data.mobile,
    ipType: ipType.ipType,
    ipTypeLabel: ipType.ipTypeLabel,
    source: "ip-api"
  } as IpQualityData;
};

const fetchIpqs = async (ip?: string) => {
  if (!ipqsKey) {
    throw new Error("ipqs missing");
  }
  const target = ip
    ? `https://ipqualityscore.com/api/json/ip/${ipqsKey}/${ip}?strictness=1&allow_public_access_points=true`
    : `https://ipqualityscore.com/api/json/ip/${ipqsKey}?strictness=1&allow_public_access_points=true`;
  const response = await fetch(target, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("ipqs failed");
  }
  const data = (await response.json()) as {
    ip: string;
    ISP?: string;
    ASN?: string;
    organization?: string;
    city?: string;
    region?: string;
    country_code?: string;
    country?: string;
    fraud_score?: number;
    proxy?: boolean;
    vpn?: boolean;
    tor?: boolean;
    hosting?: boolean;
    mobile?: boolean;
  };

  const ipType = detectIpType({
    proxy: data.proxy,
    vpn: data.vpn,
    tor: data.tor,
    hosting: data.hosting,
    mobile: data.mobile,
    isp: data.ISP,
    org: data.organization,
    asn: data.ASN
  });

  return {
    ip: data.ip,
    hosting: Boolean(data.hosting),
    proxy: Boolean(data.proxy || data.vpn || data.tor),
    vpn: Boolean(data.vpn),
    tor: Boolean(data.tor),
    mobile: Boolean(data.mobile),
    isp: data.ISP,
    asn: data.ASN,
    org: data.organization,
    country: data.country || data.country_code,
    countryCode: data.country_code,
    city: data.city,
    region: data.region,
    riskScore: data.fraud_score,
    ipType: ipType.ipType,
    ipTypeLabel: ipType.ipTypeLabel,
    source: "ipqs"
  } as IpQualityData;
};

const fetchAbuseIpdb = async (ip: string) => {
  if (!abuseKey) {
    return null;
  }
  const target = `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(
    ip
  )}&maxAgeInDays=90`;
  const response = await fetch(target, {
    cache: "no-store",
    headers: {
      Key: abuseKey,
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as {
    data?: { abuseConfidenceScore?: number; totalReports?: number };
  };
  if (!data?.data) return null;
  return {
    abuseConfidence: data.data.abuseConfidenceScore ?? 0,
    abuseReports: data.data.totalReports ?? 0
  };
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";

  try {
    const [ipqs, ipapi] = await Promise.allSettled([
      fetchIpqs(ip || undefined),
      fetchIpApi(ip || undefined)
    ]);

    const primary = ipqs.status === "fulfilled" ? ipqs.value : null;
    const fallback = ipapi.status === "fulfilled" ? ipapi.value : null;

    const base: IpQualityData | null = primary || fallback;
    if (!base) {
      throw new Error("ip-info failed");
    }

    const abuse = base.ip ? await fetchAbuseIpdb(base.ip) : null;
    const riskScore = computeRiskScore(base.riskScore, abuse?.abuseConfidence);

    const merged: IpQualityData = {
      ...(fallback ?? {}),
      ...base,
      abuseConfidence: abuse?.abuseConfidence,
      abuseReports: abuse?.abuseReports,
      riskScore,
      source: [primary?.source, fallback?.source, abuse ? "abuseipdb" : null]
        .filter(Boolean)
        .join("+")
    };

    return buildResponse(merged);
  } catch (error) {
    try {
      const fallback = await fetchIpApi(ip || undefined);
      return buildResponse(fallback);
    } catch (fallbackError) {
      return NextResponse.json(
        {
          ip: ip || "unknown",
          hosting: false,
          proxy: false,
          source: "failed"
        },
        { status: 200 }
      );
    }
  }
}
