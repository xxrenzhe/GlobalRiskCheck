"use client";

import { ScenarioId } from "@/lib/types";
import { SCENARIOS } from "@/lib/scenario";

const scenarioTone = {
  tiktok: "border-neon/40 text-neon",
  amazon: "border-yellow-400/40 text-yellow-300",
  indie: "border-white/20 text-white"
};

type Props = {
  value: ScenarioId;
  onChange: (value: ScenarioId) => void;
  disabled?: boolean;
};

export default function ScenarioSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {SCENARIOS.map((scenario) => {
        const active = scenario.id === value;
        return (
          <button
            key={scenario.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(scenario.id)}
            className={`rounded-full border px-4 py-2 text-xs transition ${
              active ? "bg-white/10" : "bg-black/40"
            } ${scenarioTone[scenario.id]} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <span className="font-semibold">{scenario.label}</span>
          </button>
        );
      })}
    </div>
  );
}
