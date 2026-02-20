import { NextRequest, NextResponse } from "next/server";
import { encodeShareToken, SharePayload, ShareHighlight } from "@/lib/shareToken";
import { ScenarioId } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sanitizeHighlights = (input: unknown): ShareHighlight[] => {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .slice(0, 4)
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const typed = item as { label?: string; severity?: string; deduction?: number };
      const severity = typed.severity === "critical" ? "critical" : "warning";
      return {
        label: String(typed.label || "风险项"),
        severity,
        deduction: Number.isFinite(typed.deduction) ? Number(typed.deduction) : 0
      };
    })
    .filter(Boolean) as ShareHighlight[];
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    score?: number;
    level?: string;
    scenarioId?: ScenarioId;
    highlights?: ShareHighlight[];
    visitor?: string;
  };

  const score = Number.isFinite(body.score) ? Math.min(100, Math.max(0, Number(body.score))) : 0;
  const level = body.level === "A" || body.level === "B" || body.level === "C" || body.level === "D"
    ? body.level
    : "D";
  const allowedScenarios: ScenarioId[] = ["tiktok", "amazon", "indie"];
  const scenarioId: ScenarioId = allowedScenarios.includes(body.scenarioId as ScenarioId)
    ? (body.scenarioId as ScenarioId)
    : "tiktok";

  const payload: SharePayload = {
    version: 1,
    score,
    level,
    scenarioId,
    highlights: sanitizeHighlights(body.highlights),
    createdAt: new Date().toISOString(),
    visitor: body.visitor ? String(body.visitor).slice(0, 16) : undefined
  };

  const token = encodeShareToken(payload);
  return NextResponse.json({
    token,
    sharePath: `/r/${token}`
  });
}
