"use client";

import { useEffect, useState } from "react";
import { PIPELINE_STAGE_LABELS, PipelineStage } from "@/ai/pipeline";
import { Sparkles } from "lucide-react";

const STAGE_ORDER: PipelineStage[] = [
  "strategy",
  "copy",
  "visual-direction",
  "rendering",
  "review",
];

export function GenerationLoader() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGE_ORDER.length - 1));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8 py-24 text-center animate-fadeIn">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ink text-paper">
        <Sparkles size={24} className="animate-pulseSoft" />
      </div>
      <div className="space-y-3">
        {STAGE_ORDER.map((stage, i) => (
          <p
            key={stage}
            className={
              i === stageIndex
                ? "font-display text-xl text-ink transition-all"
                : i < stageIndex
                ? "text-sm text-ink/30 line-through transition-all"
                : "text-sm text-ink/25 transition-all"
            }
          >
            {PIPELINE_STAGE_LABELS[stage]}
          </p>
        ))}
      </div>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-ink transition-all duration-700 ease-out"
          style={{ width: `${((stageIndex + 1) / STAGE_ORDER.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
