"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Bookmark, Sparkles } from "lucide-react";
import { SurpriseIdea } from "@/ai/agents/surpriseAgent";
import { FORMAT_LABELS, ContentFormat } from "@/types/brief";

export function SurpriseIdeaCard({
  idea,
  onSave,
}: {
  idea: SurpriseIdea;
  onSave: () => void;
}) {
  const router = useRouter();
  const format = (idea.recommendedFormat as ContentFormat) || "carrossel";

  function createContent() {
    const params = new URLSearchParams({
      topic: idea.title,
      format,
      objective: idea.objective || "educar",
    });
    router.push(`/?${params.toString()}`);
  }

  return (
    <Card className="flex flex-col gap-3 border-accent/15 bg-accent/[0.03] p-5">
      <h3 className="font-display text-base text-ink">{idea.title}</h3>
      <p className="text-sm text-ink/65">
        <span className="font-medium text-ink/80">Ângulo: </span>
        {idea.angle}
      </p>
      <p className="text-sm italic text-ink/50">&ldquo;{idea.hook}&rdquo;</p>
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="accent">{FORMAT_LABELS[format] || idea.recommendedFormat}</Badge>
        <Badge tone="neutral">{idea.objective}</Badge>
      </div>
      <div className="mt-1 flex gap-2">
        <Button size="sm" className="flex-1" onClick={createContent}>
          <Sparkles size={14} />
          Criar este post
        </Button>
        <Button size="sm" variant="outline" onClick={onSave}>
          <Bookmark size={14} />
        </Button>
      </div>
    </Card>
  );
}
