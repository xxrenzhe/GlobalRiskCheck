import { NextRequest, NextResponse } from "next/server";

const ipqsKey = process.env.IPQS_API_KEY;

const buildResponse = (data: {
  ip: string;
  hosting: boolean;
  proxy: boolean;
  isp?: string;
  asn?: string;
  country?: string;
  source: string;
}) =>
  NextResponse.json({
    ip: data.ip,
    hosting: data.hosting,
    proxy: data.proxy,
    isp: data.isp,
    asn: data.asn,
    country: data.country,
    source: data.source
  });

const fetchIpApi = async (ip?: string) => {
  const fields = ["query", "isp", "as", "country", "hosting", "proxy"].join(",");
  const target = ip ? `http://ip-api.com/json/${ip}?fields=${fields}` : `http://ip-api.com/json/?fields=${fields}`;
  const response = await fetch(target, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("ip-api failed");
  }
  const data = (await response.json()) as {
    query: string;
    isp?: string;
    as?: string;
    country?: string;
    hosting?: boolean;
    proxy?: boolean;
  };
  return buildResponse({
    ip: data.query,
    hosting: Boolean(data.hosting),
    proxy: Boolean(data.proxy),
    isp: data.isp,
    asn: data.as,
    country: data.country,
    source: "ip-api"
  });
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
    country_code?: string;
    proxy?: boolean;
    vpn?: boolean;
    tor?: boolean;
    hosting?: boolean;
  };

  return buildResponse({
    ip: data.ip,
    hosting: Boolean(data.hosting),
    proxy: Boolean(data.proxy || data.vpn || data.tor),
    isp: data.ISP,
    asn: data.ASN,
    country: data.country_code,
    source: "ipqs"
  });
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";

  try {
    return await fetchIpqs(ip || undefined);
  } catch (error) {
    try {
      return await fetchIpApi(ip || undefined);
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
