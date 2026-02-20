import crypto from "crypto";
import { RiskLevel, ScenarioId } from "@/lib/types";

export type ShareHighlight = {
  label: string;
  severity: "warning" | "critical";
  deduction: number;
};

export type SharePayload = {
  version: 1;
  score: number;
  level: RiskLevel;
  scenarioId: ScenarioId;
  highlights: ShareHighlight[];
  createdAt: string;
  visitor?: string;
};

const secret = process.env.SHARE_SECRET || "dev-secret";

const base64Url = (input: string) => Buffer.from(input).toString("base64url");
const fromBase64Url = (input: string) => Buffer.from(input, "base64url").toString("utf8");

export const encodeShareToken = (payload: SharePayload) => {
  const body = base64Url(JSON.stringify(payload));
  const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
};

export const decodeShareToken = (token: string): SharePayload | null => {
  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (expected !== signature) {
    return null;
  }
  try {
    const parsed = JSON.parse(fromBase64Url(body)) as SharePayload;
    if (parsed.version !== 1) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
};
